import { pool, query } from '../config/db.js';

const hotelSelect = (userParamIndex = null) => `
  h.id,
  h.name,
  h.category,
  h.location,
  h.description,
  h.image_url,
  h.created_by,
  h.latitude::float AS latitude,
  h.longitude::float AS longitude,
  COALESCE(ROUND((SELECT AVG(r.rating) FROM reviews r WHERE r.hotel_id = h.id)::numeric, 1), 0)::float AS average_rating,
  (SELECT COUNT(r.id)::int FROM reviews r WHERE r.hotel_id = h.id) AS review_count,
  COALESCE((
    SELECT json_agg(pi.image_url ORDER BY pi.id)
    FROM place_images pi
    WHERE pi.hotel_id = h.id
  ), '[]'::json) AS images,
  ${
    userParamIndex
      ? `EXISTS(SELECT 1 FROM favorites f WHERE f.hotel_id = h.id AND f.user_id = $${userParamIndex})`
      : 'FALSE'
  } AS is_favorite
`;

export const findHotels = async ({ search, category, userId }) => {
  const values = [];
  const filters = [];

  if (search) {
    values.push(`%${search}%`);
    filters.push(`h.name ILIKE $${values.length}`);
  }

  if (category) {
    values.push(category);
    filters.push(`h.category = $${values.length}`);
  }

  const userParamIndex = userId ? values.length + 1 : null;
  const params = userId ? [...values, userId] : values;
  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  const result = await query(
    `
      SELECT ${hotelSelect(userParamIndex)}
      FROM hotels h
      ${whereClause}
      ORDER BY h.name ASC
    `,
    params
  );

  return result.rows;
};

export const findHotelById = async (id, userId) => {
  const params = userId ? [id, userId] : [id];

  const result = await query(
    `
      SELECT ${hotelSelect(userId ? 2 : null)}
      FROM hotels h
      WHERE h.id = $1
    `,
    params
  );

  return result.rows[0];
};

export const findReviewsByHotelId = async (hotelId) => {
  const result = await query(
    `
      SELECT r.id, r.hotel_id, r.user_id, r.rating, r.review, r.created_at,
             u.name AS user_name, u.email AS user_email
      FROM reviews r
      INNER JOIN users u ON u.id = r.user_id
      WHERE r.hotel_id = $1
      ORDER BY r.created_at DESC, r.id DESC
    `,
    [hotelId]
  );

  return result.rows;
};

const insertImages = async (client, hotelId, images) => {
  if (!images.length) return;

  const values = images.flatMap((imageUrl) => [hotelId, imageUrl]);
  const placeholders = images
    .map((_, index) => `($${index * 2 + 1}, $${index * 2 + 2})`)
    .join(', ');

  await client.query(
    `INSERT INTO place_images (hotel_id, image_url) VALUES ${placeholders}`,
    values
  );
};

export const createHotel = async ({
  name,
  category,
  location,
  description,
  images,
  latitude,
  longitude,
  createdBy
}) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const primaryImage = images[0];
    const result = await client.query(
      `
        INSERT INTO hotels (name, category, location, description, image_url, created_by, latitude, longitude)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, name, category, location, description, image_url, created_by,
                  latitude::float AS latitude, longitude::float AS longitude
      `,
      [name, category, location, description, primaryImage, createdBy, latitude, longitude]
    );

    await insertImages(client, result.rows[0].id, images);
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const updateHotel = async ({
  id,
  name,
  category,
  location,
  description,
  images,
  latitude,
  longitude
}) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const primaryImage = images[0];
    const result = await client.query(
      `
        UPDATE hotels
        SET name = $1,
            category = $2,
            location = $3,
            description = $4,
            image_url = $5,
            latitude = $6,
            longitude = $7
        WHERE id = $8
        RETURNING id, name, category, location, description, image_url, created_by,
                  latitude::float AS latitude, longitude::float AS longitude
      `,
      [name, category, location, description, primaryImage, latitude, longitude, id]
    );

    await client.query('DELETE FROM place_images WHERE hotel_id = $1', [id]);
    await insertImages(client, id, images);
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const deleteHotelById = async (id) => {
  const result = await query('DELETE FROM hotels WHERE id = $1', [id]);
  return result.rowCount > 0;
};

export const findHotelsByCreator = async (userId) => {
  const result = await query(
    `
      SELECT ${hotelSelect(1)}
      FROM hotels h
      WHERE h.created_by = $1
      ORDER BY h.name ASC
    `,
    [userId]
  );

  return result.rows;
};

export const findNearbyHotels = async ({ hotelId, radiusKm = 5 }) => {
  const result = await query(
    `
      WITH current_place AS (
        SELECT latitude::float AS latitude, longitude::float AS longitude
        FROM hotels
        WHERE id = $1
      ),
      distances AS (
        SELECT h.id, h.name, h.category, h.location, h.image_url,
               h.latitude::float AS latitude,
               h.longitude::float AS longitude,
               COALESCE(ROUND((SELECT AVG(r.rating) FROM reviews r WHERE r.hotel_id = h.id)::numeric, 1), 0)::float AS average_rating,
               ROUND((
                 6371 * acos(
                   LEAST(1, GREATEST(-1,
                     cos(radians(cp.latitude)) *
                     cos(radians(h.latitude::float)) *
                     cos(radians(h.longitude::float) - radians(cp.longitude)) +
                     sin(radians(cp.latitude)) *
                     sin(radians(h.latitude::float))
                   ))
                 )
               )::numeric, 1)::float AS distance
        FROM hotels h
        CROSS JOIN current_place cp
        WHERE h.id <> $1
          AND h.latitude IS NOT NULL
          AND h.longitude IS NOT NULL
          AND cp.latitude IS NOT NULL
          AND cp.longitude IS NOT NULL
      )
      SELECT *
      FROM distances
      WHERE distance <= $2
      ORDER BY distance ASC
    `,
    [hotelId, radiusKm]
  );

  return result.rows;
};

export const findTopRatedHotels = async () => {
  const result = await query(
    `
      SELECT ${hotelSelect()}
      FROM hotels h
      ORDER BY average_rating DESC, review_count DESC, h.name ASC
      LIMIT 6
    `
  );

  return result.rows;
};

export const findRecentHotels = async () => {
  const result = await query(
    `
      SELECT ${hotelSelect()}
      FROM hotels h
      ORDER BY h.id DESC
      LIMIT 6
    `
  );

  return result.rows;
};

export const findPopularHotels = async () => {
  const result = await query(
    `
      SELECT ${hotelSelect()}
      FROM hotels h
      ORDER BY review_count DESC, average_rating DESC, h.name ASC
      LIMIT 6
    `
  );

  return result.rows;
};

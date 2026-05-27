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
  COALESCE(h.wifi, false) AS wifi,
  COALESCE(h.parking, false) AS parking,
  COALESCE(h.outdoor_seating, false) AS outdoor_seating,
  COALESCE(h.pet_friendly, false) AS pet_friendly,
  COALESCE(h.air_conditioning, false) AS air_conditioning,
  COALESCE(h.live_music, false) AS live_music,
  COALESCE(h.family_friendly, false) AS family_friendly,
  h.price_range,
  COALESCE(ROUND((SELECT AVG(r.rating) FROM reviews r WHERE r.hotel_id = h.id)::numeric, 1), 0)::float AS average_rating,
  (SELECT COUNT(r.id)::int FROM reviews r WHERE r.hotel_id = h.id) AS review_count,
  (SELECT COUNT(f.id)::int FROM favorites f WHERE f.hotel_id = h.id) AS favorite_count,
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

const amenityColumns = [
  'wifi',
  'parking',
  'outdoor_seating',
  'pet_friendly',
  'air_conditioning',
  'live_music',
  'family_friendly'
];

const isTruthyFilter = (value) => String(value).toLowerCase() === 'true';

export const findHotels = async ({
  search,
  category,
  priceRange,
  minRating,
  amenities = {},
  userId
}) => {
  const values = [];
  const filters = [];

  if (search) {
    values.push(`%${search}%`);
    filters.push(`(h.name ILIKE $${values.length} OR h.location ILIKE $${values.length})`);
  }

  if (category) {
    values.push(category);
    filters.push(`h.category = $${values.length}`);
  }

  if (priceRange) {
    values.push(priceRange);
    filters.push(`h.price_range = $${values.length}`);
  }

  amenityColumns.forEach((column) => {
    if (isTruthyFilter(amenities[column])) {
      filters.push(`COALESCE(h.${column}, false) = true`);
    }
  });

  if (minRating) {
    values.push(Number(minRating));
    filters.push(`COALESCE((SELECT AVG(r.rating) FROM reviews r WHERE r.hotel_id = h.id), 0) >= $${values.length}`);
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
  wifi,
  parking,
  outdoorSeating,
  petFriendly,
  airConditioning,
  liveMusic,
  familyFriendly,
  priceRange,
  createdBy
}) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const primaryImage = images[0];
    const result = await client.query(
      `
        INSERT INTO hotels (
          name, category, location, description, image_url, created_by, latitude, longitude,
          wifi, parking, outdoor_seating, pet_friendly, air_conditioning, live_music,
          family_friendly, price_range
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING id, name, category, location, description, image_url, created_by,
                  latitude::float AS latitude, longitude::float AS longitude,
                  wifi, parking, outdoor_seating, pet_friendly, air_conditioning,
                  live_music, family_friendly, price_range
      `,
      [
        name,
        category,
        location,
        description,
        primaryImage,
        createdBy,
        latitude,
        longitude,
        wifi,
        parking,
        outdoorSeating,
        petFriendly,
        airConditioning,
        liveMusic,
        familyFriendly,
        priceRange
      ]
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
  longitude,
  wifi,
  parking,
  outdoorSeating,
  petFriendly,
  airConditioning,
  liveMusic,
  familyFriendly,
  priceRange
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
            longitude = $7,
            wifi = $8,
            parking = $9,
            outdoor_seating = $10,
            pet_friendly = $11,
            air_conditioning = $12,
            live_music = $13,
            family_friendly = $14,
            price_range = $15
        WHERE id = $16
        RETURNING id, name, category, location, description, image_url, created_by,
                  latitude::float AS latitude, longitude::float AS longitude,
                  wifi, parking, outdoor_seating, pet_friendly, air_conditioning,
                  live_music, family_friendly, price_range
      `,
      [
        name,
        category,
        location,
        description,
        primaryImage,
        latitude,
        longitude,
        wifi,
        parking,
        outdoorSeating,
        petFriendly,
        airConditioning,
        liveMusic,
        familyFriendly,
        priceRange,
        id
      ]
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
        SELECT h.id, h.name, h.category, h.location, h.description, h.image_url,
               h.latitude::float AS latitude,
               h.longitude::float AS longitude,
               COALESCE(h.wifi, false) AS wifi,
               COALESCE(h.parking, false) AS parking,
               COALESCE(h.outdoor_seating, false) AS outdoor_seating,
               COALESCE(h.pet_friendly, false) AS pet_friendly,
               COALESCE(h.air_conditioning, false) AS air_conditioning,
               COALESCE(h.live_music, false) AS live_music,
               COALESCE(h.family_friendly, false) AS family_friendly,
               h.price_range,
               COALESCE(ROUND((SELECT AVG(r.rating) FROM reviews r WHERE r.hotel_id = h.id)::numeric, 1), 0)::float AS average_rating,
               (SELECT COUNT(r.id)::int FROM reviews r WHERE r.hotel_id = h.id) AS review_count,
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

export const findTopRatedHotels = async ({ category = '', limit = 10 } = {}) => {
  const params = [];
  const filters = [];

  if (category) {
    params.push(category);
    filters.push(`h.category = $${params.length}`);
  }

  params.push(limit);

  const result = await query(
    `
      SELECT ${hotelSelect()}
      FROM hotels h
      LEFT JOIN reviews tr ON tr.hotel_id = h.id
      ${filters.length ? `WHERE ${filters.join(' AND ')}` : ''}
      GROUP BY h.id
      ORDER BY COALESCE(AVG(tr.rating), 0) DESC,
               review_count DESC,
               h.name ASC
      LIMIT $${params.length}
    `,
    params
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

export const findTrendingHotels = async ({ limit = 10 } = {}) => {
  const result = await query(
    `
      SELECT ${hotelSelect()},
             (
               ((SELECT COUNT(f.id)::int FROM favorites f WHERE f.hotel_id = h.id) * 2)
               + (SELECT COUNT(r.id)::int FROM reviews r WHERE r.hotel_id = h.id)
               + (SELECT COUNT(r_recent.id)::int FROM reviews r_recent WHERE r_recent.hotel_id = h.id AND r_recent.created_at >= NOW() - INTERVAL '30 days')
               + (SELECT COUNT(f_recent.id)::int FROM favorites f_recent WHERE f_recent.hotel_id = h.id AND f_recent.created_at >= NOW() - INTERVAL '30 days')
             )::int AS trending_score
      FROM hotels h
      ORDER BY trending_score DESC, average_rating DESC, h.name ASC
      LIMIT $1
    `,
    [limit]
  );

  return result.rows;
};

export const findRecommendedHotels = async ({ hotelId, limit = 5 }) => {
  const result = await query(
    `
      WITH current_place AS (
        SELECT *,
               COALESCE((SELECT AVG(r.rating) FROM reviews r WHERE r.hotel_id = hotels.id), 0)::float AS average_rating
        FROM hotels
        WHERE id = $1
      ),
      candidates AS (
        SELECT ${hotelSelect()},
               ROUND((
                 6371 * acos(
                   LEAST(1, GREATEST(-1,
                     cos(radians(cp.latitude::float)) *
                     cos(radians(h.latitude::float)) *
                     cos(radians(h.longitude::float) - radians(cp.longitude::float)) +
                     sin(radians(cp.latitude::float)) *
                     sin(radians(h.latitude::float))
                   ))
                 )
               )::numeric, 1)::float AS distance,
               (
                 CASE WHEN h.category = cp.category THEN 5 ELSE 0 END +
                 CASE WHEN h.price_range IS NOT DISTINCT FROM cp.price_range AND h.price_range IS NOT NULL THEN 3 ELSE 0 END +
                 CASE WHEN COALESCE(h.wifi, false) = COALESCE(cp.wifi, false) AND COALESCE(h.wifi, false) THEN 2 ELSE 0 END +
                 CASE WHEN COALESCE(h.parking, false) = COALESCE(cp.parking, false) AND COALESCE(h.parking, false) THEN 2 ELSE 0 END +
                 CASE WHEN COALESCE(h.outdoor_seating, false) = COALESCE(cp.outdoor_seating, false) AND COALESCE(h.outdoor_seating, false) THEN 2 ELSE 0 END +
                 CASE WHEN COALESCE(h.pet_friendly, false) = COALESCE(cp.pet_friendly, false) AND COALESCE(h.pet_friendly, false) THEN 2 ELSE 0 END +
                 CASE WHEN COALESCE(h.air_conditioning, false) = COALESCE(cp.air_conditioning, false) AND COALESCE(h.air_conditioning, false) THEN 2 ELSE 0 END +
                 CASE WHEN COALESCE(h.live_music, false) = COALESCE(cp.live_music, false) AND COALESCE(h.live_music, false) THEN 2 ELSE 0 END +
                 CASE WHEN COALESCE(h.family_friendly, false) = COALESCE(cp.family_friendly, false) AND COALESCE(h.family_friendly, false) THEN 2 ELSE 0 END +
                 CASE
                   WHEN h.latitude IS NOT NULL AND h.longitude IS NOT NULL
                    AND cp.latitude IS NOT NULL AND cp.longitude IS NOT NULL
                    AND (
                      6371 * acos(
                        LEAST(1, GREATEST(-1,
                          cos(radians(cp.latitude::float)) *
                          cos(radians(h.latitude::float)) *
                          cos(radians(h.longitude::float) - radians(cp.longitude::float)) +
                          sin(radians(cp.latitude::float)) *
                          sin(radians(h.latitude::float))
                        ))
                      )
                    ) <= 5 THEN 5
                   ELSE 0
                 END +
                 CASE WHEN COALESCE((SELECT AVG(r.rating) FROM reviews r WHERE r.hotel_id = h.id), 0) >= 4 THEN 3 ELSE 0 END
               )::int AS recommendation_score
        FROM hotels h
        CROSS JOIN current_place cp
        WHERE h.id <> $1
      )
      SELECT *
      FROM candidates
      ORDER BY recommendation_score DESC, average_rating DESC, distance ASC NULLS LAST, name ASC
      LIMIT $2
    `,
    [hotelId, limit]
  );

  return result.rows;
};

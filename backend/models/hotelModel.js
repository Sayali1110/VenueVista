import { query } from '../config/db.js';

const ratingSelect = `
  COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0)::float AS average_rating,
  COUNT(r.id)::int AS review_count
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

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  const favoriteJoin = userId
    ? `LEFT JOIN favorites f ON f.hotel_id = h.id AND f.user_id = $${values.length + 1}`
    : '';
  const favoriteSelect = userId ? ', (f.id IS NOT NULL) AS is_favorite' : ', FALSE AS is_favorite';
  const groupByFavorite = userId ? ', f.id' : '';
  const params = userId ? [...values, userId] : values;

  const result = await query(
    `
      SELECT h.id, h.name, h.category, h.location, h.description, h.image_url, h.created_by,
             ${ratingSelect}
             ${favoriteSelect}
      FROM hotels h
      LEFT JOIN reviews r ON r.hotel_id = h.id
      ${favoriteJoin}
      ${whereClause}
      GROUP BY h.id ${groupByFavorite}
      ORDER BY h.name ASC
    `,
    params
  );

  return result.rows;
};

export const findHotelById = async (id, userId) => {
  const favoriteSelect = userId
    ? ', EXISTS(SELECT 1 FROM favorites f WHERE f.hotel_id = h.id AND f.user_id = $2) AS is_favorite'
    : ', FALSE AS is_favorite';
  const params = userId ? [id, userId] : [id];

  const result = await query(
    `
      SELECT h.id, h.name, h.category, h.location, h.description, h.image_url, h.created_by,
             ${ratingSelect}
             ${favoriteSelect}
      FROM hotels h
      LEFT JOIN reviews r ON r.hotel_id = h.id
      WHERE h.id = $1
      GROUP BY h.id
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

export const createHotel = async ({ name, category, location, description, image_url, createdBy }) => {
  const result = await query(
    `
      INSERT INTO hotels (name, category, location, description, image_url, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, category, location, description, image_url, created_by
    `,
    [name, category, location, description, image_url, createdBy]
  );

  return result.rows[0];
};

export const updateHotel = async ({ id, name, category, location, description, image_url }) => {
  const result = await query(
    `
      UPDATE hotels
      SET name = $1,
          category = $2,
          location = $3,
          description = $4,
          image_url = $5
      WHERE id = $6
      RETURNING id, name, category, location, description, image_url, created_by
    `,
    [name, category, location, description, image_url, id]
  );

  return result.rows[0];
};

export const deleteHotelById = async (id) => {
  const result = await query('DELETE FROM hotels WHERE id = $1', [id]);
  return result.rowCount > 0;
};

export const findHotelsByCreator = async (userId) => {
  const result = await query(
    `
      SELECT h.id, h.name, h.category, h.location, h.description, h.image_url, h.created_by,
             COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0)::float AS average_rating,
             COUNT(r.id)::int AS review_count,
             EXISTS(SELECT 1 FROM favorites f WHERE f.hotel_id = h.id AND f.user_id = $1) AS is_favorite
      FROM hotels h
      LEFT JOIN reviews r ON r.hotel_id = h.id
      WHERE h.created_by = $1
      GROUP BY h.id
      ORDER BY h.name ASC
    `,
    [userId]
  );

  return result.rows;
};

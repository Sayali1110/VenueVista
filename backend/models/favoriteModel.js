import { query } from '../config/db.js';

export const addFavorite = async ({ userId, hotelId }) => {
  const result = await query(
    `
      INSERT INTO favorites (user_id, hotel_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, hotel_id) DO NOTHING
      RETURNING id, user_id, hotel_id, created_at
    `,
    [userId, hotelId]
  );

  if (result.rows[0]) {
    return result.rows[0];
  }

  const existing = await query(
    'SELECT id, user_id, hotel_id, created_at FROM favorites WHERE user_id = $1 AND hotel_id = $2',
    [userId, hotelId]
  );

  return existing.rows[0];
};

export const removeFavorite = async ({ userId, hotelId }) => {
  const result = await query(
    'DELETE FROM favorites WHERE user_id = $1 AND hotel_id = $2',
    [userId, hotelId]
  );

  return result.rowCount > 0;
};

export const findFavoritesByUserId = async (userId) => {
  const result = await query(
    `
      SELECT h.id, h.name, h.category, h.location, h.description, h.image_url, h.created_by,
             COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0)::float AS average_rating,
             COUNT(r.id)::int AS review_count,
             TRUE AS is_favorite
      FROM favorites f
      INNER JOIN hotels h ON h.id = f.hotel_id
      LEFT JOIN reviews r ON r.hotel_id = h.id
      WHERE f.user_id = $1
      GROUP BY h.id, f.created_at
      ORDER BY f.created_at DESC
    `,
    [userId]
  );

  return result.rows;
};


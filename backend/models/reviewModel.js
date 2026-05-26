import { query } from '../config/db.js';

export const createReview = async ({ hotel_id, user_id, rating, review }) => {
  const result = await query(
    `
      INSERT INTO reviews (hotel_id, user_id, rating, review)
      VALUES ($1, $2, $3, $4)
      RETURNING id, hotel_id, user_id, rating, review, created_at
    `,
    [hotel_id, user_id, rating, review]
  );

  return result.rows[0];
};

export const deleteReviewById = async (id) => {
  const result = await query(
    'DELETE FROM reviews WHERE id = $1 RETURNING id',
    [id]
  );

  return result.rowCount > 0;
};


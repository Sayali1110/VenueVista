import { query } from '../config/db.js';

const ratingSelect = `
  COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0)::float AS average_rating,
  COUNT(r.id)::int AS review_count
`;

export const findHotels = async ({ search, category }) => {
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

  const result = await query(
    `
      SELECT h.id, h.name, h.category, h.location, h.description, h.image_url,
             ${ratingSelect}
      FROM hotels h
      LEFT JOIN reviews r ON r.hotel_id = h.id
      ${whereClause}
      GROUP BY h.id
      ORDER BY h.name ASC
    `,
    values
  );

  return result.rows;
};

export const findHotelById = async (id) => {
  const result = await query(
    `
      SELECT h.id, h.name, h.category, h.location, h.description, h.image_url,
             ${ratingSelect}
      FROM hotels h
      LEFT JOIN reviews r ON r.hotel_id = h.id
      WHERE h.id = $1
      GROUP BY h.id
    `,
    [id]
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


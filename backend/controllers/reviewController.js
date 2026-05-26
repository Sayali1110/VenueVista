import { createReview, deleteReviewById } from '../models/reviewModel.js';

const validateReviewPayload = ({ hotel_id, user_id, rating, review }) => {
  const errors = [];

  if (!Number.isInteger(Number(hotel_id)) || Number(hotel_id) <= 0) {
    errors.push('hotel_id must be a positive integer.');
  }

  if (!Number.isInteger(Number(user_id)) || Number(user_id) <= 0) {
    errors.push('user_id must be a positive integer.');
  }

  if (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
    errors.push('rating must be an integer between 1 and 5.');
  }

  if (!review || String(review).trim().length < 3) {
    errors.push('review must be at least 3 characters long.');
  }

  return errors;
};

export const addReview = async (req, res, next) => {
  try {
    const errors = validateReviewPayload(req.body);

    if (errors.length) {
      return res.status(400).json({ message: 'Validation failed.', errors });
    }

    const created = await createReview({
      hotel_id: Number(req.body.hotel_id),
      user_id: Number(req.body.user_id),
      rating: Number(req.body.rating),
      review: String(req.body.review).trim()
    });

    res.status(201).json({ data: created });
  } catch (error) {
    if (error.code === '23503') {
      error.statusCode = 400;
      error.message = 'Invalid hotel_id or user_id.';
    }
    next(error);
  }
};

export const removeReview = async (req, res, next) => {
  try {
    const reviewId = Number(req.params.id);

    if (!Number.isInteger(reviewId) || reviewId <= 0) {
      return res.status(400).json({ message: 'Review id must be a positive integer.' });
    }

    const deleted = await deleteReviewById(reviewId);

    if (!deleted) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};


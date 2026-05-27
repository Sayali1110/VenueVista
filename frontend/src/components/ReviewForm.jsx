import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { createReview } from '../api/reviews.js';
import { useAuth } from '../context/AuthContext.jsx';

function ReviewForm({ hotelId, open, onClose, onSubmitted }) {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setRating(5);
    setReview('');
    setError('');
  };

  const handleClose = () => {
    if (!submitting) {
      reset();
      onClose();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!isAuthenticated) {
      setError('Please log in to write a review.');
      return;
    }

    if (!rating) {
      setError('Please select a rating.');
      return;
    }

    if (review.trim().length < 3) {
      setError('Please enter a review with at least 3 characters.');
      return;
    }

    try {
      setSubmitting(true);
      await createReview({
        hotel_id: Number(hotelId),
        rating,
        review: review.trim()
      });
      reset();
      onSubmitted();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RateReviewIcon color="primary" />
          Write a review
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            {error ? <Alert severity="error">{error}</Alert> : null}
            <Box>
              <Typography component="legend" variant="body2" sx={{ mb: 0.75, fontWeight: 700 }}>
                Rating
              </Typography>
              <Rating
                name="rating"
                value={rating}
                onChange={(_event, value) => setRating(value || 0)}
                size="large"
              />
            </Box>
            <TextField
              label="Review"
              value={review}
              onChange={(event) => setReview(event.target.value)}
              multiline
              minRows={4}
              fullWidth
              required
              inputProps={{ maxLength: 1000 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit review'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default ReviewForm;

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Rating,
  Stack,
  Typography
} from '@mui/material';
import AddCommentIcon from '@mui/icons-material/AddComment';
import PlaceIcon from '@mui/icons-material/Place';
import ReviewForm from '../components/ReviewForm.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';
import { getHotelById } from '../api/hotels.js';

function HotelDetailsPage() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewOpen, setReviewOpen] = useState(false);

  const loadHotel = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getHotelById(id);
      setHotel(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadHotel();
  }, [loadHotel]);

  if (loading) {
    return <LoadingState label="Loading place details..." />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  if (!hotel) {
    return null;
  }

  return (
    <Stack spacing={4}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={hotel.image_url}
            alt={hotel.name}
            sx={{
              width: '100%',
              aspectRatio: '4 / 3',
              objectFit: 'cover',
              borderRadius: 2,
              boxShadow: '0 18px 44px rgba(31, 45, 43, 0.16)'
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={2.5}>
            <Chip
              label={hotel.category}
              color={hotel.category === 'Cafe' ? 'secondary' : 'primary'}
              sx={{ alignSelf: 'flex-start' }}
            />
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {hotel.name}
              </Typography>
              <Stack direction="row" spacing={0.75} alignItems="center" color="text.secondary">
                <PlaceIcon fontSize="small" />
                <Typography>{hotel.location || 'Location unavailable'}</Typography>
              </Stack>
            </Box>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Rating value={Number(hotel.average_rating)} precision={0.5} readOnly />
              <Typography variant="h6">{Number(hotel.average_rating).toFixed(1)}</Typography>
              <Typography variant="body2" color="text.secondary">
                ({hotel.review_count} reviews)
              </Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary">
              {hotel.description}
            </Typography>
            <Box>
              <Button
                variant="contained"
                startIcon={<AddCommentIcon />}
                onClick={() => setReviewOpen(true)}
              >
                Add review
              </Button>
            </Box>
          </Stack>
        </Grid>
      </Grid>

      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          Reviews
        </Typography>
        <Stack spacing={2}>
          {hotel.reviews.map((review) => (
            <Paper key={review.id} sx={{ p: 2.5 }}>
              <Stack spacing={1}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  spacing={1}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {review.user_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(review.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Rating value={Number(review.rating)} readOnly size="small" />
                </Stack>
                <Divider />
                <Typography variant="body2">{review.review}</Typography>
              </Stack>
            </Paper>
          ))}
          {!hotel.reviews.length ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6">No reviews yet</Typography>
              <Typography variant="body2" color="text.secondary">
                Be the first to share your experience.
              </Typography>
            </Paper>
          ) : null}
        </Stack>
      </Box>

      <ReviewForm
        hotelId={hotel.id}
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onSubmitted={loadHotel}
      />
    </Stack>
  );
}

export default HotelDetailsPage;


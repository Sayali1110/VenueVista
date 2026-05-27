import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Grid,
  Paper,
  Rating,
  Skeleton,
  Stack,
  Typography
} from '@mui/material';
import AddCommentIcon from '@mui/icons-material/AddComment';
import PlaceIcon from '@mui/icons-material/Place';
import ImageGallery from '../components/ImageGallery.jsx';
import PlaceMap from '../components/PlaceMap.jsx';
import ReviewForm from '../components/ReviewForm.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';
import HotelCard from '../components/HotelCard.jsx';
import { getEnabledAmenities } from '../constants/amenities.js';
import { getHotelById, getHotelRecommendations, getNearbyHotels } from '../api/hotels.js';

function NearbyPlaces({ hotelId }) {
  const [nearby, setNearby] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadNearby = async () => {
      try {
        setLoading(true);
        setError('');
        setNearby(await getNearbyHotels(hotelId));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadNearby();
  }, [hotelId]);

  return (
    <Stack spacing={2}>
      <Typography variant="h5" component="h2">
        Nearby Places
      </Typography>
      {error ? <ErrorAlert message={error} /> : null}
      {loading ? (
        <Grid container spacing={2}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} sm={4} key={item}>
              <Skeleton variant="rounded" height={190} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {nearby.map((place) => (
            <Grid item xs={12} sm={6} md={4} key={place.id}>
              <Card component={RouterLink} to={`/hotels/${place.id}`} sx={{ display: 'block', textDecoration: 'none' }}>
                <CardMedia component="img" height="140" image={place.image_url} alt={place.name} sx={{ objectFit: 'cover' }} />
                <CardContent>
                  <Typography variant="h6" color="text.primary">
                    {place.name}
                  </Typography>
                  <Typography variant="body2" color="primary.main" fontWeight={700}>
                    {place.distance.toFixed(1)} km away
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                    <Rating value={Number(place.average_rating)} precision={0.5} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary">
                      {Number(place.average_rating).toFixed(1)}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {!nearby.length ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No nearby places found within 5 km.
                </Typography>
              </Paper>
            </Grid>
          ) : null}
        </Grid>
      )}
    </Stack>
  );
}

function RecommendedPlaces({ hotelId }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        setError('');
        setRecommendations(await getHotelRecommendations(hotelId));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [hotelId]);

  return (
    <Stack spacing={2}>
      <Typography variant="h5" component="h2">
        Recommended Places
      </Typography>
      {error ? <ErrorAlert message={error} /> : null}
      {loading ? (
        <Grid container spacing={2}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Skeleton variant="rounded" height={360} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {recommendations.map((place) => (
            <Grid item xs={12} sm={6} md={4} key={place.id}>
              <HotelCard hotel={place} compactAmenities />
            </Grid>
          ))}
          {!recommendations.length ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No similar places found.
                </Typography>
              </Paper>
            </Grid>
          ) : null}
        </Grid>
      )}
    </Stack>
  );
}

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

  const images = hotel.images?.length ? hotel.images : [hotel.image_url].filter(Boolean);
  const enabledAmenities = getEnabledAmenities(hotel);

  return (
    <Stack spacing={4}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <ImageGallery images={images} title={hotel.name} />
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
            <Stack spacing={1}>
              <Typography variant="subtitle1" fontWeight={700}>
                Amenities
              </Typography>
              <Stack direction="row" gap={1} flexWrap="wrap">
                {enabledAmenities.map(({ key, label, icon: Icon }) => (
                  <Chip key={key} icon={<Icon />} label={label} variant="outlined" />
                ))}
                {hotel.price_range ? <Chip label={hotel.price_range} color="primary" /> : null}
                {!enabledAmenities.length && !hotel.price_range ? (
                  <Typography variant="body2" color="text.secondary">
                    Amenities not listed.
                  </Typography>
                ) : null}
              </Stack>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Coordinates: {Number(hotel.latitude).toFixed(6)}, {Number(hotel.longitude).toFixed(6)}
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
          Map
        </Typography>
        <PlaceMap name={hotel.name} latitude={hotel.latitude} longitude={hotel.longitude} />
      </Box>

      <NearbyPlaces hotelId={hotel.id} />
      <RecommendedPlaces hotelId={hotel.id} />

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

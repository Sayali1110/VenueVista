import { useEffect, useState } from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import HotelCard from '../components/HotelCard.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';
import { getFavorites } from '../api/favorites.js';

function MyFavoritesPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        setError('');
        setHotels(await getFavorites());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const handleFavoriteChange = (hotelId, isFavorite) => {
    if (!isFavorite) {
      setHotels((current) => current.filter((hotel) => hotel.id !== hotelId));
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          My Favorites
        </Typography>
        <Typography color="text.secondary">Your saved cafes and hotels.</Typography>
      </Box>
      <ErrorAlert message={error} />
      {loading ? (
        <LoadingState label="Loading favorites..." />
      ) : (
        <Grid container spacing={3}>
          {hotels.map((hotel) => (
            <Grid item xs={12} sm={6} md={4} key={hotel.id}>
              <HotelCard hotel={hotel} onFavoriteChange={handleFavoriteChange} />
            </Grid>
          ))}
          {!hotels.length ? (
            <Grid item xs={12}>
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h6">No favorites yet</Typography>
                <Typography variant="body2" color="text.secondary">
                  Save places from the home page to see them here.
                </Typography>
              </Box>
            </Grid>
          ) : null}
        </Grid>
      )}
    </Stack>
  );
}

export default MyFavoritesPage;


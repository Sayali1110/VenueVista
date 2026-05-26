import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HotelCard from '../components/HotelCard.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';
import { getHotels } from '../api/hotels.js';

function HomePage() {
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const filters = useMemo(() => ({ search, category }), [search, category]);

  useEffect(() => {
    const timeoutId = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getHotels(filters);
        setHotels(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [filters]);

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Discover cafes and hotels
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search local favorites, compare ratings, and see what guests are saying.
        </Typography>
      </Box>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{ alignItems: { xs: 'stretch', md: 'center' } }}
      >
        <TextField
          fullWidth
          label="Search by name"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
          }}
        />
        <FormControl sx={{ minWidth: { xs: '100%', md: 220 } }}>
          <InputLabel id="category-filter-label">Category</InputLabel>
          <Select
            labelId="category-filter-label"
            label="Category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Cafe">Cafe</MenuItem>
            <MenuItem value="Hotel">Hotel</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <ErrorAlert message={error} />

      {loading ? (
        <LoadingState label="Loading recommendations..." />
      ) : (
        <Grid container spacing={3}>
          {hotels.map((hotel) => (
            <Grid item xs={12} sm={6} md={4} key={hotel.id}>
              <HotelCard hotel={hotel} />
            </Grid>
          ))}
          {!hotels.length ? (
            <Grid item xs={12}>
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h6">No places found</Typography>
                <Typography variant="body2" color="text.secondary">
                  Try a different search or category.
                </Typography>
              </Box>
            </Grid>
          ) : null}
        </Grid>
      )}
    </Stack>
  );
}

export default HomePage;


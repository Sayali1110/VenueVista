import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HotelCard from '../components/HotelCard.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';
import { getHotels, getPopularHotels, getRecentHotels, getTopRatedHotels } from '../api/hotels.js';

function PlaceSection({ title, places, loading }) {
  return (
    <Stack spacing={2}>
      <Typography variant="h5" component="h2">
        {title}
      </Typography>
      <Grid container spacing={3}>
        {loading
          ? [1, 2, 3].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Skeleton variant="rounded" height={340} />
              </Grid>
            ))
          : places.map((hotel) => (
              <Grid item xs={12} sm={6} md={4} key={hotel.id}>
                <HotelCard hotel={hotel} />
              </Grid>
            ))}
      </Grid>
    </Stack>
  );
}

function HomePage() {
  const [hotels, setHotels] = useState([]);
  const [sections, setSections] = useState({ topRated: [], recent: [], popular: [] });
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [error, setError] = useState('');

  const filters = useMemo(() => ({ search, category }), [search, category]);

  useEffect(() => {
    const loadSections = async () => {
      try {
        setSectionsLoading(true);
        const [topRated, recent, popular] = await Promise.all([
          getTopRatedHotels(),
          getRecentHotels(),
          getPopularHotels()
        ]);
        setSections({ topRated, recent, popular });
      } catch (err) {
        setError(err.message);
      } finally {
        setSectionsLoading(false);
      }
    };

    loadSections();
  }, []);

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
    <Stack spacing={5}>
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

      <Stack spacing={2}>
        <Typography variant="h5" component="h2">
          All Places
        </Typography>
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

      <PlaceSection title="Top Rated Places" places={sections.topRated} loading={sectionsLoading} />
      <PlaceSection title="Recent Places" places={sections.recent} loading={sectionsLoading} />
      <PlaceSection title="Popular Places" places={sections.popular} loading={sectionsLoading} />
    </Stack>
  );
}

export default HomePage;

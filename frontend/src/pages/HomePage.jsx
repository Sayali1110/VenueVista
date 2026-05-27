import { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import HotelCard from '../components/HotelCard.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';
import AdvancedFiltersDrawer from '../components/AdvancedFiltersDrawer.jsx';
import PlaceCarouselSection from '../components/PlaceCarouselSection.jsx';
import {
  getHotels,
  getPopularHotels,
  getRecentHotels,
  getTopRatedHotels,
  getTrendingHotels
} from '../api/hotels.js';
import { amenityOptions } from '../constants/amenities.js';

const emptyFilters = {
  search: '',
  category: '',
  priceRange: '',
  minRating: 0,
  amenities: Object.fromEntries(amenityOptions.map(({ key }) => [key, false]))
};

const buildFilterChips = (filters) => {
  const chips = [];

  if (filters.category) chips.push({ key: 'category', label: filters.category });
  if (filters.priceRange) chips.push({ key: 'priceRange', label: filters.priceRange });
  if (filters.minRating) chips.push({ key: 'minRating', label: `${filters.minRating}+ stars` });

  amenityOptions.forEach(({ key, label }) => {
    if (filters.amenities[key]) chips.push({ key, label });
  });

  return chips;
};

function HomePage() {
  const [hotels, setHotels] = useState([]);
  const [sections, setSections] = useState({
    topRated: [],
    recommendedCafes: [],
    trending: [],
    popular: [],
    recent: []
  });
  const [filters, setFilters] = useState(emptyFilters);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [error, setError] = useState('');

  const selectedChips = useMemo(() => buildFilterChips(filters), [filters]);
  const activeFilterCount = selectedChips.length;

  useEffect(() => {
    const loadSections = async () => {
      try {
        setSectionsLoading(true);
        const [topRated, recommendedCafes, trending, popular, recent] = await Promise.all([
          getTopRatedHotels({ limit: 10 }),
          getTopRatedHotels({ category: 'Cafe', limit: 10 }),
          getTrendingHotels({ limit: 10 }),
          getPopularHotels(),
          getRecentHotels()
        ]);
        setSections({ topRated, recommendedCafes, trending, popular, recent });
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
        setHotels(await getHotels(filters));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [filters]);

  const updateSearch = (event) => {
    setFilters((current) => ({ ...current, search: event.target.value }));
  };

  const clearFilters = () => {
    setFilters((current) => ({ ...emptyFilters, search: current.search }));
  };

  const clearAll = () => setFilters(emptyFilters);

  return (
    <Stack spacing={5}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Discover cafes and hotels
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search by name or location, compare ratings, and find places that match your style.
        </Typography>
      </Box>

      <Stack spacing={2}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <TextField
            fullWidth
            label="Search places or locations"
            value={filters.search}
            onChange={updateSearch}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
            }}
          />
          <Tooltip title="Open filters">
            <Badge badgeContent={activeFilterCount} color="secondary">
              <IconButton
                aria-label="Open filters"
                onClick={() => setDrawerOpen(true)}
                sx={{
                  width: 56,
                  height: 56,
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper'
                }}
              >
                <FilterListIcon />
              </IconButton>
            </Badge>
          </Tooltip>
        </Stack>

        {selectedChips.length ? (
          <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
            {selectedChips.map((chip) => (
              <Chip key={chip.key} label={chip.label} size="small" />
            ))}
            <Button size="small" startIcon={<RestartAltIcon />} onClick={clearFilters}>
              Clear filters
            </Button>
          </Stack>
        ) : null}
      </Stack>

      <AdvancedFiltersDrawer
        open={drawerOpen}
        filters={filters}
        selectedChips={selectedChips}
        onClose={() => setDrawerOpen(false)}
        onChange={setFilters}
        onClear={clearAll}
      />

      <ErrorAlert message={error} />

      <Stack spacing={2}>
        <Typography variant="h5" component="h2">
          All Places
        </Typography>
        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Skeleton variant="rounded" height={360} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={3}>
            {hotels.map((hotel) => (
              <Grid item xs={12} sm={6} md={4} key={hotel.id}>
                <HotelCard hotel={hotel} compactAmenities />
              </Grid>
            ))}
            {!hotels.length ? (
              <Grid item xs={12}>
                <Box sx={{ py: 8, textAlign: 'center' }}>
                  <Typography variant="h6">No places found</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try a different search, location, or filter mix.
                  </Typography>
                </Box>
              </Grid>
            ) : null}
          </Grid>
        )}
      </Stack>

      <PlaceCarouselSection
        title="Trending Places"
        places={sections.trending}
        loading={sectionsLoading}
        cardProps={{ badge: 'Trending', compactAmenities: true }}
      />
      <PlaceCarouselSection
        title="Top Rated Places"
        places={sections.topRated}
        loading={sectionsLoading}
        cardProps={{ compactAmenities: true }}
      />
      <PlaceCarouselSection
        title="Recommended Cafes"
        places={sections.recommendedCafes}
        loading={sectionsLoading}
        emptyText="No recommended cafes found."
        cardProps={{ compactAmenities: true }}
      />
      <PlaceCarouselSection
        title="Popular Places"
        places={sections.popular}
        loading={sectionsLoading}
        cardProps={{ compactAmenities: true }}
      />
      <PlaceCarouselSection
        title="Recent Places"
        places={sections.recent}
        loading={sectionsLoading}
        cardProps={{ compactAmenities: true }}
      />
    </Stack>
  );
}

export default HomePage;

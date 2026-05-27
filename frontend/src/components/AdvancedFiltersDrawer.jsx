import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  MenuItem,
  Rating,
  Select,
  Slider,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { amenityOptions, priceRanges } from '../constants/amenities.js';

function AdvancedFiltersDrawer({ open, filters, selectedChips, onClose, onChange, onClear }) {
  const setFilter = (field, value) => onChange({ ...filters, [field]: value });
  const setAmenity = (key, value) =>
    onChange({
      ...filters,
      amenities: {
        ...filters.amenities,
        [key]: value
      }
    });

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: '100vw', sm: 420 }, maxWidth: '100vw', p: 3 }}>
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h5" component="h2">
                Filters
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Refine places by type, comfort, price, and rating.
              </Typography>
            </Box>
            <Tooltip title="Close filters">
              <IconButton aria-label="Close filters" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          {selectedChips.length ? (
            <Stack direction="row" gap={1} flexWrap="wrap">
              {selectedChips.map((chip) => (
                <Chip key={chip.key} label={chip.label} size="small" />
              ))}
            </Stack>
          ) : null}

          <FormControl fullWidth>
            <InputLabel id="drawer-category-label">Category</InputLabel>
            <Select
              labelId="drawer-category-label"
              label="Category"
              value={filters.category}
              onChange={(event) => setFilter('category', event.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Cafe">Cafe</MenuItem>
              <MenuItem value="Hotel">Hotel</MenuItem>
            </Select>
          </FormControl>

          <Divider />

          <Box>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Amenities
            </Typography>
            <FormGroup>
              {amenityOptions.map(({ key, label, icon: Icon }) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      checked={Boolean(filters.amenities[key])}
                      onChange={(event) => setAmenity(key, event.target.checked)}
                    />
                  }
                  label={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Icon fontSize="small" />
                      <span>{label}</span>
                    </Stack>
                  }
                />
              ))}
            </FormGroup>
          </Box>

          <Divider />

          <FormControl fullWidth>
            <InputLabel id="drawer-price-label">Price Range</InputLabel>
            <Select
              labelId="drawer-price-label"
              label="Price Range"
              value={filters.priceRange}
              onChange={(event) => setFilter('priceRange', event.target.value)}
            >
              <MenuItem value="">Any</MenuItem>
              {priceRanges.map((range) => (
                <MenuItem value={range} key={range}>
                  {range}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              Minimum Rating
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Slider
                value={filters.minRating}
                min={0}
                max={5}
                step={0.5}
                marks
                valueLabelDisplay="auto"
                onChange={(_, value) => setFilter('minRating', value)}
                sx={{ flexGrow: 1 }}
              />
              <Rating value={filters.minRating} precision={0.5} readOnly />
            </Stack>
          </Box>

          <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={onClear}>
            Clear all filters
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}

export default AdvancedFiltersDrawer;

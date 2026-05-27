import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { createHotel, getHotelById, updateHotel } from '../api/hotels.js';
import ImageUpload from '../components/ImageUpload.jsx';
import LoadingState from '../components/LoadingState.jsx';

const emptyForm = {
  name: '',
  category: 'Cafe',
  location: '',
  description: '',
  latitude: '',
  longitude: '',
  images: []
};

function PlaceFormPage({ mode = 'create' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(mode === 'edit');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (mode !== 'edit') return;

    const loadPlace = async () => {
      try {
        setLoading(true);
        const hotel = await getHotelById(id);
        setForm({
          name: hotel.name || '',
          category: hotel.category || 'Cafe',
          location: hotel.location || '',
          description: hotel.description || '',
          latitude: hotel.latitude ?? '',
          longitude: hotel.longitude ?? '',
          images: hotel.images?.length ? hotel.images : [hotel.image_url].filter(Boolean)
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPlace();
  }, [id, mode]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const validate = () => {
    if (!form.images.length) return 'Upload at least one image.';
    if (!Number.isFinite(Number(form.latitude))) return 'Latitude is required.';
    if (!Number.isFinite(Number(form.longitude))) return 'Longitude is required.';
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      ...form,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude)
    };

    try {
      setSubmitting(true);
      if (mode === 'edit') {
        await updateHotel(id, payload);
        setSuccess('Place updated successfully.');
      } else {
        await createHotel(payload);
        setSuccess('Place created successfully.');
      }
      navigate('/my-places');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState label="Loading place..." />;
  }

  return (
    <Box sx={{ maxWidth: 860, mx: 'auto' }}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {mode === 'edit' ? 'Edit Place' : 'Add Place'}
            </Typography>
            <Typography color="text.secondary">
              Add the location, coordinates, and upload gallery images.
            </Typography>
          </Box>
          {error ? <Alert severity="error">{error}</Alert> : null}
          {success ? <Alert severity="success">{success}</Alert> : null}
          <TextField label="Name" value={form.name} onChange={(event) => updateField('name', event.target.value)} required />
          <FormControl>
            <InputLabel id="place-category-label">Category</InputLabel>
            <Select
              labelId="place-category-label"
              label="Category"
              value={form.category}
              onChange={(event) => updateField('category', event.target.value)}
            >
              <MenuItem value="Cafe">Cafe</MenuItem>
              <MenuItem value="Hotel">Hotel</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Location" value={form.location} onChange={(event) => updateField('location', event.target.value)} required />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Latitude"
                type="number"
                value={form.latitude}
                onChange={(event) => updateField('latitude', event.target.value)}
                required
                fullWidth
                inputProps={{ step: 'any', min: -90, max: 90 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Longitude"
                type="number"
                value={form.longitude}
                onChange={(event) => updateField('longitude', event.target.value)}
                required
                fullWidth
                inputProps={{ step: 'any', min: -180, max: 180 }}
              />
            </Grid>
          </Grid>
          <TextField
            label="Description"
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
            required
            multiline
            minRows={4}
          />
          <ImageUpload images={form.images} onChange={(images) => updateField('images', images)} />
          <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Place'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default PlaceFormPage;

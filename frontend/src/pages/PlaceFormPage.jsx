import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  FormControl,
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
import LoadingState from '../components/LoadingState.jsx';

const emptyForm = {
  name: '',
  category: 'Cafe',
  location: '',
  description: '',
  image_url: ''
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
          image_url: hotel.image_url || ''
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      setSubmitting(true);
      if (mode === 'edit') {
        await updateHotel(id, form);
        setSuccess('Place updated successfully.');
      } else {
        await createHotel(form);
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
    <Box sx={{ maxWidth: 760, mx: 'auto' }}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {mode === 'edit' ? 'Edit Place' : 'Add Place'}
            </Typography>
            <Typography color="text.secondary">
              Add useful details and a public image URL.
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
          <TextField
            label="Description"
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
            required
            multiline
            minRows={4}
          />
          <TextField
            label="Image URL"
            type="url"
            value={form.image_url}
            onChange={(event) => updateField('image_url', event.target.value)}
            required
          />
          <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Place'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default PlaceFormPage;


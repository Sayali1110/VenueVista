import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Typography
} from '@mui/material';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HotelCard from '../components/HotelCard.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';
import { deleteHotel, getMyHotels } from '../api/hotels.js';

function MyPlacesPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadHotels = async () => {
    try {
      setLoading(true);
      setError('');
      setHotels(await getMyHotels());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteHotel(deleteTarget.id);
      setHotels((current) => current.filter((hotel) => hotel.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            My Places
          </Typography>
          <Typography color="text.secondary">Manage places you created.</Typography>
        </Box>
        <Button component={RouterLink} to="/places/new" variant="contained" startIcon={<AddBusinessIcon />}>
          Add Place
        </Button>
      </Stack>
      <ErrorAlert message={error} />
      {loading ? (
        <LoadingState label="Loading your places..." />
      ) : (
        <Grid container spacing={3}>
          {hotels.map((hotel) => (
            <Grid item xs={12} sm={6} md={4} key={hotel.id}>
              <HotelCard
                hotel={hotel}
                actions={
                  <Stack direction="row" spacing={1}>
                    <Button
                      component={RouterLink}
                      to={`/places/${hotel.id}/edit`}
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => setDeleteTarget(hotel)}
                    >
                      Delete
                    </Button>
                  </Stack>
                }
              />
            </Grid>
          ))}
          {!hotels.length ? (
            <Grid item xs={12}>
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h6">No places created yet</Typography>
                <Typography variant="body2" color="text.secondary">
                  Add your first cafe or hotel.
                </Typography>
              </Box>
            </Grid>
          ) : null}
        </Grid>
      )}
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete place?</DialogTitle>
        <DialogContent>
          <Typography>
            {deleteTarget?.name} will be removed with its reviews and favorites.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default MyPlacesPage;


import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Rating,
  Snackbar,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useEffect, useState } from 'react';
import { addFavorite, removeFavorite } from '../api/favorites.js';
import { useAuth } from '../context/AuthContext.jsx';

function HotelCard({ hotel, onFavoriteChange, actions }) {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(Boolean(hotel.is_favorite));
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setIsFavorite(Boolean(hotel.is_favorite));
  }, [hotel.is_favorite]);

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      setNotice('Please log in to save favorites.');
      return;
    }

    try {
      setSaving(true);
      if (isFavorite) {
        await removeFavorite(hotel.id);
        setIsFavorite(false);
        onFavoriteChange?.(hotel.id, false);
      } else {
        await addFavorite(hotel.id);
        setIsFavorite(true);
        onFavoriteChange?.(hotel.id, true);
      }
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="190"
            image={hotel.image_url}
            alt={hotel.name}
            sx={{ objectFit: 'cover' }}
          />
          <Tooltip title={isFavorite ? 'Favorited' : 'Save favorite'}>
            <IconButton
              aria-label={isFavorite ? 'Remove favorite' : 'Save favorite'}
              onClick={handleFavorite}
              disabled={saving}
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'background.paper' }
              }}
            >
              {isFavorite ? <FavoriteIcon color="secondary" /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
        </Box>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
            <Chip label={hotel.category} color={hotel.category === 'Cafe' ? 'secondary' : 'primary'} size="small" />
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Rating value={Number(hotel.average_rating)} precision={0.5} readOnly size="small" />
              <Typography variant="body2" color="text.secondary">
                {Number(hotel.average_rating).toFixed(1)}
              </Typography>
            </Stack>
          </Stack>

          <Typography variant="h6" component="h2">
            {hotel.name}
          </Typography>

          <Stack direction="row" spacing={0.75} alignItems="center" color="text.secondary">
            <PlaceIcon fontSize="small" />
            <Typography variant="body2">{hotel.location || 'Location unavailable'}</Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
            {hotel.description}
          </Typography>

          <Box>
            <Button
              component={RouterLink}
              to={`/hotels/${hotel.id}`}
              endIcon={<ArrowForwardIcon />}
              variant="contained"
              size="small"
            >
              View details
            </Button>
          </Box>
        </CardContent>
        {actions ? <CardActions sx={{ px: 2, pb: 2 }}>{actions}</CardActions> : null}
      </Card>
      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={3000}
        message={notice}
        onClose={() => setNotice('')}
      />
    </>
  );
}

export default HotelCard;

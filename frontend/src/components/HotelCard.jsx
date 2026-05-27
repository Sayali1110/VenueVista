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
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { useEffect, useState } from 'react';
import { addFavorite, removeFavorite } from '../api/favorites.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getEnabledAmenities } from '../constants/amenities.js';

function HotelCard({ hotel, onFavoriteChange, actions, badge, compactAmenities = false }) {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(Boolean(hotel.is_favorite));
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const enabledAmenities = getEnabledAmenities(hotel);
  const amenityLimit = compactAmenities ? 3 : 4;

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
            image={hotel.image_url || hotel.images?.[0]}
            alt={hotel.name}
            sx={{ objectFit: 'cover' }}
          />
          {badge || typeof hotel.trending_score === 'number' ? (
            <Chip
              icon={<WhatshotIcon />}
              label={badge || 'Trending'}
              color="secondary"
              size="small"
              sx={{ position: 'absolute', left: 10, top: 10, bgcolor: 'secondary.main' }}
            />
          ) : null}
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
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
              <Chip label={hotel.category} color={hotel.category === 'Cafe' ? 'secondary' : 'primary'} size="small" />
              {hotel.price_range ? <Chip label={hotel.price_range} variant="outlined" size="small" /> : null}
            </Stack>
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

          {typeof hotel.distance === 'number' ? (
            <Typography variant="body2" color="primary.main" fontWeight={700}>
              {hotel.distance.toFixed(1)} km away
            </Typography>
          ) : null}

          {typeof hotel.favorite_count === 'number' ? (
            <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
              <FavoriteIcon fontSize="small" color="secondary" />
              <Typography variant="body2">{hotel.favorite_count} favorites</Typography>
            </Stack>
          ) : null}

          {enabledAmenities.length ? (
            <Stack direction="row" gap={0.75} flexWrap="wrap">
              {enabledAmenities.slice(0, amenityLimit).map(({ key, label, icon: Icon }) => (
                <Tooltip title={label} key={key}>
                  <Chip icon={<Icon />} label={label} size="small" variant="outlined" />
                </Tooltip>
              ))}
              {enabledAmenities.length > amenityLimit ? (
                <Chip label={`+${enabledAmenities.length - amenityLimit}`} size="small" />
              ) : null}
            </Stack>
          ) : null}

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

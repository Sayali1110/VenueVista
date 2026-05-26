import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Stack,
  Typography
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function HotelCard({ hotel }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <CardMedia
        component="img"
        height="190"
        image={hotel.image_url}
        alt={hotel.name}
        sx={{ objectFit: 'cover' }}
      />
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
    </Card>
  );
}

export default HotelCard;


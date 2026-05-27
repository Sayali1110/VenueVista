import { Box, Skeleton, Stack, Typography } from '@mui/material';
import HotelCard from './HotelCard.jsx';

function PlaceCarouselSection({ title, places, loading, emptyText = 'No places found.', cardProps = {} }) {
  return (
    <Stack spacing={2}>
      <Typography variant="h5" component="h2">
        {title}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          gridAutoColumns: { xs: '86%', sm: 330, md: 350 },
          gap: 2,
          overflowX: 'auto',
          pb: 1,
          scrollSnapType: 'x mandatory'
        }}
      >
        {loading
          ? [1, 2, 3].map((item) => <Skeleton key={item} variant="rounded" height={350} />)
          : places.map((hotel) => (
              <Box key={hotel.id} sx={{ scrollSnapAlign: 'start', minWidth: 0 }}>
                <HotelCard hotel={hotel} {...cardProps} />
              </Box>
            ))}
      </Box>
      {!loading && !places.length ? (
        <Typography variant="body2" color="text.secondary">
          {emptyText}
        </Typography>
      ) : null}
    </Stack>
  );
}

export default PlaceCarouselSection;

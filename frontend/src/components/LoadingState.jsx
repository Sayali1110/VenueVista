import { Box, CircularProgress, Typography } from '@mui/material';

function LoadingState({ label = 'Loading...' }) {
  return (
    <Box sx={{ display: 'grid', placeItems: 'center', py: 8 }}>
      <CircularProgress />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        {label}
      </Typography>
    </Box>
  );
}

export default LoadingState;


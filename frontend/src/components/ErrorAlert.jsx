import { Alert } from '@mui/material';

function ErrorAlert({ message }) {
  if (!message) {
    return null;
  }

  return (
    <Alert severity="error" sx={{ mb: 3 }}>
      {message}
    </Alert>
  );
}

export default ErrorAlert;


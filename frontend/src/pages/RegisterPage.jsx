import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useAuth } from '../context/AuthContext.jsx';

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (form.name.trim().length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    try {
      setSubmitting(true);
      await register(form);
      setSuccess('Account created successfully.');
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto' }}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Register
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create an account to save favorites and manage places.
            </Typography>
          </Box>
          {error ? <Alert severity="error">{error}</Alert> : null}
          {success ? <Alert severity="success">{success}</Alert> : null}
          <TextField
            label="Name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            required
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" startIcon={<HowToRegIcon />} disabled={submitting}>
            {submitting ? 'Creating account...' : 'Register'}
          </Button>
          <Button component={RouterLink} to="/login">
            Already have an account?
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default RegisterPage;


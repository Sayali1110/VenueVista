import { Avatar, Paper, Stack, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext.jsx';

function ProfilePage() {
  const { user } = useAuth();

  return (
    <Paper sx={{ p: { xs: 3, md: 4 }, maxWidth: 620 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: 28 }}>
          {user?.name?.[0] || 'U'}
        </Avatar>
        <Stack>
          <Typography variant="h4" component="h1">
            {user?.name}
          </Typography>
          <Typography color="text.secondary">{user?.email}</Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default ProfilePage;


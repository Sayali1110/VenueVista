import { useState } from 'react';
import { Outlet, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography
} from '@mui/material';
import HotelIcon from '@mui/icons-material/Hotel';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useAuth } from '../context/AuthContext.jsx';

function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const guestLinks = [
    { label: 'Login', to: '/login', icon: <LoginIcon /> },
    { label: 'Register', to: '/register', icon: <HowToRegIcon /> }
  ];

  const authLinks = [
    { label: 'My Favorites', to: '/favorites', icon: <FavoriteIcon /> },
    { label: 'My Places', to: '/my-places', icon: <StorefrontIcon /> },
    { label: 'Add Place', to: '/places/new', icon: <AddBusinessIcon /> },
    { label: 'Profile', to: '/profile', icon: <PersonIcon /> }
  ];

  const navLinks = [{ label: 'Home', to: '/', icon: <HomeIcon /> }, ...(isAuthenticated ? authLinks : guestLinks)];

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
    navigate('/');
  };

  const drawer = (
    <Box sx={{ width: 280 }} role="presentation">
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main' }}>{user?.name?.[0] || 'V'}</Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={800}>
              {user?.name || 'VenueVista'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email || 'Browse local places'}
            </Typography>
          </Box>
        </Stack>
      </Box>
      <Divider />
      <List>
        {navLinks.map((link) => (
          <ListItemButton
            key={link.to}
            component={RouterLink}
            to={link.to}
            onClick={() => setDrawerOpen(false)}
          >
            <ListItemIcon>{link.icon}</ListItemIcon>
            <ListItemText primary={link.label} />
          </ListItemButton>
        ))}
        {isAuthenticated ? (
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        ) : null}
      </List>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="primary" elevation={0}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 1, display: { xs: 'inline-flex', md: 'none' } }}
            aria-label="Open navigation"
          >
            <MenuIcon />
          </IconButton>
          <HotelIcon sx={{ mr: 1 }} />
          <Typography
            component={RouterLink}
            to="/"
            variant="h6"
            sx={{ color: 'inherit', textDecoration: 'none', fontWeight: 800, flexGrow: 1 }}
          >
            VenueVista
          </Typography>
          <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
            {navLinks.map((link) => (
              <Button key={link.to} component={RouterLink} to={link.to} color="inherit" startIcon={link.icon}>
                {link.label}
              </Button>
            ))}
            {isAuthenticated ? (
              <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
                Logout
              </Button>
            ) : null}
          </Stack>
        </Toolbar>
      </AppBar>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawer}
      </Drawer>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Outlet />
      </Container>
    </Box>
  );
}

export default Layout;

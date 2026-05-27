import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import HotelDetailsPage from './pages/HotelDetailsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import MyFavoritesPage from './pages/MyFavoritesPage.jsx';
import MyPlacesPage from './pages/MyPlacesPage.jsx';
import PlaceFormPage from './pages/PlaceFormPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/hotels/:id" element={<HotelDetailsPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/favorites" element={<MyFavoritesPage />} />
          <Route path="/my-places" element={<MyPlacesPage />} />
          <Route path="/places/new" element={<PlaceFormPage />} />
          <Route path="/places/:id/edit" element={<PlaceFormPage mode="edit" />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;

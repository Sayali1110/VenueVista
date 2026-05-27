import apiClient from './client.js';

export const getFavorites = async () => {
  const response = await apiClient.get('/favorites');
  return response.data.data;
};

export const addFavorite = async (hotelId) => {
  const response = await apiClient.post('/favorites', { hotel_id: hotelId });
  return response.data.data;
};

export const removeFavorite = async (hotelId) => {
  await apiClient.delete(`/favorites/${hotelId}`);
};


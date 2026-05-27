import apiClient from './client.js';

export const getHotels = async (filters = {}) => {
  const {
    search = '',
    category = '',
    priceRange = '',
    minRating = 0,
    amenities = {}
  } = filters;

  const response = await apiClient.get('/hotels', {
    params: {
      search: search || undefined,
      category: category || undefined,
      price_range: priceRange || undefined,
      min_rating: minRating ? minRating : undefined,
      ...Object.fromEntries(
        Object.entries(amenities)
          .filter(([, enabled]) => enabled)
          .map(([key]) => [key, true])
      )
    }
  });

  return response.data.data;
};

export const getTopRatedHotels = async (params = {}) => {
  const response = await apiClient.get('/hotels/top-rated', {
    params: {
      category: params.category || undefined,
      limit: params.limit || undefined
    }
  });
  return response.data.data;
};

export const getTrendingHotels = async (params = {}) => {
  const response = await apiClient.get('/hotels/trending', {
    params: { limit: params.limit || undefined }
  });
  return response.data.data;
};

export const getRecentHotels = async () => {
  const response = await apiClient.get('/hotels/recent');
  return response.data.data;
};

export const getPopularHotels = async () => {
  const response = await apiClient.get('/hotels/popular');
  return response.data.data;
};

export const getHotelById = async (id) => {
  const response = await apiClient.get(`/hotels/${id}`);
  return response.data.data;
};

export const getNearbyHotels = async (id, radius = 5) => {
  const response = await apiClient.get(`/hotels/${id}/nearby`, {
    params: { radius }
  });
  return response.data.data;
};

export const getHotelRecommendations = async (id) => {
  const response = await apiClient.get(`/hotels/${id}/recommendations`);
  return response.data.data;
};

export const getMyHotels = async () => {
  const response = await apiClient.get('/hotels/mine');
  return response.data.data;
};

export const createHotel = async (payload) => {
  const response = await apiClient.post('/hotels', payload);
  return response.data.data;
};

export const updateHotel = async (id, payload) => {
  const response = await apiClient.put(`/hotels/${id}`, payload);
  return response.data.data;
};

export const deleteHotel = async (id) => {
  await apiClient.delete(`/hotels/${id}`);
};

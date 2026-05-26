import apiClient from './client.js';

export const getHotels = async ({ search = '', category = '' } = {}) => {
  const response = await apiClient.get('/hotels', {
    params: {
      search: search || undefined,
      category: category || undefined
    }
  });

  return response.data.data;
};

export const getHotelById = async (id) => {
  const response = await apiClient.get(`/hotels/${id}`);
  return response.data.data;
};


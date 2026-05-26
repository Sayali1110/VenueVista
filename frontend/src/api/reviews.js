import apiClient from './client.js';

export const createReview = async (payload) => {
  const response = await apiClient.post('/reviews', payload);
  return response.data.data;
};

export const deleteReview = async (id) => {
  await apiClient.delete(`/reviews/${id}`);
};


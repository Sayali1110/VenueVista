import apiClient from './client.js';

export const uploadImage = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await apiClient.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress
  });

  return response.data.imageUrl;
};


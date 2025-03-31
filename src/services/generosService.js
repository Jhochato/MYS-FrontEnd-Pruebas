import apiClient from './apiService';

export const getGeneros = async () => {
  const response = await apiClient.get('/generos');
  return response.data;
};

export const addGenero = async (generoData) => {
  const response = await apiClient.post('/generos', generoData);
  return response.data;
};

export const deleteGenero = async (id) => {
  await apiClient.delete(`/generos/${id}`);
};

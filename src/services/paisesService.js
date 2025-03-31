import apiClient from './apiService';

export const getPaises = async () => {
  const response = await apiClient.get('/paises');
  return response.data;
};

export const addPais = async (paisData) => {
  const response = await apiClient.post('/paises', paisData);
  return response.data;
};

export const deletePais = async (id) => {
  await apiClient.delete(`/paises/${id}`);
};

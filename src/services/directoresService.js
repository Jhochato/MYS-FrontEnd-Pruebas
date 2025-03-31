import apiClient from './apiService';

export const getDirectores = async () => {
  const response = await apiClient.get('/directores');
  return response.data;
};

export const getDirectorById = async (id) => {
  const response = await apiClient.get(`/directores/${id}`);
  return response.data;
};

export const addDirector = async (directorData) => {
  const response = await apiClient.post('/directores', directorData);
  return response.data;
};

export const updateDirector = async (id, directorData) => {
  const response = await apiClient.put(`/directores/${id}`, directorData);
  return response.data;
};

export const deleteDirector = async (id) => {
  await apiClient.delete(`/directores/${id}`);
};

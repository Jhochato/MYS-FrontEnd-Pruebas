import apiClient from './apiService';

export const login = async (credentials) => {
  const response = await apiClient.post('/usuarios/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await apiClient.post('/usuarios/register', userData);
  return response.data;
};

export const getPerfil = async () => {
  const response = await apiClient.get('/usuarios/perfil');
  return response.data;
};

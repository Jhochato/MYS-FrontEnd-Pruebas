import apiClient from './apiService';

export const getActores = async () => {
  const response = await apiClient.get('/actores');
  return response.data;
};

export const getActorById = async (id) => {
  const response = await apiClient.get(`/actores/${id}`);
  return response.data;
};

export const addActor = async (actorData) => {
  const response = await apiClient.post('/actores', actorData);
  return response.data;
};

export const updateActor = async (id, actorData) => {
  const response = await apiClient.put(`/actores/${id}`, actorData);
  return response.data;
};

export const deleteActor = async (id) => {
  await apiClient.delete(`/actores/${id}`);
};

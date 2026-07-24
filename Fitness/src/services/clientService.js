import api from './axios';

export const getClientsAPI = async (query = '') => {
  const response = await api.get(`/clients?${query}`);
  return response.data;
};

export const getClientAPI = async (id) => {
  const response = await api.get(`/clients/${id}`);
  return response.data;
};

export const createClientAPI = async (clientData) => {
  const response = await api.post('/clients', clientData);
  return response.data;
};

export const updateClientAPI = async (id, clientData) => {
  const response = await api.put(`/clients/${id}`, clientData);
  return response.data;
};

export const deleteClientAPI = async (id) => {
  const response = await api.delete(`/clients/${id}`);
  return response.data;
};

export const changeStatusAPI = async (id, status) => {
  const response = await api.patch(`/clients/${id}/status`, { status });
  return response.data;
};

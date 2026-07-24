import api from './axios';

export const getDashboardStatsAPI = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getCoachesAPI = async () => {
  const response = await api.get('/admin/coaches');
  return response.data;
};

export const updateCoachStatusAPI = async (id, statusData) => {
  const response = await api.patch(`/admin/coaches/${id}/status`, statusData);
  return response.data;
};

export const updateUserAdminAPI = async (id, data) => {
  const response = await api.put(`/admin/users/${id}`, data);
  return response.data;
};

export const deleteUserAdminAPI = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export const addUserAdminAPI = async (data) => {
  const response = await api.post('/admin/users', data);
  return response.data;
};

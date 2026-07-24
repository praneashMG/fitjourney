import api from './axios';

export const getCoachDashboardAPI = async () => {
  const response = await api.get('/dashboard/coach');
  return response.data;
};

export const getClientDashboardAPI = async () => {
  const response = await api.get('/dashboard/client');
  return response.data;
};

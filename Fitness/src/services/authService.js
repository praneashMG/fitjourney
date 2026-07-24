import api from './axios';

export const registerAPI = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginAPI = async (userData) => {
  const response = await api.post('/auth/login', userData);
  return response.data;
};

export const getUserProfileAPI = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const updatePersonalProfileAPI = async (profileData) => {
  const response = await api.put('/users/profile/personal', profileData);
  return response.data;
};

export const updateFitnessProfileAPI = async (profileData) => {
  const response = await api.put('/users/profile/fitness', profileData);
  return response.data;
};

export const updatePreferencesAPI = async (preferencesData) => {
  const response = await api.put('/users/profile/preferences', preferencesData);
  return response.data;
};

export const updatePasswordAPI = async (passwordData) => {
  const response = await api.put('/users/password', passwordData);
  return response.data;
};

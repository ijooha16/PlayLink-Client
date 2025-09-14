import { apiClient } from '@/services/axios';

export const getProfile = async () => {
  const { data } = await apiClient.get('/api/profile/get-profile');
  return data;
};

export const updateProfile = async (profileData: FormData) => {
  const { data } = await apiClient.put('/api/profile/update-profile', profileData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

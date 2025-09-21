import { apiClient } from '@/libs/api/axios';
import { API_URLS } from '@/constant/api-urls';

export const getProfile = async () => {
  const { data } = await apiClient.get(API_URLS.PROFILE.GET_PROFILE);
  return data;
};

export const updateProfile = async (profileData: FormData) => {
  const { data } = await apiClient.put(API_URLS.PROFILE.UPDATE_PROFILE, profileData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

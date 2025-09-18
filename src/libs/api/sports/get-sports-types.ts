import { apiClient } from '@/libs/api/axios';
import { API_URLS } from '@/constant/api-urls';

export const getSports = async () => {
  const response = await apiClient.get(API_URLS.SPORT.GET_SPORTS);
  return response.data;
};

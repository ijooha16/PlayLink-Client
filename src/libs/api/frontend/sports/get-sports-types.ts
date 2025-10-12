import { API_URLS } from '@/constant/api-urls';
import { apiClient } from '@/libs/http';

export const getSports = async () => {
  const response = await apiClient.get(API_URLS.SPORT.GET_SPORTS);
  return response.data;
};

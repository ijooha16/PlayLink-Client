import { apiClient } from '@/services/axios';

export const getSports = async () => {
  const response = await apiClient.get('/api/sport/get-sports');
  return response.data;
};

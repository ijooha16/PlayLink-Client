import { apiClient } from '@/services/axios';

export const getNotification = async () => {
  const { data } = await apiClient.get('/api/notification/get-notification-list');
  return data;
};
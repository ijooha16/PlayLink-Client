import { apiClient } from '@/libs/api/axios';
import { API_URLS } from '@/constant/api-urls';

export const getNotification = async () => {
  const { data } = await apiClient.get(API_URLS.NOTIFICATION.GET_NOTIFICATION_LIST);
  return data;
};
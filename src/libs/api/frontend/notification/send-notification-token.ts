import { apiClient } from '@/libs/http';
import { API_URLS } from '@/constant/api-urls';

export const sendNotificationToken = async (fcmToken: string | null) => {
  const { data } = await apiClient.put(API_URLS.NOTIFICATION.SEND_NOTIFICATION_TOKEN, { token: fcmToken });
  return data;
};

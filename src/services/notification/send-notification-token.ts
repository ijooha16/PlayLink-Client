import { apiClient } from '@/services/axios';

export const sendNotificationToken = async (fcmToken: string | null) => {
  const { data } = await apiClient.put('/api/notification/send-notification-token', { token: fcmToken });
  return data;
};

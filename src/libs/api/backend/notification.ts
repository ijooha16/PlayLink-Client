import { backendClient } from '@/libs/http';

export const BackendNotificationAPI = {
  /**
   * FCM 토큰 전송
   */
  sendFCMToken: async (body: string) => {
    const response = await backendClient.put('/playlink/fcm', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  },

  /**
   * 알림 목록 조회
   */
  getNotificationList: async () => {
    const response = await backendClient.get('/playlink/notification/list');
    return response;
  },
};

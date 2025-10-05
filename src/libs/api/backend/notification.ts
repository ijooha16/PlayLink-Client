import { backendClient } from '@/libs/http';

interface NotificationTokenRequest {
  token: string;
}

export const BackendNotificationAPI = {
  /**
   * FCM 토큰 전송
   */
  sendToken: async (payload: NotificationTokenRequest, authToken?: string) => {
    const response = await backendClient.post('/playlink/notification/token', payload, {
      headers: {
        ...(authToken && { Authorization: authToken }),
      },
    });
    return response;
  },

  /**
   * 알림 목록 조회
   */
  getNotifications: async (authToken?: string) => {
    const response = await backendClient.get('/playlink/notification', {
      headers: {
        ...(authToken && { Authorization: authToken }),
      },
    });
    return response;
  },
};

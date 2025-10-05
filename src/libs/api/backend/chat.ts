import { backendClient } from '@/libs/http';

export const BackendChatAPI = {
  /**
   * 채팅 목록 조회
   */
  getChatList: async (token?: string) => {
    const response = await backendClient.get('/playlink/chat', {
      headers: {
        ...(token && { Authorization: token }),
      },
    });
    return response;
  },

  /**
   * 채팅 상세 조회
   */
  getChatDetail: async (chatId: string, token?: string) => {
    const response = await backendClient.get(`/playlink/chat/${chatId}`, {
      headers: {
        ...(token && { Authorization: token }),
      },
    });
    return response;
  },
};

import { backendClient } from '@/libs/http';

export const BackendChatAPI = {
  /**
   * 채팅방 목록 조회
   */
  getChatRoomList: async () => {
    const response = await backendClient.get('/playlink/chatRoomList');
    return response;
  },

  /**
   * 채팅 로그 조회
   */
  getChattingLog: async (roomId: string) => {
    const response = await backendClient.get(`/playlink/chattingLog?roomId=${encodeURIComponent(roomId)}`);
    return response;
  },
};

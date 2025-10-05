import { backendClient } from '@/libs/http';

export const BackendSportAPI = {
  /**
   * 스포츠 타입 목록 조회
   */
  getSportsTypes: async () => {
    const response = await backendClient.get('/playlink/sport');
    return response;
  },
};

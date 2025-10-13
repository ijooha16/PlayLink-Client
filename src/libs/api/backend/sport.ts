import { backendClient } from '@/libs/http';

export const BackendSportAPI = {
  /**
   * 스포츠 데이터 조회
   */
  getSportsData: async () => {
    const response = await backendClient.get('/playlink/sports/data');
    return response;
  },
};

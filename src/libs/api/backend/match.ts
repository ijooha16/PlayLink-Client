import { backendClient } from '@/libs/http';

export const BackendMatchAPI = {
  /**
   * 매치 목록 조회
   */
  getMatches: async () => {
    const response = await backendClient.get('/playlink/match');
    return response;
  },

  /**
   * 매치 상세 조회
   */
  getMatchDetail: async (matchId: string) => {
    const response = await backendClient.get(`/playlink/match/${matchId}/detail`);
    return response;
  },

  /**
   * 매치 검색
   */
  searchMatches: async (keyword: string, type: string) => {
    const response = await backendClient.get(`/playlink/match?title=${keyword}&type=${type}`);
    return response;
  },

  /**
   * 매치 생성
   */
  addMatch: async (formData: FormData) => {
    const response = await backendClient.post('/playlink/match', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  /**
   * 매치 수정
   */
  updateMatch: async (matchId: string, formData: FormData) => {
    const response = await backendClient.put(`/playlink/match/${matchId}/modify`, formData);
    return response;
  },

  /**
   * 매치 삭제
   */
  removeMatch: async (matchId: string) => {
    const response = await backendClient.delete(`/playlink/match/${matchId}`);
    return response;
  },

  /**
   * 매치 참여 신청
   */
  applyMatchJoin: async (matchId: string, body: unknown) => {
    const response = await backendClient.post(`/playlink/match/${matchId}/join`, body);
    return response;
  },

  /**
   * 매치 참여자 승인/거절
   */
  updateMatchParticipants: async (matchId: string, body: string) => {
    const response = await backendClient.put(
      `/playlink/match/participants/${matchId}`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  },
};

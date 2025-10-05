import { backendClient } from '@/libs/http';

interface MatchJoinRequest {
  matchId: string;
}

interface MatchApplyRequest {
  matchId: string;
}

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
    const response = await backendClient.get(`/playlink/match/${matchId}`);
    return response;
  },

  /**
   * 매치 검색
   */
  searchMatches: async (query: string) => {
    const response = await backendClient.get(`/playlink/match/search?q=${query}`);
    return response;
  },

  /**
   * 매치 생성
   */
  addMatch: async (formData: FormData, token?: string) => {
    const response = await backendClient.post('/playlink/match', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token && { Authorization: token }),
      },
    });
    return response;
  },

  /**
   * 매치 수정
   */
  updateMatch: async (matchId: string, formData: FormData, token?: string) => {
    const response = await backendClient.put(`/playlink/match/${matchId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token && { Authorization: token }),
      },
    });
    return response;
  },

  /**
   * 매치 삭제
   */
  removeMatch: async (matchId: string, token?: string) => {
    const response = await backendClient.delete(`/playlink/match/${matchId}`, {
      headers: {
        ...(token && { Authorization: token }),
      },
    });
    return response;
  },

  /**
   * 매치 참여
   */
  joinMatch: async (payload: MatchJoinRequest, token?: string) => {
    const response = await backendClient.post('/playlink/match/join', payload, {
      headers: {
        ...(token && { Authorization: token }),
      },
    });
    return response;
  },

  /**
   * 매치 신청
   */
  applyMatch: async (payload: MatchApplyRequest, token?: string) => {
    const response = await backendClient.post('/playlink/match/apply', payload, {
      headers: {
        ...(token && { Authorization: token }),
      },
    });
    return response;
  },
};

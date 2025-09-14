import { apiClient } from '@/services/axios';
import { MatchType } from '@/types/match/match';

export const getMatches = async (): Promise<{ errCode: number; data: MatchType[] }> => {
  const { data } = await apiClient.get('/api/match/get-matches');
  return data;
};

export const getMatchDetail = async (matchId: string | string[]) => {
  const { data } = await apiClient.get(`/api/match/get-match-detail`, {
    params: { matchId }
  });
  return data;
};

export const searchMatch = async ({ keyword, type }: { keyword: string; type: string }) => {
  const { data } = await apiClient.get('/api/match/get-searched-match', {
    params: { keyword, type }
  });
  return data;
};

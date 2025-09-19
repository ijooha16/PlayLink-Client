import { apiClient } from '@/libs/api/axios';
import { MatchType } from '@/types/match/match';
import { API_URLS } from '@/constant/api-urls';

export const getMatches = async (): Promise<{ errCode: number; data: MatchType[] }> => {
  const { data } = await apiClient.get(API_URLS.MATCH.GET_MATCHES);
  return data;
};

export const getMatchDetail = async (matchId: string | string[]) => {
  const { data } = await apiClient.get(API_URLS.MATCH.GET_MATCH_DETAIL, {
    params: { matchId }
  });
  return data;
};

export const searchMatch = async ({ keyword, type }: { keyword: string; type: string }) => {
  const { data } = await apiClient.get(API_URLS.MATCH.GET_SEARCHED_MATCH, {
    params: { keyword, type }
  });
  return data;
};

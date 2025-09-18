import { apiClient } from '@/libs/api/axios';
import { API_URLS } from '@/constant/api-urls';

export const addMatch = async (formData: FormData) => {
  const { data } = await apiClient.post(API_URLS.MATCH.ADD_MATCH, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const deleteMatch = async (matchId: string) => {
  const { data } = await apiClient.delete(API_URLS.MATCH.REMOVE_MATCH(matchId));
  return data;
};

export const updateMatch = async ({ matchId, formData }: { matchId: string; formData: any }) => {
  const { data } = await apiClient.put(API_URLS.MATCH.UPDATE_MATCH(matchId), formData);
  return data;
};

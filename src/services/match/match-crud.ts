import { apiClient } from '@/services/axios';

export const addMatch = async (formData: FormData) => {
  const { data } = await apiClient.post('/api/match/add-match', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const deleteMatch = async (matchId: string) => {
  const { data } = await apiClient.delete(`/api/match/remove-match/${matchId}`);
  return data;
};

export const updateMatch = async ({ matchId, formData }: { matchId: string; formData: any }) => {
  const { data } = await apiClient.put(`/api/match/update-match/${matchId}`, formData);
  return data;
};

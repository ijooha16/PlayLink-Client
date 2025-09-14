import { apiClient } from '@/services/axios';

export const applyMatch = async ({ join_message, matchId }: { join_message: string | null; matchId: number }) => {
  const { data } = await apiClient.post(`/api/match/apply-match`, { join_message }, {
    params: { matchId }
  });
  return data;
};

export const approveMatch = async ({ matchId, applicantId }: { matchId: number; applicantId: number }) => {
  const { data } = await apiClient.put(`/api/match/match-join`,
    { targetId: applicantId, action: 1 },
    { params: { matchId } }
  );
  return data;
};

export const rejectMatch = async ({ matchId, applicantId }: { matchId: number; applicantId: number }) => {
  const { data } = await apiClient.put(`/api/match/match-join`,
    { targetId: applicantId, action: -1 },
    { params: { matchId } }
  );
  return data;
};

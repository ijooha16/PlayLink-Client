import { apiClient } from '@/libs/api/axios';
import { API_URLS } from '@/constant/api-urls';

export const applyMatch = async ({ join_message, matchId }: { join_message: string | null; matchId: number }) => {
  const { data } = await apiClient.post(API_URLS.MATCH.APPLY_MATCH, { join_message }, {
    params: { matchId }
  });
  return data;
};

export const approveMatch = async ({ matchId, applicantId }: { matchId: number; applicantId: number }) => {
  const { data } = await apiClient.put(API_URLS.MATCH.MATCH_JOIN,
    { targetId: applicantId, action: 1 },
    { params: { matchId } }
  );
  return data;
};

export const rejectMatch = async ({ matchId, applicantId }: { matchId: number; applicantId: number }) => {
  const { data } = await apiClient.put(API_URLS.MATCH.MATCH_JOIN,
    { targetId: applicantId, action: -1 },
    { params: { matchId } }
  );
  return data;
};

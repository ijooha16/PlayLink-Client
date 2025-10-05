import { QUERY_KEYS } from '@/constant/query-key';
import { approveMatch, rejectMatch } from '@/libs/api/frontend/match/join-match';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useApproveMatchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MATCH_PARTICIPANT],
      });
    },
  });
};

export const useRejectMatchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MATCH_PARTICIPANT],
      });
    },
  });
};

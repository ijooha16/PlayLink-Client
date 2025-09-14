import { approveMatch, rejectMatch } from '@/services/match/join-match';
import { QUERY_KEYS } from '@/constant/query-key';
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

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addMatch } from '../../services/match/match-crud';
import { QUERY_KEYS } from '@/shares/constant/query-key';
import { applyMatch } from '@/services/match/join-match';

export const useApplyMatchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyMatch,
    onError: (error) => {
      console.log(error);
    },
  });
};

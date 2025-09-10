import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applyMatch } from '@/services/match/join-match';

export const useApplyMatchMutation = () => {
  return useMutation({
    mutationFn: applyMatch,
    onError: (error) => {
      console.log(error);
    },
  });
};

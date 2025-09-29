import { applyMatch } from '@/libs/api/match/join-match';
import { useMutation } from '@tanstack/react-query';

export const useApplyMatchMutation = () => {
  return useMutation({
    mutationFn: applyMatch,
    onError: (error) => {
      console.log(error);
    },
  });
};

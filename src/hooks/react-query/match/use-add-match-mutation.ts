import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addMatch } from '../../../services/match/match-crud';
import { QUERY_KEYS } from '@/constant/query-key';

export const useAddMatchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MATCH] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

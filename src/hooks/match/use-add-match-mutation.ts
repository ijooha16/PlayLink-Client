import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addMatch } from '../../services/match/add-match';
import { QUERY_KEYS } from '@/shares/constant/query-key';

export const useAddMatchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addMatch,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MATCH] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

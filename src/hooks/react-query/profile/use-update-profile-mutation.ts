import { updateProfile } from '@/services/profile/profile';
import { QUERY_KEYS } from '@/shares/constant/query-key';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] });
    },
    onError: (error) => {
      console.error('프로필 업데이트 실패:', error);
    },
  });
};

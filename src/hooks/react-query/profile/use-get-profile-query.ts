import { QUERY_KEYS } from '@/constant/query-key';
import { getProfile } from '@/libs/api/profile/profile';
import { useAuthStore } from '@/store/auth-store';
import { useQuery } from '@tanstack/react-query';

export const useGetProfileQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: () => getProfile(),
    enabled: !!useAuthStore.getState().token,
  });
};

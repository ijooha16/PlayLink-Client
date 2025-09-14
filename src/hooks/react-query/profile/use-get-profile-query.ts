import { getProfile } from '@/services/profile/profile';
import { QUERY_KEYS } from '@/constant/query-key';
import { useQuery } from '@tanstack/react-query';

export const useGetProfileQuery = (token: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: () => getProfile(token),
    enabled: !!token,
  });
};

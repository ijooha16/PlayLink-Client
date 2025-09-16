import { getProfile } from '@/services/profile/profile';
import { QUERY_KEYS } from '@/constant/query-key';
import { useQuery } from '@tanstack/react-query';
import { handleGetSessionStorage } from '@/utills/web-api';

export const useGetProfileQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: () => getProfile(),
    enabled: !!handleGetSessionStorage(),
  });
};

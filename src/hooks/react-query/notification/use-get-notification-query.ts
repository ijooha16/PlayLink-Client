import { getNotification } from '@/services/notification/get-notification';
import { QUERY_KEYS } from '@/shares/constant/query-key';
import { useQuery } from '@tanstack/react-query';

export const useGetNotificationQuery = (token: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATION],
    queryFn: () => getNotification({token}),
    enabled: !!token
  });
};

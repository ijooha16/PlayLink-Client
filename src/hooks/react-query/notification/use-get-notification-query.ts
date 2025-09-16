import { getNotification } from '@/services/notification/get-notification';
import { QUERY_KEYS } from '@/constant/query-key';
import { useQuery } from '@tanstack/react-query';
import { handleGetSessionStorage } from '@/utills/web-api';

export const useGetNotificationQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATION],
    queryFn: () => getNotification(),
    enabled: !!handleGetSessionStorage()
  });
};

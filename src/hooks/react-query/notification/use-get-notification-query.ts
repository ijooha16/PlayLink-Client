import { QUERY_KEYS } from '@/constant/query-key';
import { getNotification } from '@/libs/api/frontend/notification/get-notification';
import { useAuthStore } from '@/store/auth-store';
import { useQuery } from '@tanstack/react-query';

export const useGetNotificationQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATION],
    queryFn: () => getNotification(),
    enabled: !!useAuthStore.getState().token
  });
};

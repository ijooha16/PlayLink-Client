import { BackendNotificationAPI } from '@/libs/api/backend';
import { withApiHandler } from '@/utills/api-handler';

export const GET = withApiHandler(async () => {
  const response = await BackendNotificationAPI.getNotificationList();

  const data = response.data;
  return { status: 'success', data };
});

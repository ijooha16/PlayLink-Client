import { BackendNotificationAPI } from '@/libs/api/backend';
import { withApiHandler } from '@/utills/api-handler';

export const PUT = withApiHandler(async (request) => {
  const body = await request.text();

  const response = await BackendNotificationAPI.sendFCMToken(body);

  const data = response.data;
  return { status: 'success', data };
});

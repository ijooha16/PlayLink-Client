import { BackendAuthAPI } from '@/libs/api/backend';
import { withApiHandler } from '@/utills/api-handler';

export const PUT = withApiHandler(async (request) => {
  const body = await request.json();

  const response = await BackendAuthAPI.resetPassword(body);

  return {
    status: 'success',
    data: response.data,
  };
});

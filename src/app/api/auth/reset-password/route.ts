import { backendClient } from '@/libs/http';
import { withApiHandler } from '@/utills/api-handler';

export const PUT = withApiHandler(async (request) => {
  const body = await request.json();

  const response = await backendClient.put('/playlink/resetPassword', body);

  return {
    status: 'success',
    data: response.data,
  };
});

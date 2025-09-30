import { backendClient } from '@/libs/http';
import { withApiHandler } from '@/utills/api-handler';

export const GET = withApiHandler(async (request) => {
  const token = request.headers.get('Authorization');

  const response = await backendClient.get('/playlink/notification/list', {
    headers: {
      Authorization: token || '',
    },
  });

  const data = response.data;
  return { status: 'success', data };
});

import { backendClient } from '@/libs/http';
import { withApiHandler } from '@/utills/api-handler';

export const PUT = withApiHandler(async (request) => {
  const token = request.headers.get('Authorization');
  const body = await request.text();

  const response = await backendClient.put('/playlink/fcm', body, {
    headers: {
      Authorization: token || '',
      'Content-Type': 'application/json',
    },
  });

  const data = response.data;
  return { status: 'success', data };
});

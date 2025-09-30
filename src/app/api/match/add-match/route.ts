import { backendClient } from '@/libs/http';
import { withApiHandler } from '@/utills/api-handler';

export const POST = withApiHandler(async (request) => {
  const body = await request.formData();
  const token = request.headers.get('Authorization');

  const { data } = await backendClient.post('/playlink/match', body, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: token || '',
    },
  });

  return { status: 'success', data };
});

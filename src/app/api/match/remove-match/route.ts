import { backendClient } from '@/libs/http';
import { withApiHandler } from '@/utills/api-handler';

export const DELETE = withApiHandler(async (request) => {
  const token = request.headers.get('Authorization');
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get('matchId');

  const response = await backendClient.delete(`/playlink/match/${matchId}`, {
    headers: {
      Authorization: token || '',
    },
  });

  const data = response.data;
  return { status: 'success', data };
});

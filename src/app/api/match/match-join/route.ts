import { backendClient } from '@/libs/http';
import { withApiHandler } from '@/utills/api-handler';

export const dynamic = 'force-dynamic';

export const PUT = withApiHandler(async (request) => {
  const token = request.headers.get('Authorization');
  const body = await request.text();
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get('matchId');

  const response = await backendClient.put(
    `/playlink/match/participants/${matchId}`,
    body,
    {
      headers: {
        Authorization: token || '',
        'Content-Type': 'application/json',
      },
    }
  );

  const data = response.data;
  return { status: 'success', data };
});

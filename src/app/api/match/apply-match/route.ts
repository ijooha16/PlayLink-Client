import { backendClient } from '@/libs/http';
import { withApiHandler } from '@/utills/api-handler';

export const dynamic = 'force-dynamic';

export const POST = withApiHandler(async (request) => {
  const body = await request.json();
  const token = request.headers.get('Authorization');
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get('matchId') || '';

  const { data } = await backendClient.post(
    `/playlink/match/${matchId}/join`,
    body,
    {
      headers: { Authorization: token || '' },
    }
  );

  return { status: 'success', data };
});

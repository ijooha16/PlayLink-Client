import { BackendMatchAPI } from '@/libs/api/backend';
import { withApiHandler } from '@/utills/api-handler';

export const dynamic = 'force-dynamic';

export const POST = withApiHandler(async (request) => {
  const body = await request.json();
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get('matchId') || '';

  const { data } = await BackendMatchAPI.applyMatchJoin(matchId, body);

  return { status: 'success', data };
});

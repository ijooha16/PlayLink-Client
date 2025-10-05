import { BackendMatchAPI } from '@/libs/api/backend';
import { withApiHandler } from '@/utills/api-handler';

export const dynamic = 'force-dynamic';

export const PUT = withApiHandler(async (request) => {
  const body = await request.text();
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get('matchId') || '';

  const response = await BackendMatchAPI.updateMatchParticipants(matchId, body);

  const data = response.data;
  return { status: 'success', data };
});

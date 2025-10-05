import { BackendMatchAPI } from '@/libs/api/backend';
import { withApiHandler } from '@/utills/api-handler';

export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get('matchId') || '';
  const { data } = await BackendMatchAPI.getMatchDetail(matchId);
  return data;
});

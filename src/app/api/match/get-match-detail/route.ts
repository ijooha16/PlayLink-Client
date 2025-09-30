import { backendClient } from '@/libs/http';
import { withApiHandler } from '@/utills/api-handler';

export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get('matchId');
  const { data } = await backendClient.get(`/playlink/match/${matchId}/detail`);
  return data;
});

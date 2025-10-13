import { BackendMatchAPI } from '@/libs/api/backend';
import { withApiHandler } from '@/utills/api-handler';

export const DELETE = withApiHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get('matchId') || '';

  const response = await BackendMatchAPI.removeMatch(matchId);

  const data = response.data;
  return { status: 'success', data };
});

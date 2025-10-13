import { BackendMatchAPI } from '@/libs/api/backend';
import { withApiHandler } from '@/utills/api-handler';

export const PUT = withApiHandler(async (request) => {
  const body = await request.formData();
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get('matchId') || '';

  const response = await BackendMatchAPI.updateMatch(matchId, body);

  const data = response.data;
  return { status: 'success', data };
});

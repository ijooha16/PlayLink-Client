import { BackendMatchAPI } from '@/libs/api/backend';
import { withApiHandler } from '@/utills/api-handler';

export const POST = withApiHandler(async (request) => {
  const body = await request.formData();

  const { data } = await BackendMatchAPI.addMatch(body);

  return { status: 'success', data };
});

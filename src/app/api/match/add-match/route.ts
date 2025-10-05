import { BackendMatchAPI } from '@/libs/api/backend';
import { withApiHandler } from '@/utills/api-handler';

export const POST = withApiHandler(async (request) => {
  const body = await request.formData();
  const token = request.headers.get('Authorization') || undefined;

  const { data } = await BackendMatchAPI.addMatch(body, token);

  return { status: 'success', data };
});

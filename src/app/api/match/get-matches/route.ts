import { BackendMatchAPI } from '@/libs/api/backend';
import { withApiHandler } from '@/utills/api-handler';

export const GET = withApiHandler(async () => {
  const { data } = await BackendMatchAPI.getMatches();
  return data;
});

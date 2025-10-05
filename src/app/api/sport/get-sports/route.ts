import { BackendSportAPI } from '@/libs/api/backend';
import { withApiHandler } from '@/utills/api-handler';

export const GET = withApiHandler(async () => {
  const response = await BackendSportAPI.getSportsData();
  return { status: 'success', data: response.data };
});

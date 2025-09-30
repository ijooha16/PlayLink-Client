import { backendClient } from '@/libs/http';
import { withApiHandler } from '@/utills/api-handler';

export const GET = withApiHandler(async () => {
  const { data } = await backendClient.get('/playlink/match');
  return data;
});

import { backendClient } from '@/libs/http';
import { withApiHandler } from '@/utills/api-handler';

export const GET = withApiHandler(async () => {
  const response = await backendClient.get('/playlink/sports/data');
  return { status: 'success', data: response.data };
});

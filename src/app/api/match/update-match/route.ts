import { backendClient } from '@/libs/http';
import { withApiHandler } from '@/utills/api-handler';

export const PUT = withApiHandler(async (request) => {
  const token = request.headers.get('Authorization');
  const body = await request.formData();
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get('matchId');

  const response = await backendClient.put(
    `/playlink/match/${matchId}/modify`,
    body,
    {
      headers: {
        Authorization: token || '',
      },
    }
  );

  const data = response.data;
  return { status: 'success', data };
});

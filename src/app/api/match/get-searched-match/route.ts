import { backendClient } from '@/libs/http';
import { withApiHandler } from '@/utills/api-handler';

export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword') || '';
  const type = searchParams.get('type') || '';

  const response = await backendClient.get(
    `/playlink/match?title=${keyword}&type=${type}`
  );
  const data = response.data;
  return { status: 'success', data };
});

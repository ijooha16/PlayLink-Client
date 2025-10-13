import { BackendMatchAPI } from '@/libs/api/backend';
import { withApiHandler } from '@/utills/api-handler';

export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword') || '';
  const type = searchParams.get('type') || '';

  const response = await BackendMatchAPI.searchMatches(keyword, type);
  const data = response.data;
  return { status: 'success', data };
});

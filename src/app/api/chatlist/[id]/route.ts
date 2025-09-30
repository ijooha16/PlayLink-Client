import { backendClient } from '@/libs/http';
import { withApiHandler } from '@/utills/api-handler';

export const GET = withApiHandler(async (req) => {
  const incoming = req.headers.get('authorization');
  const auth = incoming?.replace(/^(bearer\s+)+/i, 'Bearer ');

  // URL에서 id 추출: /api/chatlist/5 -> '5'
  const url = new URL(req.url);
  const pathSegments = url.pathname.split('/');
  const id = pathSegments[pathSegments.length - 1];

  const res = await backendClient.get(
    `/playlink/chattingLog?roomId=${encodeURIComponent(id)}`,
    {
      headers: {
        ...(auth ? { Authorization: auth } : {}),
      },
    }
  );
  return {
    status: 'success',
    data: res.data,
  };
});

import { backendClient } from '@/libs/http';
import { withApiHandler } from '@/utills/api-handler';

export const GET = withApiHandler(async (req) => {
  const incoming = req.headers.get('authorization'); // 클라가 준 토큰
  const auth = incoming?.replace(/^(bearer\s+)+/i, 'Bearer '); // => 'Bearer xxx'

  const res = await backendClient.get('/playlink/chatRoomList', {
    headers: {
      ...(auth ? { Authorization: auth } : {}),
    },
  });
  return {
    status: 'success',
    data: res.data,
  };
});

import { BackendChatAPI } from '@/libs/api/backend';
import { withApiHandler } from '@/utills/api-handler';

export const GET = withApiHandler(async (req) => {
  // URL에서 id 추출: /api/chatlist/5 -> '5'
  const url = new URL(req.url);
  const pathSegments = url.pathname.split('/');
  const id = pathSegments[pathSegments.length - 1];

  const res = await BackendChatAPI.getChattingLog(id);
  return {
    status: 'success',
    data: res.data,
  };
});

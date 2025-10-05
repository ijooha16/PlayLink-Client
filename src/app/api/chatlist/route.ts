import { BackendChatAPI } from '@/libs/api/backend';
import { withApiHandler } from '@/utills/api-handler';

export const GET = withApiHandler(async () => {
  const res = await BackendChatAPI.getChatRoomList();
  return {
    status: 'success',
    data: res.data,
  };
});

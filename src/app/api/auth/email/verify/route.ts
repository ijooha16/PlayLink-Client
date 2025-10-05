import { BackendAuthAPI } from '@/libs/api/backend';
import { withApiHandler } from '@/utills/api-handler';

export const POST = withApiHandler(async (request) => {
  const payload = await request.json();
  const { data } = await BackendAuthAPI.verifyEmailCode(payload);

  return {
    status: 'success',
    message: '이메일 인증코드 확인 되었습니다',
    data,
  };
});

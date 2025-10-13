import { BackendAuthAPI } from '@/libs/api/backend';
import { withApiHandler } from '@/utills/api-handler';

export const POST = withApiHandler(async (request) => {
  const payload = await request.json();

  const { data } = await BackendAuthAPI.sendEmailCode(payload);

  return {
    status: 'success',
    message: '이메일 인증코드 발송 완료',
    data,
  };
});

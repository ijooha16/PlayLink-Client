import { BackendAuthAPI } from '@/libs/api/backend';
import { withApiHandler } from '@/utills/api-handler';

export const POST = withApiHandler(async (request) => {
  const payload = await request.json();
  const { data } = await BackendAuthAPI.sendSMSCode(payload);

  return {
    status: 'success',
    message: 'sms 인증코드 발송 완료',
    data,
  };
});

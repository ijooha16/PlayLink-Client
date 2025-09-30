import { backendClient } from '@/libs/http';
import { withApiHandler } from '@/utills/api-handler';

export const POST = withApiHandler(async (request) => {
  const payload = await request.json();
  const { data } = await backendClient.post('/playlink/signup/sms', payload);

  return {
    status: 'success',
    message: 'sms 인증코드 발송 완료',
    data,
  };
});

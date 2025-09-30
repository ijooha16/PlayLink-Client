import { clearAuthCookie } from '@/libs/cookie-utils';
import { withApiHandlerRaw } from '@/utills/api-handler';
import { NextResponse } from 'next/server';

export const POST = withApiHandlerRaw(async () => {
  // 백엔드 로그아웃 API 호출 (있다면)
  // await backendClient.post('/playlink/logout');

  const response = NextResponse.json({
    status: 'success',
    message: '로그아웃되었습니다.',
  });

  // 쿠키 삭제
  clearAuthCookie(response);

  return response;
});

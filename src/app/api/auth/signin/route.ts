import { setAuthCookie } from '@/libs/cookie-utils';
import { BackendAuthAPI } from '@/libs/api/backend';
import { withApiHandlerRaw } from '@/utills/api-handler';
import { NextResponse } from 'next/server';

export const POST = withApiHandlerRaw(async (request) => {
  const body = await request.json();

  const response = await BackendAuthAPI.login(body);
  const accessToken = response.headers.authorization;

  const finalResponse = NextResponse.json({
    status: 'success',
    data: response.data,
    accessToken,
  });

  // Access Token을 HttpOnly 쿠키로 설정 (미들웨어 인증용)
  if (accessToken) {
    setAuthCookie(finalResponse, accessToken);
  }

  return finalResponse;
});

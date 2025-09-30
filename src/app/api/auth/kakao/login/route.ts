import { setTempCookie } from '@/libs/cookie-utils';
import { withApiHandlerRaw } from '@/utills/api-handler';
import { NextResponse } from 'next/server';

const KAKAO_CLIENT_ID = process.env.KAKAO_OAUTH_REST_API_KEY!;
const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI!;

export const GET = withApiHandlerRaw(async (request) => {
  console.log('=== 카카오 로그인 시작 ===');

  const state = Math.random().toString(36).slice(2);
  // TODO uuid를 사용할 예정
  console.log('생성된 state:', state);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: KAKAO_CLIENT_ID,
    redirect_uri: KAKAO_REDIRECT_URI,
    state: state,
  });

  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;

  const response = NextResponse.redirect(kakaoAuthUrl);
  setTempCookie(response, 'kakao_oauth_state', state, 60 * 10);

  console.log('쿠키에 저장된 state:', state);

  return response;
});

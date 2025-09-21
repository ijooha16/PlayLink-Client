import { NextRequest, NextResponse } from 'next/server';

const KAKAO_CLIENT_ID = process.env.KAKAO_OAUTH_REST_API_KEY!;
const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI!;

export async function GET(request: NextRequest) {
  try {
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
    response.cookies.set('kakao_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10분
    });

    console.log('쿠키에 저장된 state:', state);

    return response;
  } catch (error) {
    console.error('카카오 로그인 URL 생성 에러:', error);
    return NextResponse.json(
      { error: '카카오 로그인 URL 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
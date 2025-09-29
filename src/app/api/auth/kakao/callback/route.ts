import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const KAKAO_CLIENT_ID = process.env.KAKAO_OAUTH_REST_API_KEY!;
const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET!;
const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI!;
const BACKEND_URL = process.env.NEXT_PUBLIC_DB_URL!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, state } = body;

    console.log('=== 카카오 콜백 처리 시작 ===');
    console.log('받은 body:', body);
    console.log('받은 code:', code);
    console.log('받은 state:', state);

    if (!code) {
      console.error('인가 코드가 없습니다');
      return NextResponse.json(
        { error: '인가 코드가 없습니다.' },
        { status: 400 }
      );
    }

    const storedState = request.cookies.get('kakao_oauth_state')?.value;
    console.log('저장된 state (쿠키):', storedState);

    if (state && state !== storedState) {
      console.error('CSRF 토큰 불일치:', { state, storedState });
      return NextResponse.json(
        { error: 'CSRF 토큰이 일치하지 않습니다.' },
        { status: 400 }
      );
    }

    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: KAKAO_CLIENT_ID,
      redirect_uri: KAKAO_REDIRECT_URI,
      code: code,
    });

    if (KAKAO_CLIENT_SECRET) {
      tokenParams.append('client_secret', KAKAO_CLIENT_SECRET);
    }

    console.log('토큰 요청 파라미터:', tokenParams.toString());

    const tokenResponse = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      tokenParams,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    console.log('카카오 토큰 응답:', tokenResponse.data);
    const { access_token } = tokenResponse.data;

    console.log('=== 카카오 사용자 정보 요청 ===');
    const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    console.log('카카오 사용자 정보:', userResponse.data);
    const kakaoUserInfo = userResponse.data;

    const backendPayload = {
      kakaoId: kakaoUserInfo.id.toString(),
      email: kakaoUserInfo.kakao_account?.email,
      nickname: kakaoUserInfo.properties?.nickname,
      profileImage: kakaoUserInfo.properties?.profile_image,
    };

    console.log('백엔드 요청 데이터:', backendPayload);

    const mockUser = {
      email: kakaoUserInfo.kakao_account?.email,
      nickname: kakaoUserInfo.properties?.nickname,
      profileImage: kakaoUserInfo.properties?.profile_image,
    };

    const response = NextResponse.json({
      success: true,
      user: mockUser,
    });

    response.cookies.delete('kakao_oauth_state');

    return response;
  } catch (error: any) {
    console.error(
      '카카오 로그인 처리 에러:',
      error.response?.data || error.message
    );
    return NextResponse.json(
      {
        error: '카카오 로그인 처리에 실패했습니다.',
        details: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}

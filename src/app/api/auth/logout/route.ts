import { PLAYLINK_AUTH } from '@/constant/cookie';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // 백엔드 로그아웃 API 호출 (있다면)
    // await backendClient.post('/playlink/logout');

    const response = NextResponse.json({
      status: 'success',
      message: '로그아웃되었습니다.'
    });

    // 쿠키 삭제
    response.cookies.set(PLAYLINK_AUTH, '', {
      httpOnly: true,
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (err: any) {
    console.error('Logout error:', err);

    const response = NextResponse.json({
      status: 'error',
      message: '로그아웃 중 오류가 발생했습니다.'
    }, { status: 500 });

    // 에러 시에도 쿠키 삭제
    response.cookies.set(PLAYLINK_AUTH, '', {
      httpOnly: true,
      maxAge: 0,
      path: '/',
    });

    return response;
  }
}
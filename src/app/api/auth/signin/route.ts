import { PLAYLINK_AUTH } from '@/constant/cookie';
import { backendClient } from '@/libs/api/axios';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await backendClient.post('/playlink/login', body);
    const accessToken = response.headers.authorization;

    const finalResponse = NextResponse.json({
      status: 'success',
      data: response.data,
      accessToken
    });

    // Access Token을 HttpOnly 쿠키로 설정 (미들웨어 인증용)
    if (accessToken) {
      finalResponse.cookies.set(PLAYLINK_AUTH, accessToken, {
        httpOnly: true,  // XSS 방어
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 24시간
        path: '/',
        sameSite: 'lax',
      });
    }

    return finalResponse;
  } catch (err: any) {
    console.error('Signin Route Handler error:', err);
    return NextResponse.json({
      status: 'error',
      message: err.response?.data?.message || err.message || 'Unknown error',
    }, { status: err.response?.status || 500 });
  }
}

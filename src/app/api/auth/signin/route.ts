import { NextResponse } from 'next/server';
import { backendClient } from '@/services/axios';

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

    // 쿠키 설정
    if (response.data.refreshToken) {
      finalResponse.cookies.set('refreshToken', response.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
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

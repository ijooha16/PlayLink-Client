import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fetchURL = process.env.NEXT_PUBLIC_DB_URL;
    const backendApiUrl = `${fetchURL}/playlink/login`;

    const response = await fetch(backendApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend API error:', errorData);
      return NextResponse.json(
        {
          status: 'error',
          message:
            errorData.data?.message || errorData.message || 'Backend API error',
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const accessToken = response.headers.get('Authorization');

    console.log('accessToken:', accessToken);

    const finalResponse = NextResponse.json(
      {
        status: 'success',
        data: data, // 백엔드 데이터
        accessToken: accessToken,
      },
      {
        status: response.status,
      }
    );

    // 쿠키 설정
    const refreshTokenValue = data.refreshToken;
    if (refreshTokenValue) {
      finalResponse.cookies.set('refreshToken', refreshTokenValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 일주일
        path: '/',
        sameSite: 'lax',
      });
    }

    return finalResponse;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Signin Route Handler error:', error);
      return NextResponse.json(
        {
          status: 'error',
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  }
}

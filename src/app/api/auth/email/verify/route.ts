import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const fetchURL = process.env.NEXT_PUBLIC_DB_URL;
    const backendApiUrl = `${fetchURL}/playlink/signup/email/verify`;

    const res = await fetch(backendApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const resJson = await res.json();

    if (!res.ok) {
      console.error('server api error', resJson);
      return NextResponse.json({
        status: 'error',
        message: 'email verify server api error',
      });
    }

    return NextResponse.json({
      status: 'success',
      message: '이메일 인증코드 확인 되었습니다',
    });
  } catch (err) {
    console.error('email route error', err);
    return NextResponse.json({
      status: 500,
      message: err,
    });
  }
}

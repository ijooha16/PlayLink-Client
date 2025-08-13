import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const fetchURL = process.env.NEXT_PUBLIC_DB_URL;
    const backendApiUrl = `${fetchURL}/playlink/signup/email/verify`;

    const res = await fetch(backendApiUrl, {
      method: 'POST',
      body: payload,
    });

    if (!res.ok) {
      const resJson = await res.json();
      console.error('server email verify error', resJson);
      return NextResponse.json({
        status: 'error',
        message: 'email verify server api error',
      });
    }

    return NextResponse.json({
      status: 'success',
      message: '인증 완료',
    });
  } catch (err) {
    console.error('email verify route error', err);
    return NextResponse.json({
      status: 500,
      message: err,
    });
  }
}

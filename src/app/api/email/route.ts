import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const fetchURL = process.env.NEXT_PUBLIC_DB_URL;
    const backendApiUrl = `${fetchURL}/playlink/signup/email`;
    console.log(payload);

    const res = await fetch(backendApiUrl, {
      method: 'POST',
      body: payload,
    });

    if (!res.ok) {
      const resJson = await res.json();
      console.error('server api error', resJson);
      return NextResponse.json({
        status: 'error',
        message: 'email server api error',
      });
    }

    return NextResponse.json({
      status: 'success',
      message: '발송 완료',
    });
  } catch (err) {
    console.error('email route error', err);
    return NextResponse.json({
      status: 500,
      message: err,
    });
  }
}

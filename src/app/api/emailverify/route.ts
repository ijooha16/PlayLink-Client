import { backendClient } from '@/libs/api/axios';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const res = await backendClient.post('/playlink/signup/email/verify', payload);

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

import { NextResponse } from 'next/server';
import { backendClient } from '@/services/axios';

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const { data } = await backendClient.post('/playlink/signup/email', payload);

    return NextResponse.json({
      status: 'success',
      message: '이메일 인증코드 발송 완료',
      data
    });
  } catch (err: any) {
    console.error('email route error', err);
    return NextResponse.json({
      status: 'error',
      message: err.response?.data?.message || err.message || 'email server api error',
    }, { status: err.response?.status || 500 });
  }
}

import { NextResponse } from 'next/server';
import { backendClient } from '@/services/axios';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { data } = await backendClient.post('/playlink/signup/email/verify', payload);

    return NextResponse.json({
      status: 'success',
      message: '이메일 인증코드 확인 되었습니다',
      data
    });
  } catch (err: any) {
    console.error('email verify route error', err);
    return NextResponse.json({
      status: 'error',
      message: err.response?.data?.message || err.message || 'email verify server api error',
    }, { status: err.response?.status || 500 });
  }
}

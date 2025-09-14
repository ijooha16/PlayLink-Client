import { NextResponse } from 'next/server';
import { backendClient } from '@/services/axios';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { data } = await backendClient.post('/playlink/signup/sms/verify', payload);

    return NextResponse.json({
      status: 'success',
      message: 'sms 인증코드 확인 되었습니다',
      data
    });
  } catch (err: any) {
    console.error('sms verify route error', err);
    return NextResponse.json({
      status: 'error',
      message: err.response?.data?.message || err.message || 'sms verify server api error',
    }, { status: err.response?.status || 500 });
  }
}

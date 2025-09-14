import { NextResponse } from 'next/server';
import { backendClient } from '@/services/axios';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { data } = await backendClient.post('/playlink/signup/sms', payload);

    return NextResponse.json({
      status: 'success',
      message: 'sms 인증코드 발송 완료',
      data
    });
  } catch (err: any) {
    console.error('sms route error', err);
    return NextResponse.json({
      status: 'error',
      message: err.response?.data?.message || err.message || 'sms server api error',
    }, { status: err.response?.status || 500 });
  }
}

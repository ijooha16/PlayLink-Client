import { NextResponse } from 'next/server';
import { backendClient } from '@/services/axios';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const { data } = await backendClient.post('/playlink/signup', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return NextResponse.json({ status: 'success', data });
  } catch (err: any) {
    console.error('Signup Route Handler error:', err);
    return NextResponse.json({
      status: 'error',
      message: err.response?.data?.message || err.message || 'Unknown error',
    }, { status: err.response?.status || 500 });
  }
}

import { NextResponse } from 'next/server';
import { backendClient } from '@/services/axios';

export async function GET(request: Request) {
  try {
    const token = request.headers.get('Authorization');
    const { data } = await backendClient.get('/playlink/profile', {
      headers: { Authorization: token || '' }
    });
    return NextResponse.json({ status: 'success', data });
  } catch (err: any) {
    console.error('Get profile Route Handler error:', err);
    return NextResponse.json({
      status: 'error',
      message: err.response?.data?.message || err.message || 'Unknown error',
    }, { status: err.response?.status || 500 });
  }
}
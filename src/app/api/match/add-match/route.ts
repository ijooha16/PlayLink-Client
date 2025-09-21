import { backendClient } from '@/libs/api/axios';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.formData();
    const token = request.headers.get('Authorization');

    const { data } = await backendClient.post('/playlink/match', body, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token || ''
      }
    });

    return NextResponse.json({ status: 'success', data });
  } catch (err: any) {
    console.error('Add match Route Handler error:', err);
    return NextResponse.json({
      status: 'error',
      message: err.response?.data?.message || err.message || 'Unknown error',
    }, { status: err.response?.status || 500 });
  }
}
import { backendClient } from '@/libs/api/axios';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    const body = await request.formData();
    const token = request.headers.get('Authorization');

    const { data } = await backendClient.put('/playlink/profile', body, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token || ''
      }
    });

    return NextResponse.json({ status: 'success', data });
  } catch (err: any) {
    console.error('Edit profile Route Handler error:', err);
    return NextResponse.json({
      status: 'error',
      message: err.response?.data?.message || err.message || 'Unknown error',
    }, { status: err.response?.status || 500 });
  }
}
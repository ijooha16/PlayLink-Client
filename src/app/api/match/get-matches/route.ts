import { backendClient } from '@/libs/api/axios';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data } = await backendClient.get('/playlink/match');
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Get match Route Handler error:', err);
    return NextResponse.json({
      status: 'error',
      message: err.response?.data?.message || err.message || 'Unknown error',
    }, { status: err.response?.status || 500 });
  }
}
import { NextResponse } from 'next/server';
import { backendClient } from '@/services/axios';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = request.headers.get('Authorization');
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('matchId') || '';

    const { data } = await backendClient.post(`/playlink/match/${matchId}/join`, body, {
      headers: { Authorization: token || '' }
    });

    return NextResponse.json({ status: 'success', data });
  } catch (err: any) {
    console.error('Apply match Route Handler error:', err);
    return NextResponse.json({
      status: 'error',
      message: err.response?.data?.message || err.message || 'Unknown error',
    }, { status: err.response?.status || 500 });
  }
}
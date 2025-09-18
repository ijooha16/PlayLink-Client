import { backendClient } from '@/libs/api/axios';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('matchId');
    const { data } = await backendClient.get(`/playlink/match/${matchId}/detail`);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Get match detail error:', err);
    return NextResponse.json({
      status: 'error',
      message: err.response?.data?.message || err.message || 'Unknown error',
    }, { status: err.response?.status || 500 });
  }
}

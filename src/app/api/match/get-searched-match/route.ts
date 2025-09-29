import { backendClient } from '@/libs/api/axios';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword') || '';
    const type = searchParams.get('type') || '';

    const response = await backendClient.get(`/playlink/match?title=${keyword}&type=${type}`);
    const data = response.data;
    return NextResponse.json({ status: 'success', data }, { status: 200 });
  } catch (error: unknown) {
    console.error('Get searched match Route Handler error:', error);
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

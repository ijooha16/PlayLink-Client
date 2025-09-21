import { backendClient } from '@/libs/api/axios';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await backendClient.get('/playlink/sports/data');
    return NextResponse.json({ status: 'success', data: response.data }, { status: 200 });
  } catch (error: unknown) {
    console.error('Get profile Route Handler error:', error);
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

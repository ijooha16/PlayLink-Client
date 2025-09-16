import { NextResponse } from 'next/server';
import { backendClient } from '@/services/axios';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request) {
  try {
    const token = request.headers.get('Authorization');
    const body = await request.text();
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('matchId');

    const response = await backendClient.put(`/playlink/match/participants/${matchId}`, body, {
      headers: {
        Authorization: token!,
        'Content-Type': 'application/json',
      },
    });

    const data = response.data;
    return NextResponse.json({ status: 'success', data }, { status: 200 });
  } catch (error: unknown) {
    console.error('Send notification token Route Handler error:', error);
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

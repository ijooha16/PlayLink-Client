import { backendClient } from '@/libs/api/axios';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization');
    const body = await request.formData();
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('matchId');

    const response = await backendClient.put(`/playlink/match/${matchId}/modify`, body, {
      headers: {
        Authorization: token!,
      },
    });

    const data = response.data;
    return NextResponse.json({ status: 'success', data }, { status: 200 });
  } catch (error: unknown) {
    console.error('Update match Route Handler error:', error);
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

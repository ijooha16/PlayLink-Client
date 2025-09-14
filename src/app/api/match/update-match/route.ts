import { NextResponse } from 'next/server';
import { backendClient } from '@/services/axios';

export async function PUT(
  request: Request,
  { params }: { params: { matchId: string } }
) {
  try {
    const token = request.headers.get('Authorization');
    const body = await request.formData();
    const matchId = params.matchId;

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
      { status: 'error', message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

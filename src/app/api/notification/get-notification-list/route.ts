import { NextResponse } from 'next/server';
import { backendClient } from '@/services/axios';

export async function GET(request: Request) {
  try {
    const token = request.headers.get('Authorization');

    const response = await backendClient.get('/playlink/notification/list', {
      headers: {
        Authorization: token!,
      },
    });

    const data = response.data;
    return NextResponse.json({ status: 'success', data }, { status: 200 });
  } catch (error: unknown) {
    console.error('Get notification Route Handler error:', error);
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

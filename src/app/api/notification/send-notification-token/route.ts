import { backendClient } from '@/libs/api/axios';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    const token = request.headers.get('Authorization');
    const body = await request.text();

    const response = await backendClient.put('/playlink/fcm', body, {
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
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

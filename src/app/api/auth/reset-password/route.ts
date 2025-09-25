import { backendClient } from '@/libs/api/axios';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const response = await backendClient.put('/playlink/resetPassword', body);

    const finalResponse = NextResponse.json({
      status: 'success',
      data: response.data,
    });

    return finalResponse;
  } catch (err: any) {
    console.error('Reset password Route Handler error:', err);
    return NextResponse.json(
      {
        status: 'error',
        message: err.response?.data?.message || err.message || 'Unknown error',
      },
      { status: err.response?.status || 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { backendClient } from '@/services/axios';

export async function PUT(request: Request) {
  try {
    const body = await request.formData();
    const token = request.headers.get('Authorization');

    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Authorization token is required' },
        { status: 401 }
      );
    }

    const response = await backendClient.put('/playlink/profile', body, {
      headers: {
        Authorization: token,
        'Content-Type': 'multipart/form-data',
      },
    });

    const data = response.data;
    return NextResponse.json({ status: 'success', data }, { status: 200 });
  } catch (error: any) {
    if (error.response?.data) {
      return NextResponse.json(
        {
          status: 'error',
          message: error.response.data.message || 'Backend error',
          data: error.response.data
        },
        { status: error.response.status || 500 }
      );
    }

    return NextResponse.json(
      { status: 'error', message: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}

import { backendClient } from '@/libs/api/axios';
import { NextResponse } from 'next/server';

// 프로필 조회 (GET)
export async function GET(request: Request) {
  try {
    const token = request.headers.get('Authorization');
    
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Authorization token is required' },
        { status: 401 }
      );
    }

    const { data } = await backendClient.get('/playlink/profile', {
      headers: { Authorization: token }
    });
    
    return NextResponse.json({ status: 'success', data });
  } catch (err: any) {
    console.error('Get profile Route Handler error:', err);
    return NextResponse.json({
      status: 'error',
      message: err.response?.data?.message || err.message || 'Unknown error',
    }, { status: err.response?.status || 500 });
  }
}

// 프로필 업데이트 (POST)
export async function POST(request: Request) {
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
    console.error('Update profile Route Handler error:', error);
    
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
      { status: 'error', message: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

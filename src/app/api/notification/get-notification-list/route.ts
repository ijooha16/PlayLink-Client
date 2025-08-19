import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const body = await request.json();
    const token = request.headers.get('Authorization');

    const fetchURL = process.env.NEXT_PUBLIC_DB_URL;

    const backendApiUrl = `${fetchURL}/playlink/notification/list`;

    const response = await fetch(backendApiUrl, {
      method: 'GET',
      headers: {
        Authorization: token!,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend API error:', errorData);
      return NextResponse.json(
        { status: 'error', message: errorData.message || 'Backend API error' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ status: 'success', data }, { status: 200 });
  } catch (error: any) {
    console.error('Get notification Route Handler error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}

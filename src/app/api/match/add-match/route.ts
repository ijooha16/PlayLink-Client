import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.formData();
    const token = request.headers.get('Authorization');

    const fetchURL = process.env.NEXT_PUBLIC_DB_URL;

    const backendApiUrl = `${fetchURL}/playlink/match`;

    const response = await fetch(backendApiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body,
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
    console.error('Get post Route Handler error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}

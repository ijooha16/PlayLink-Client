import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword') || '';

    const fetchURL = process.env.NEXT_PUBLIC_DB_URL;

    const backendApiUrl = `${fetchURL}/playlink/match?title=${keyword}`;

    const response = await fetch(backendApiUrl);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend API error:', errorData);
      return NextResponse.json(
        { status: 'error', message: errorData.message || 'Backend API error' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Get searched match Route Handler error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}

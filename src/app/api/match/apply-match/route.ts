import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = request.headers.get('Authorization');
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('matchId') || '';

    const fetchURL = process.env.NEXT_PUBLIC_DB_URL;

    const backendApiUrl = `${fetchURL}/playlink/match/${matchId}/join`;

    const response = await fetch(backendApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token!,
      },
      body: JSON.stringify(body),
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
  } catch (error: unknown) {
    console.error('Apply match Route Handler error:', error);
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error instanceof Error ? error.message : "Unknown error" : 'Unknown error' },
      { status: 500 }
    );
  }
}

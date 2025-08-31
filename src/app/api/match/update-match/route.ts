import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { matchId: string } }
) {
  try {
    const token = request.headers.get('Authorization');
    const body = await request.formData();
    const matchId = params.matchId;

    const fetchURL = process.env.NEXT_PUBLIC_DB_URL;

    const backendApiUrl = `${fetchURL}/playlink/match/${matchId}/modify`;

    const response = await fetch(backendApiUrl, {
      method: 'PUT',
      headers: {
        Authorization: token!,
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
  } catch (error: unknown) {
    console.error('Update match Route Handler error:', error);
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

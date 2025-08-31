import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const fetchURL = process.env.NEXT_PUBLIC_DB_URL;

    const backendApiUrl = `${fetchURL}/playlink/signup`;

    const response = await fetch(backendApiUrl, {
      method: 'POST',
      body: formData,
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
    if (error instanceof Error) {
      console.error('Signup Route Handler error:', error);
      return NextResponse.json(
        { status: 'error', message: error.message },
        { status: 500 }
      );
    }
  }
}

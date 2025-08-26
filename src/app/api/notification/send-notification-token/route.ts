import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    const token = request.headers.get('Authorization');
    const body = await request.text();

    const fetchURL = process.env.NEXT_PUBLIC_DB_URL;

    const backendApiUrl = `${fetchURL}/playlink/fcm`;
    // const backendApiUrl = ``;

    const response = await fetch(backendApiUrl, {
      method: 'PUT',
      headers: {
        Authorization: token!,
        'Content-Type': 'application/json',
      },
      body,
    });

    console.log('sendNotificationToken input:', body);

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
    console.error('Send notification token Route Handler error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { matchId: string } }
) {
  try {
    const token = request.headers.get('Authorization');
    const matchId = params.matchId;

    const fetchURL = process.env.NEXT_PUBLIC_DB_URL;

    console.log(matchId)
    
    // const backendApiUrl = `${fetchURL}/playlink/match/${matchId}`;

    // const response = await fetch(backendApiUrl, {
    //   method: 'DELETE',
    //   headers: {
    //     Authorization: token!,
    //   },
    // });

    // if (!response.ok) {
    //   const errorData = await response.json();
    //   console.error('Backend API error:', errorData);
    //   return NextResponse.json(
    //     { status: 'error', message: errorData.message || 'Backend API error' },
    //     { status: response.status }
    //   );
    // }

    // const data = await response.json();
    // return NextResponse.json({ status: 'success', data }, { status: 200 });
  } catch (error: any) {
    console.error('Delete match Route Handler error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();

//     const fetchURL = process.env.NEXT_PUBLIC_DB_URL;
//     const backendApiUrl = `${fetchURL}playlink/login`;
//     const response = await fetch(backendApiUrl, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(body),
//     });

//     const json = await response.json();
//     const accessToken =
//       response.headers.get('Authorization') ||
//       response.headers.get('X-Access-Token') ||
//       response.headers.get('access-token');

//     console.log('받은 액세스 토큰:', accessToken);

//     return NextResponse.json({
//       status: 'success',
//       msg: 'good',
//     });
//   } catch (err: any) {
//     console.log('페칭 오류', err);
//     return NextResponse.json(
//       {
//         status: 'error',
//         message: 'An error occurred during sign-in',
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fetchURL = process.env.NEXT_PUBLIC_DB_URL;
    const backendApiUrl = `${fetchURL}playlink/login`;

    const response = await fetch(backendApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

    const forwardedHeaders = new Headers(response.headers);

    const finalResponse = NextResponse.json(data, {
      status: response.status,
      headers: forwardedHeaders,
    });

    const refreshTokenValue = data.refreshToken;

    if (refreshTokenValue) {
      finalResponse.cookies.set('refreshToken', refreshTokenValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, //일주일
        path: '/',
        sameSite: 'lax',
      });
    }

    return finalResponse;
  } catch (error: any) {
    console.error('Signin Route Handler error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}

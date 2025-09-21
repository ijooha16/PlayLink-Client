import { PLAYLINK_AUTH } from '@/constant/cookie';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(PLAYLINK_AUTH);

    if (token?.value) {
      return NextResponse.json({
        status: 'success',
        authenticated: true,
        token: token.value
      });
    }

    return NextResponse.json({
      status: 'success',
      authenticated: false,
      token: null
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      authenticated: false,
      token: null
    }, { status: 500 });
  }
}
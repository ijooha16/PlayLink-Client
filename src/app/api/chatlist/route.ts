import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const incoming = req.headers.get('authorization'); // 클라가 준 토큰
  const auth = incoming?.replace(/^(bearer\s+)+/i, 'Bearer '); // => 'Bearer xxx'
  try {
    const fetchURL = process.env.NEXT_PUBLIC_DB_URL;
    const backendApiUrl = `${fetchURL}/playlink/chatRoomList`;

    const res = await fetch(backendApiUrl, {
      method: 'GET',
      headers: {
        ...(auth ? { Authorization: auth } : {}),
      },
    });
    const json = await res.json();
    if (res.ok) {
      return NextResponse.json({
        status: 'success',
        data: json,
      });
    } else {
      return NextResponse.json({
        status: 'error',
        message: json.message,
      });
    }
  } catch (err) {
    console.error('get chat-list router handler error', err);
  }
}

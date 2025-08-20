import { NextResponse, NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  const incoming = req.headers.get('authorization'); // 클라가 준 토큰
  const auth = incoming?.replace(/^(bearer\s+)+/i, 'Bearer '); // => 'Bearer xxx'

  const { id } = params; // '/api/chatlist/5' -> '5'

  try {
    const fetchURL = process.env.NEXT_PUBLIC_DB_URL;
    const backendApiUrl = `${fetchURL}/playlink/chattingLog?roomId=${encodeURIComponent(id)}`;
    const res = await fetch(backendApiUrl, {
      method: 'GET',
      headers: {
        ...(auth ? { Authorization: auth } : {}),
      },
    });
    const json = await res.json();
    if (res.ok) {
      return NextResponse.json({
        status: 'ㅇㅎㅇㅎㅇㅎㅇ',
        data: json,
      });
    } else {
      return NextResponse.json({
        status: 'error',
        message: json.message,
      });
    }
  } catch (err) {
    console.error('get chat-room detail router handler error', err);
  }
}

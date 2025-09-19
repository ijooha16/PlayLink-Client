import { backendClient } from '@/libs/api/axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const incoming = req.headers.get('authorization'); // 클라가 준 토큰
  const auth = incoming?.replace(/^(bearer\s+)+/i, 'Bearer '); // => 'Bearer xxx'
  try {
    const res = await backendClient.get('/playlink/chatRoomList', {
      headers: {
        ...(auth ? { Authorization: auth } : {}),
      },
    });
    return NextResponse.json({
      status: 'success',
      data: res.data,
    });
  } catch (err) {
    console.error('get chat-list router handler error', err);
  }
}

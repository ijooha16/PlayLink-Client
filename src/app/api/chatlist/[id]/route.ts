import { backendClient } from '@/libs/api/axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const incoming = req.headers.get('authorization'); // 클라가 준 토큰
  const auth = incoming?.replace(/^(bearer\s+)+/i, 'Bearer '); // => 'Bearer xxx'

  const { id } = await params; // '/api/chatlist/5' -> '5'

  try {
    const res = await backendClient.get(`/playlink/chattingLog?roomId=${encodeURIComponent(id)}`, {
      headers: {
        ...(auth ? { Authorization: auth } : {}),
      },
    });
    return NextResponse.json({
      status: 'success',
      data: res.data,
    });
  } catch (err: any) {
    console.error('get chat-room detail router handler error', err);
    return NextResponse.json(
      {
        status: 'error',
        message: err.response?.data?.message || err.message || 'Unknown error',
      },
      { status: err.response?.status || 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { createClient } from '@/libs/supabase/browser-client';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  try {
    // 쿼리 파라미터 파싱 (필요에 따라 추가)
    const { searchParams } = new URL(request.url);
    const someParam = searchParams.get('someParam');

    // Supabase에서 데이터 가져오기 예시
    // 'your_table_name'을 실제 테이블 이름으로 변경하세요.
    const { data, error } = await supabase.from('your_table_name').select('*');

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { status: 'error', message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: 'success', data });
  } catch (error: any) {
    console.error('Route Handler error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}

// POST, PUT, DELETE 등 다른 HTTP 메서드에 대한 핸들러도 여기에 추가할 수 있습니다.
/*
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Supabase에 데이터 삽입 예시
    const { data, error } = await supabase.from('your_table_name').insert([body]);

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { status: 'error', message: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ status: 'success', data });
  } catch (error: any) {
    console.error('Route Handler error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 },
    );
  }
}
*/

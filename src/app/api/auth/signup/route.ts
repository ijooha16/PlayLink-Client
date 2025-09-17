import { NextResponse } from 'next/server';
import { backendClient } from '@/services/axios';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // FormData 필드값들 상세 로깅
    console.log('=== Signup Request FormData Fields ===');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File {`);
        console.log(`  size: ${value.size},`);
        console.log(`  type: '${value.type}',`);
        console.log(`  name: '${value.name}',`);
        console.log(`  lastModified: ${value.lastModified}`);
        console.log(`}`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
    console.log('=====================================');
    
    const { data } = await backendClient.post('/playlink/signup', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return NextResponse.json({ status: 'success', data });
  } catch (err: any) {
    console.error('Signup Route Handler error:', err);
    return NextResponse.json({
      status: 'error',
      message: err.response?.data?.message || err.message || 'Unknown error',
    }, { status: err.response?.status || 500 });
  }
}

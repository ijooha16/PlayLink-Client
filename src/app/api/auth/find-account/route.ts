import { backendClient } from '@/libs/api/axios';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 백엔드 API가 GET + body 형태이므로 axios GET 요청에 data 포함
    const { data } = await backendClient.request({
      method: 'GET',
      url: '/playlink/findAccount',
      data: body,
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('findAccount data', data);

    // 백엔드 응답의 errCode에 따른 처리
    if (data.errCode === 4006) {
      // 가입된 계정 없음 - 정상적인 응답으로 처리
      return NextResponse.json({
        status: 'success',
        errCode: data.errCode,
        message: '가입된 계정이 없습니다',
        data: null
      });
    } else if (data.errCode === 6001) {
      // 인증되지 않은 번호 - 가입 가능한 번호로 처리
      return NextResponse.json({
        status: 'success',
        errCode: data.errCode,
        message: '인증 처리 됐습니다.',
        data: null
      });
    } else if (data.errCode === 0) {
      // 계정 발견
      return NextResponse.json({
        status: 'success',
        errCode: data.errCode,
        data: data.data
      });
    } else {
      // 기타 에러 코드들 - 클라이언트에서 처리하도록 성공 응답으로 전달
      return NextResponse.json({
        status: 'success',
        errCode: data.errCode,
        message: '응답 수신',
        data: data.data
      });
    }
  } catch (err: any) {
    console.error('Find account route error:', err);

    // 백엔드에서 500 응답이 와도 errCode가 있으면 성공으로 전달
    if (err.response?.data?.errCode) {
      const errCode = err.response.data.errCode;

      if (errCode === 6001) {
        return NextResponse.json({
          status: 'success',
          errCode: errCode,
          message: '인증 처리 됐습니다.',
          data: null
        });
      }

      return NextResponse.json({
        status: 'success',
        errCode: errCode,
        message: '응답 수신',
        data: err.response.data.data
      });
    }

    return NextResponse.json({
      status: 'error',
      message: err.response?.data?.message || err.message || 'Find account error',
    }, { status: err.response?.status || 500 });
  }
}
import { backendClient } from '@/libs/http';
import { withApiHandler } from '@/utills/api-handler';

export const POST = withApiHandler(async (request) => {
  const body = await request.json();

  const res = await backendClient.request({
    method: 'GET',
    url: '/playlink/findAccount',
    data: body,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
    validateStatus: function () {
      return true;
    },
    transformRequest: [
      function (data) {
        try {
          return JSON.stringify(data);
        } catch (e) {
          return data;
        }
      },
    ],
  });

  const payload = res.data || {};
  const code = payload.errCode;

  if (code === 0) {
    return {
      status: 'success',
      errCode: 0,
      data: payload.data,
    };
  }

  if (code === 4006) {
    return {
      status: 'success',
      errCode: 4006,
      message: '가입된 계정이 없습니다',
      data: null,
    };
  }

  if (code === 6001) {
    return {
      status: 'success',
      errCode: 6001,
      message: '인증 처리 됐습니다.',
      data: null,
    };
  }

  return {
    status: 'success',
    errCode: code,
    message:
      payload.data && payload.data.message ? payload.data.message : '응답 수신',
    data: payload.data || null,
  };
});

import { backendClient } from '@/libs/http';
import { withApiHandler } from '@/utills/api-handler';

type BackendCheckNicknameResponse = {
  errCode?: number;
  message?: string;
  data?: {
    isDuplicate?: number;
  };
};

export const POST = withApiHandler(async (request) => {
  const body = await request.json();
  const nickname = body?.nickname;

  if (!nickname || typeof nickname !== 'string') {
    return {
      status: 'error',
      message: '닉네임을 입력해주세요.',
    };
  }

  const response = await backendClient.request<BackendCheckNicknameResponse>({
    method: 'GET',
    url: '/playlink/account/check-nickname',
    data: { nickname },
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
    validateStatus: () => true,
    transformRequest: [
      function (data) {
        try {
          return JSON.stringify(data);
        } catch (error) {
          return data;
        }
      },
    ],
  });

  const payload = response.data || {};
  if (response.data?.data?.isDuplicate) {
    return {
      status: 'error',
      message: '이미 사용중인 닉네임입니다.',
    };
  }

  return {
    status: 'success',
    errCode: payload.errCode ?? null,
    message: payload.message ?? '',
    data: payload.data ?? null,
  };
});

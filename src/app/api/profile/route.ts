import { backendClient } from '@/libs/http';
import { withApiHandler } from '@/utills/api-handler';

// 프로필 조회 (GET)
export const GET = withApiHandler(
  async (request) => {
    const token = request.headers.get('Authorization');

    const { data } = await backendClient.get('/playlink/profile', {
      headers: { Authorization: token || '' },
    });

    return { status: 'success', data };
  },
  { requireAuth: true }
);

// 프로필 업데이트 (POST)
export const POST = withApiHandler(
  async (request) => {
    const body = await request.formData();
    const token = request.headers.get('Authorization');

    const response = await backendClient.put('/playlink/profile', body, {
      headers: {
        Authorization: token || '',
        'Content-Type': 'multipart/form-data',
      },
    });

    const data = response.data;
    return { status: 'success', data };
  },
  { requireAuth: true }
);

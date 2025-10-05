import { BackendProfileAPI } from '@/libs/api/backend';
import { withApiHandler } from '@/utills/api-handler';

// 프로필 조회 (GET)
export const GET = withApiHandler(
  async (request) => {
    const token = request.headers.get('Authorization') || undefined;

    const { data } = await BackendProfileAPI.getProfile(token);

    return { status: 'success', data };
  },
  { requireAuth: true }
);

// 프로필 업데이트 (POST)
export const POST = withApiHandler(
  async (request) => {
    const body = await request.formData();
    const token = request.headers.get('Authorization') || undefined;

    const response = await BackendProfileAPI.updateProfile(body, token);

    const data = response.data;
    return { status: 'success', data };
  },
  { requireAuth: true }
);

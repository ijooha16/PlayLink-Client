import { BackendAuthAPI } from '@/libs/api/backend';
import { withApiHandler } from '@/utills/api-handler';

export const POST = withApiHandler(async (request) => {
  const formData = await request.formData();
  // FormData 필드값들 상세 로깅

  try {
    const { data } = await BackendAuthAPI.signup(formData);
    return { status: 'success', data };
  } catch (error) {
    console.error('=== Backend Error Response ===');
    if (error instanceof Error) {
      console.error('Error Message:', error.message);
    }
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as {
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      console.error('Status:', axiosError.response?.status);
      console.error('Status Text:', axiosError.response?.statusText);
      console.error(
        'Error Data:',
        JSON.stringify(axiosError.response?.data, null, 2)
      );
    }
    console.error('=============================');
    throw error;
  }
});

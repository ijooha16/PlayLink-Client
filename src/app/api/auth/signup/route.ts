import { BackendAuthAPI } from '@/libs/api/backend';
import { withApiHandler } from '@/utills/api-handler';

export const POST = withApiHandler(async (request) => {
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
      console.log('}');
    } else {
      console.log(`${key}: ${value}`);
    }
  }
  console.log('=====================================');

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

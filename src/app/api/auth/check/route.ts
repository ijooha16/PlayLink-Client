import { PLAYLINK_AUTH } from '@/constant/cookie';
import { withApiHandler } from '@/utills/api-handler';
import { cookies } from 'next/headers';

export const GET = withApiHandler(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(PLAYLINK_AUTH);

  if (token?.value) {
    return {
      status: 'success',
      authenticated: true,
      token: token.value,
    };
  }

  return {
    status: 'success',
    authenticated: false,
    token: null,
  };
});

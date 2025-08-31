import { cookies } from 'next/headers';

export async function getToken() {
  const cookieStore = cookies();
  const token = cookieStore.get('access_token')?.value;
  return token;
}

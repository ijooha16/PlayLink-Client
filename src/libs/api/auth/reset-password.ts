import { apiClient } from '@/libs/api/axios';
import { API_URLS } from '@/constant/api-urls';

type ResetPasswordType = {
  user_id: number;
  newPw: string;
};

export const resetPassword = async (req: ResetPasswordType) => {
  console.log('resetPassword', req);
  const { data } = await apiClient.put(API_URLS.AUTH.RESET_PASSWORD, req);
  console.log('resetPassword data', data);
  return data;
};


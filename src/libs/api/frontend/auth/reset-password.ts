import { API_URLS } from '@/constant/api-urls';
import { apiClient } from '@/libs/http';

type ResetPasswordType = {
  user_id: number;
  newPw: string;
};

export const resetPassword = async (req: ResetPasswordType) => {
  const { data } = await apiClient.put(API_URLS.AUTH.RESET_PASSWORD, req);
  return data;
};

import { apiClient } from '@/libs/api/axios';
import { API_URLS } from '@/constant/api-urls';

type EmailType = { email: string };
type EmailVerifyType = EmailType & { code: string };

export const fetchEmail = async (req: EmailType) => {
  const { data } = await apiClient.post(API_URLS.AUTH.EMAIL.SEND, req);
  return data;
};

export const fetchEmailVeriify = async (req: EmailVerifyType) => {
  const { data } = await apiClient.post(API_URLS.AUTH.EMAIL.VERIFY, req);
  return data;
};

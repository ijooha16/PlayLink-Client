import { apiClient } from '@/services/axios';

type EmailType = { email: string };
type EmailVerifyType = EmailType & { code: string };

export const fetchEmail = async (req: EmailType) => {
  const { data } = await apiClient.post('/api/auth/email/send', req);
  return data;
};

export const fetchEmailVeriify = async (req: EmailVerifyType) => {
  const { data } = await apiClient.post('/api/auth/email/verify', req);
  return data;
};

import { apiClient } from '@/services/axios';

type SmsType = { phoneNumber: string };
type SmsVerifyType = SmsType & { code: string };

export const fetchSms = async (sms: SmsType) => {
  console.log('sms', sms);
  const { data } = await apiClient.post('/api/auth/sms/send', sms);
  console.log('data', data);
  return data;
};

export const fetchSmsVerify = async (sms: SmsVerifyType) => {
  const { data } = await apiClient.post('/api/auth/sms/verify', sms);
  return data;
};

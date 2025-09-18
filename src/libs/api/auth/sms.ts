import { apiClient } from '@/libs/api/axios';
import { API_URLS } from '@/constant/api-urls';

type SmsType = { phoneNumber: string };
type SmsVerifyType = SmsType & { code: string };

export const fetchSms = async (sms: SmsType) => {
  console.log('sms', sms);
  const { data } = await apiClient.post(API_URLS.AUTH.SMS.SEND, sms);
  console.log('data', data);
  return data;
};

export const fetchSmsVerify = async (sms: SmsVerifyType) => {
  const { data } = await apiClient.post(API_URLS.AUTH.SMS.VERIFY, sms);
  return data;
};

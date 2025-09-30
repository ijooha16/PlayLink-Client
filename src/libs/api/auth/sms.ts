import { API_URLS } from '@/constant/api-urls';
import { apiClient } from '@/libs/http';

type SmsType = { phoneNumber: string };
type SmsVerifyType = SmsType & { code: string };

export const fetchSms = async (sms: SmsType) => {
  const { data } = await apiClient.post(API_URLS.AUTH.SMS.SEND, sms);
  return data;
};

export const fetchSmsVerify = async (sms: SmsVerifyType) => {
  const { data } = await apiClient.post(API_URLS.AUTH.SMS.VERIFY, sms);
  return data;
};

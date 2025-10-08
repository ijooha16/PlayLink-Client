import { apiClient } from '@/libs/http';
import { API_URLS } from '@/constant/api-urls';

type FindAccountByPhoneType = {
  phoneNumber: string;
  account_type: string;
};

type FindAccountByPhoneEmailType = {
  phoneNumber: string;
  email: string;
  account_type: string;
};

export const findAccountByPhone = async (req: FindAccountByPhoneType) => {
  console.log('findAccountByPhone', req);
  const { data } = await apiClient.post(API_URLS.AUTH.FIND_ACCOUNT, req);
  console.log('findAccountByPhone data', data);
  return data;
};

export const findAccountByPhoneEmail = async (req: FindAccountByPhoneEmailType) => {
  console.log('findAccountByPhoneEmail', req);
  const { data } = await apiClient.post(API_URLS.AUTH.FIND_ACCOUNT, req);
  console.log('findAccountByPhoneEmail data', data);
  return data;
};

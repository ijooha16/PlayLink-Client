import { apiClient } from '@/services/axios';

type FindAccountByPhoneType = {
  phoneNumber: string;
};

type FindAccountByPhoneEmailType = {
  phoneNumber: string;
  email: string;
};

export const findAccountByPhone = async (req: FindAccountByPhoneType) => {
  console.log('findAccountByPhone', req);
  const { data } = await apiClient.post('/api/auth/find-account', req);
  console.log('findAccountByPhone data', data);
  return data;
};

export const findAccountByPhoneEmail = async (req: FindAccountByPhoneEmailType) => {
  console.log('findAccountByPhoneEmail', req);
  const { data } = await apiClient.post('/api/auth/find-account', req);
  console.log('findAccountByPhoneEmail data', data);
  return data;
};
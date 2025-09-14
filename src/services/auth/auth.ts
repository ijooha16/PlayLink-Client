import { apiClient } from '@/services/axios';
import { handleSetSessionStorage } from '@/utills/web-api';

interface SignInType {
  email: string;
  password: string;
  device_id: string;
}

interface SignUpType {
  name: string;
  nickname: string;
  email: string;
  password: string;
  passwordCheck: string;
  phoneNumber: string;
  platform: string;
  device_id: string;
  device_type: string;
  account_type: string;
  favor: string;
  img: File;
}

export const fetchSignIn = async (req: SignInType) => {
  const { data } = await apiClient.post('/api/auth/signin', req);
  if (data.status === 'success') handleSetSessionStorage(data.accessToken);
  return data;
};

export const fetchSignUp = async (signupData: SignUpType) => {
  const formData = new FormData();
  Object.entries(signupData).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });

  const { data } = await apiClient.post('/api/auth/signup', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

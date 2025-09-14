'use client';

import { useMutation } from '@tanstack/react-query';
import { useAlertStore } from '@/stores/alert-store';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/services/axios';
interface SignupData {
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
  // prefer_sports: number[];
  img: File;
}

const useSignup = () => {
  const openAlert = useAlertStore((state) => state.openAlert);
  const router = useRouter();

  const handlePostSignupData = async (signupData: SignupData) => {
    // FormData 생성
    const formData = new FormData();
    formData.append('name', signupData.name);
    formData.append('nickname', signupData.nickname);
    formData.append('email', signupData.email);
    formData.append('password', signupData.password);
    formData.append('passwordCheck', signupData.passwordCheck);
    formData.append('phoneNumber', signupData.phoneNumber);
    formData.append('platform', signupData.platform);
    formData.append('device_id', signupData.device_id);
    formData.append('device_type', signupData.device_type);
    formData.append('account_type', signupData.account_type);
    formData.append('favor', signupData.favor);
    // formData.append('prefer_sports', JSON.stringify(signupData.prefer_sports));

    // 파일이 있으면 추가
    if (signupData.img) {
      formData.append('img', signupData.img);
    }

    // const formDataEntries = Object.fromEntries(formData.entries());
    // console.log('커스텀 훅 FormData 내용:', formDataEntries);

    try {
      const response = await apiClient.post('/api/auth/signup', formData);

      console.log('리스폰스', response);
      openAlert('회원가입 완료 !', `${signupData.name}님 반갑습니다`);
      router.push('/sign-in');

      return response.data;
    } catch (err) {
      console.log('커스텀 훅에서 호출한 사인업 api 데이터 오류', err);
      openAlert('회원가입 실패 !', '회원가입에 실패했습니다');
    }
  };

  const mutation = useMutation({
    mutationFn: handlePostSignupData,
    onSuccess: (data) => {
      console.log('회원가입 성공:', data);
    },
    onError: (error: Error) => {
      console.error('회원가입 실패:', error);
    },
  });

  return {
    signup: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
};

export default useSignup;

'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

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
  prefer_sports: number[];
  img: File;
}

const useSignup = () => {
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
    formData.append('prefer_sports', JSON.stringify(signupData.prefer_sports));

    // 파일이 있으면 추가
    if (signupData.img) {
      formData.append('img', signupData.img);
    }

    // const formDataEntries = Object.fromEntries(formData.entries());
    // console.log('커스텀 훅 FormData 내용:', formDataEntries);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        body: formData,
      });

      console.log('리스폰스', response);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '회원가입에 실패했습니다');
      }
      return response.json();
    } catch (err) {
      console.log('커스텀 훅에서 호출한 사인업 api 데이터 오류', err);
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

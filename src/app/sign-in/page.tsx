'use client';

import Input from '@/components/common-components/input';
import { getDeviceInfo } from '@/utills/get-device-info';
import { useAlertStore } from '@/stores/alert-store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useSignin } from '@/hooks/react-query/auth/use-signin';
import Loading from '@/components/common-components/loading';
import Header from '@/components/common-components/header';
import Button from '@/components/common-components/button';

const SignIn = () => {
  const [emailID, setEmailID] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [enableButton, setEnableButton] = useState<boolean[]>([false, false]);
  const openAlert = useAlertStore((state) => state.openAlert);
  const router = useRouter();

  const { mutate: signIn, isPending } = useSignin({
    onSuccess: () => {
      // 저장된 리다이렉트 경로 확인
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin');
        router.replace(redirectPath);
      } else {
        router.replace('/');
      }
      openAlert('로그인 성공!', '매너 있는 플레이링크 부탁드립니다 :D');
    },
    onError: (err) => {
      console.error('로그인 실패:', err.message);
      openAlert('로그인 실패', err.message);
    },
  });

  // Login Submit 기능 자체가 있었으나, email-login 페이지로 따로 옮겨질 예정
  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailID || !password) return;

    const infos = await getDeviceInfo();

    signIn({
      email: emailID,
      password: password,
      device_id: infos.deviceId,
    });
  };

  return (
    <>
      <Header title='이메일로 시작하기' backbtn />
      <div className='mx-auto flex h-[calc(100vh-144px)] w-full max-w-screen-sm flex-col'>
        {isPending && <Loading variant='white' />}

        {/* 중앙 콘텐츠 */}
        <div className='mx-auto h-full w-full break-keep text-center'>
          <form
            onSubmit={(e) => handleLoginSubmit(e)}
            className='flex flex-col gap-y-4'
          >
            <label className='flex w-full flex-col gap-2 text-left text-body-5'>
              이메일
              <Input
                type='email'
                variant={'default'}
                sizes={'md'}
                onChange={(e) => {
                  setEmailID(e.target.value);
                  setEnableButton([e.target.value.length > 0, enableButton[1]]);
                }}
                placeholder='이메일 입력'
              />
            </label>
            <label className='flex w-full flex-col gap-2 text-left text-body-5'>
              비밀번호
              <Input
                type='password'
                variant={'default'}
                sizes={'md'}
                autoComplete='current-password'
                onChange={(e) => {
                  setPassword(e.target.value);
                  setEnableButton([enableButton[0], e.target.value.length > 6]);
                }}
                placeholder='비밀번호 입력'
              />
            </label>
            <Button type='submit' className='my-2' disabled={!enableButton.every((v) => v)}>
              로그인
            </Button>
          </form>
          <div className='mx-auto mt-2 flex w-full justify-center gap-1 text-sub text-grey02'>
            <Link href={'/find-account'}>
              <p>아이디 찾기</p>
            </Link>
            |
            <Link href={'/change-password'}>
              <p>비밀번호 찾기</p>
            </Link>
            |
            <Link href={'/sign-up/terms'}>
              <p>회원가입</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;

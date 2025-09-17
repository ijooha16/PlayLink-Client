'use client';

import Input from '@/components/common/input';
import { getDeviceInfo } from '@/utills/get-device-info';
import { useAlertStore } from '@/stores/alert-store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useSignin } from '@/hooks/react-query/auth/use-signin';
import Loading from '@/components/common/loading';
import Header from '@/components/common/header';
import Button from '@/components/common/button';
import { toast } from '@/utills/toast';

const SignIn = () => {
  const [emailID, setEmailID] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [enableButton, setEnableButton] = useState<boolean[]>([false, false]);

  // 버튼 활성화 조건: 이메일과 비밀번호가 모두 입력되어야 함
  const isButtonEnabled = enableButton[0] && enableButton[1];
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
      toast.success('로그인 성공!', '매너 있는 플레이링크 부탁드립니다 :D');
    },
    onError: (err) => {
      console.error('로그인 실패:', err.message);
      toast.error('로그인 실패', {size:'md'});
    },
  });

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
            className='gap-y-s-16 flex flex-col'
          >
            <Input
              label='이메일'
              type='email'
              variant={'default'}
              sizes={'md'}
              onChange={(e) => {
                setEmailID(e.target.value);
                setEnableButton([e.target.value.length > 0, enableButton[1]]);
              }}
              placeholder='이메일 입력'
            />
            <Input
              label='비밀번호'
              type='password'
              variant={'default'}
              sizes={'md'}
              autoComplete='current-password'
              showPasswordToggle
              onChange={(e) => {
                setPassword(e.target.value);
                setEnableButton([enableButton[0], e.target.value.length > 0]);
              }}
              placeholder='비밀번호 입력'
            />
            <Button
              className='mt-s-8'
              fontSize='lg'
              type='submit'
              variant={isButtonEnabled ? 'default' : 'disabled'}
            >
              로그인
            </Button>
          </form>
          <div className='text-label-s text-text-neutral mt-s-16 gap-s-8 mx-auto flex w-full justify-center font-semibold'>
            <Link href={'/find-account'}>
              <p>아이디 찾기</p>
            </Link>
            <span className='text-line-neutral'>|</span>
            <Link href={'/change-password'}>
              <p>비밀번호 찾기</p>
            </Link>
            <span className='text-line-neutral'>|</span>
            <Link href={'/sign-up/terms'}>
              <p className='text-primary-800'>회원가입</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;

'use client';

import * as React from 'react';
import Input from '@/components/common/input';
import { getDeviceInfo } from '@/utills/get-device-info';
import { useRouter } from 'next/navigation';
import { FormEvent, useRef, useState } from 'react';
import { useSignin } from '@/hooks/react-query/auth/use-signin';
import Loading from '@/components/common/loading';
import Header from '@/components/common/header';
import Button from '@/components/common/button';
import Link from 'next/link';
import { toast } from '@/utills/toast';

const SignIn = () => {
  const [emailID, setEmailID] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const emailRef = useRef<HTMLInputElement>(null);
  const [emailError, setEmailError] = useState<string>('');

  const router = useRouter();

  const validateEmail = () => {
    const el = emailRef.current;
    if (!el) return false;

    if (el.checkValidity()) {
      setEmailError('');
      return true;
    }

    const v = el.validity;
    if (v.valueMissing || v.typeMismatch)
      setEmailError('올바른 형식의 이메일 주소를 입력해 주세요.');
    else setEmailError('올바른 형식의 이메일 주소를 입력해 주세요.');

    return false;
  };

  const { mutate: signIn, isPending } = useSignin({
    onSuccess: () => {
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin');
        router.replace(redirectPath);
      } else {
        router.replace('/');
      }
      toast.success('로그인 성공!', { duration: 2500 });
    },
    onError: (err) => {
      console.error('로그인 실패:', (err as any)?.message ?? err);
      toast.error('로그인 실패. 이메일/비밀번호를 확인해주세요.');
    },
  });

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 제출 전에 이메일 검증 (비밀번호는 길이만 간단 체크)
    const emailOk = validateEmail();
    const pwOk = password.length > 0;

    if (!emailOk || !pwOk) return;

    const infos = await getDeviceInfo();

    signIn({
      email: emailID,
      password,
      device_id: infos.deviceId,
    });
  };

  return (
    <>
      <Header title='이메일로 시작하기' backbtn />
      <div className='mx-auto flex h-[calc(100vh-144px)] w-full max-w-screen-sm flex-col'>
        {isPending && <Loading variant='white' />}

        <div className='mx-auto h-full w-full break-keep text-center'>
          <form
            noValidate
            onSubmit={handleLoginSubmit}
            className='gap-y-s-16 flex flex-col'
          >
            <Input
              label='이메일'
              type='email'
              variant='default'
              sizes='md'
              placeholder='이메일 입력'
              ref={emailRef}
              value={emailID}
              errorMessage={emailError}
              hasError={!!emailError}
              onChange={(e) => {
                setEmailID(e.target.value);
                if (emailError) setEmailError('');
              }}
              onBlur={validateEmail} // 포커스 아웃 시 검사
            />

            <Input
              label='비밀번호'
              type='password'
              variant='default'
              sizes='md'
              autoComplete='current-password'
              showPasswordToggle
              placeholder='비밀번호 입력'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <Button
              className='mt-s-8'
              fontSize='lg'
              type='submit'
              variant={emailError || !password ? 'disabled' : 'default'}
            >
              로그인
            </Button>
          </form>

          <div className='text-label-s text-text-neutral mt-s-16 gap-s-8 mx-auto flex w-full justify-center font-semibold'>
            <Link href='/find-account'>
              <p>아이디 찾기</p>
            </Link>
            <span className='text-line-neutral'>|</span>
            <Link href='/change-password'>
              <p>비밀번호 찾기</p>
            </Link>
            <span className='text-line-neutral'>|</span>
            <Link href='/sign-up/terms'>
              <p className='text-primary-800'>회원가입</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;

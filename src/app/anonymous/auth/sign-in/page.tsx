'use client';

import { Input } from '@/components/forms/input';
import Header from '@/components/layout/header';
import Button from '@/components/ui/button';
import Loading from '@/components/ui/loading';
import { LOGIN_DEVICE_IDS, PATHS } from '@/constant';
import { useSignin } from '@/hooks/react-query/auth/use-signin';
import Link from 'next/link';
import { FormEvent, useState } from 'react';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  const { mutate: signIn, isPending } = useSignin();

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isEmailValid || !isPasswordValid) return;

    signIn({
      email: trimmedEmail,
      password: trimmedPassword,
      device_id: LOGIN_DEVICE_IDS.DEFAULT,
    });
  };

  return (
    <>
      <Header title='로그인' backbtn />
      <div className='mx-auto flex h-[calc(100vh-144px)] w-full max-w-screen-sm flex-col'>
        {isPending && <Loading variant='white' />}

        <div className='mx-auto h-full w-full break-keep text-center'>
          <form
            noValidate
            onSubmit={handleLoginSubmit}
            className='flex flex-col gap-y-s-16'
          >
            <Input.Email
              value={email}
              onChange={setEmail}
              onValidate={(isValid) => setIsEmailValid(isValid)}
              validateOnChange
            />

            <Input.Password
              value={password}
              onChange={setPassword}
              onValidate={(isValid) => setIsPasswordValid(isValid)}
              placeholder='비밀번호를 입력해주세요.'
              validateOnChange
            />

            <Button
              className='mt-s-8'
              fontSize='lg'
              type='submit'
              disabled={
                !trimmedEmail ||
                !trimmedPassword ||
                !isEmailValid ||
                !isPasswordValid
              }
            >
              로그인
            </Button>
          </form>

          <div className='text-text-neutral mx-auto mt-s-16 flex w-full justify-center gap-s-8 text-label-s font-semibold'>
            <Link href={PATHS.AUTH.FIND_ID}>
              <p>아이디 찾기</p>
            </Link>
            <span className='text-line-neutral'>|</span>
            <Link href={PATHS.AUTH.RESET_PASSWORD}>
              <p>비밀번호 찾기</p>
            </Link>
            <span className='text-line-neutral'>|</span>
            <Link prefetch={true} href={PATHS.AUTH.SIGN_UP}>
              <p className='text-brand-primary'>회원가입</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;

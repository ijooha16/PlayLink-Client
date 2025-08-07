'use client';

import Input from '@/shares/common-components/input';
import SocialIconButton from '@/shares/common-components/social-icon-button';
import { getDeviceInfo } from '@/shares/libs/utills/get-device-info';
import { useAlertStore } from '@/shares/stores/alert-store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const SignIn = () => {
  const [emailID, setEmailID] = useState<string>();
  const [password, setPassword] = useState<string>();
  const openAlert = useAlertStore((state) => state.openAlert);
  const router = useRouter();

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!emailID || !password) return;

    const infos = await getDeviceInfo();

    const payload = {
      email: emailID,
      password: password,
      ip: infos.ip,
      device_id: infos.deviceId,
    };

    console.log(JSON.stringify(payload));

    try {
      const result = await fetch('/api/signin', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const resJson = await result.json();

      //조건에 http 응답 코드 200 넣기
      if (true) {
        openAlert(
          '로그인 성공!',
          '매너 있는 플레이링크 플레이! 부탁드립니다 :D'
        );
        router.replace('/');
      }

      console.log('JSON', resJson);
      console.log('result', result);
    } catch (err) {
      console.error('서버 전송 실패', err);
    }
  };

  return (
    <div className='mx-auto flex h-full w-full max-w-screen-sm flex-col'>
      <div className='mx-auto w-2/3 break-keep p-2 text-center'>
        <div className='animate-fadeInOnce py-6 text-center font-bold'>
          <h1 className='text-3xl'>안녕하세요 :)</h1>
          <h2 className='text-2xl'>플레이링크 입니다.</h2>
        </div>
        <div className='mb-8 text-center'>
          <p className='text-base text-gray-400'>
            브랜드, 하이버, 마미의 통합회원으로 로그인이 가능합니다.
          </p>
        </div>
      </div>
      <div>
        <div className=''>
          <form
            onSubmit={(e) => handleLoginSubmit(e)}
            className='mx-4 flex flex-col gap-y-1'
          >
            <Input
              type='email'
              variant={'default'}
              sizes={'md'}
              onChange={(e) => setEmailID(e.target.value)}
              placeholder='이메일 입력'
            />
            <Input
              type='password'
              variant={'default'}
              sizes={'md'}
              autoComplete='current-password'
              onChange={(e) => setPassword(e.target.value)}
              placeholder='비밀번호 입력'
            />
            <button
              type='submit'
              className='my-2 h-12 w-full rounded-lg bg-blue-500 font-semibold text-white transition-colors ease-in-out'
            >
              로그인
            </button>
          </form>
          <div className='mx-auto flex w-3/4 justify-around text-gray-500'>
            <Link href={'/find-account'}>
              <p>아이디 찾기</p>
            </Link>
            |
            <Link href={'/change-password'}>
              <p>비밀번호 찾기</p>
            </Link>
            |
            <Link href={'/sign-up'}>
              <p>회원가입</p>
            </Link>
          </div>
        </div>
        <div>
          <div className='mx-4 my-6 flex items-center justify-center gap-2 text-sm text-gray-500'>
            <div className='h-px flex-1 bg-gray-200' />
            <span className='whitespace-nowrap text-sm'>
              SNS 계정으로 로그인
            </span>
            <div className='h-px flex-1 bg-gray-200' />
          </div>
          <div className='flex justify-center gap-8'>
            <SocialIconButton
              src='/images/social/kakao-talk.png'
              alt='카카오 로그인'
            />
            <SocialIconButton
              src='/images/social/google.svg'
              alt='구글 로그인'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

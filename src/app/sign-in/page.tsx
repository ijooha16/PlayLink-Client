'use client';

import Input from '@/shares/common-components/input';
import SocialIconButton from '@/shares/common-components/social-icon-button';
import { getDeviceInfo } from '@/shares/libs/utills/get-device-info';
import { useAlertStore } from '@/shares/stores/alert-store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useSignin } from '@/hooks/auth/useSignin';
import Loading from '@/shares/common-components/loading';

const SignIn = () => {
  const [emailID, setEmailID] = useState<string>();
  const [password, setPassword] = useState<string>();
  const openAlert = useAlertStore((state) => state.openAlert);
  const router = useRouter();

  const { mutate: signIn, isPending } = useSignin({
    onSuccess: () => {
      router.replace('/');
      openAlert('로그인 성공!', '매너 있는 플레이링크 부탁드립니다 :D');
    },
    onError: (err) => {
      console.error('로그인 실패:', err.message);
      openAlert('로그인 실패', err.message);
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

  const handleKakaoLogin = () => {
    const CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_OAUTH_REST_API_KEY!;
    const REDIRECT_URI =
      process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI ??
      'http://localhost:3000/oauth/kakaoCallback';

    // (선택) CSRF 방지용 state 생성/저장
    const state = Math.random().toString(36).slice(2);
    sessionStorage.setItem('kakao_oauth_state', state);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
    });

    // ✅ 외부(Kakao)로 리다이렉트
    window.location.href = `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
  };

  return (
    <div className='mx-auto flex h-full w-full max-w-screen-sm flex-col justify-between'>
      {isPending && <Loading variant='white' />}
      <div className='mx-auto w-2/3 break-keep text-center'>
        <div className='animate-fadeInOnce py-6 text-center font-bold'>
          <div className='text-xl'>우리 동네 운동메이트 찾기</div>
        </div>
      </div>

      {/* <div className=''>
          <form
            onSubmit={(e) => handleLoginSubmit(e)}
            className='flex flex-col gap-y-1'
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
        </div> */}
      <div className='w-full'>
        <SocialIconButton
          src='/images/social/kakao-talk.png'
          alt='카카오 로그인'
          type='kakao'
          onClick={handleKakaoLogin}
        />
        <SocialIconButton
          src='/images/social/kakao-talk.png'
          alt='카카오 로그인'
          type='email'
          onClick={handleKakaoLogin}
        />
      </div>
      {/* <SocialIconButton
              src='/images/social/google.svg'
              alt='구글 로그인'
            /> */}
    </div>
  );
};

export default SignIn;

import Input from '@/shares/common-components/input';
import SocialIconButton from '@/shares/common-components/social-icon-button';
import Link from 'next/link';

const SignIn = () => {
  return (
    <div className='mx-auto flex h-full w-full max-w-screen-sm flex-col'>
      <div className='mx-auto w-2/3 break-keep p-2 text-center'>
        <div className='animate-fadeInOnce py-6 text-center font-bold'>
          <h1 className='text-3xl'>안녕하세요 :)</h1>
          <h2 className='text-2xl'>플레이링크 입니다.</h2>
        </div>
        <div className='text-center'>
          <p className='text-base text-gray-400'>
            브랜드, 하이버, 마미의 통합회원으로 로그인이 가능합니다.
          </p>
        </div>
      </div>
      <div>
        <div className=''>
          <div className='mx-4 flex flex-col gap-y-1'>
            <Input
              type='email'
              variant={'default'}
              sizes={'md'}
              placeholder='이메일 입력'
            />
            <Input
              type='password'
              variant={'default'}
              sizes={'md'}
              placeholder='비밀번호 입력'
            />
            <button className='my-2 h-12 w-full rounded-lg bg-blue-500 font-semibold text-white transition-colors ease-in-out'>
              로그인
            </button>
          </div>
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

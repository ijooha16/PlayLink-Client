'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loading from '@/shares/common-components/loading';
import Input from '@/shares/common-components/input';
import Button from '@/shares/common-components/button';
import { getDeviceInfo } from '@/shares/libs/utills/get-device-info';
import { useSignin } from '@/hooks/react-query/auth/useSignin';
import { useAlertStore } from '@/shares/stores/alert-store';
import { Eye, EyeOff } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
  device_id: string;
}

const EmailLoginPage = () => {
  const router = useRouter();
  const openAlert = useAlertStore((state) => state.openAlert);
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    device_id: '',
  })
  
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');

  const { mutate: signIn, isPending } = useSignin({
    onSuccess: () => {
      router.push('/');
      openAlert('로그인 성공!', '매너 있는 플레이링크 부탁드립니다 :D');
    },
    onError: (err) => {
      console.error('로그인 실패:', err.message);
      openAlert('로그인 실패', err.message || '이메일 또는 비밀번호를 확인해주세요.');
    },
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return '';
    }
    if (!emailRegex.test(email)) {
      return '올바른 이메일 형식이 아닙니다';
    }
    return '';
  };

  const handleInputChange = (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'email') {
      const error = validateEmail(value);
      setEmailError(error);
    }
  };

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      openAlert('입력 오류', '이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    const emailValidationError = validateEmail(formData.email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    const infos = await getDeviceInfo();

    signIn({
      email: formData.email,
      password: formData.password,
      device_id: infos.deviceId,
    });
  };

  return (
    <div className='flex flex-col h-full'>
      {isPending && <Loading variant='white' />}
      
      <div className='flex flex-col flex-1'>
        <div className='px-[20px] pt-[24px] flex-1'>
          
          <form onSubmit={handleLoginSubmit} className='flex flex-col h-full'>
            <div className='flex flex-col gap-[24px]'>
              <div className='flex flex-col'>
                <p className='text-body-5 text-body-2 pb-[8px]'>이메일</p>
                <Input
                  type='email'
                  variant='default'
                  sizes='lg'
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  placeholder='playlink@example.com'
                  hasError={!!emailError}
                  errorMessage={emailError}
                  required
                />
              </div>
              
              <div className='flex flex-col'>
                <p className='text-body-5 pb-[8px]'>비밀번호</p>
                <div className='relative'>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    variant='default'
                    sizes='lg'
                    value={formData.password}
                    autoComplete='current-password'
                    onChange={handleInputChange('password')}
                    placeholder='비밀번호를 입력해주세요'
                    required
                  />
                  <button
                    type='button'
                    className='absolute right-4 top-4 text-grey02 z-10'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className='mt-auto py-[24px]'>
              <Button
                type='submit'
                variant='default'
                size='base'
                disabled={isPending || !formData.email || !formData.password || !!emailError}
              >
                {isPending ? '로그인 중...' : '로그인'}
              </Button>
              
              <div className='flex justify-center pt-[16px] text-body-4 text-grey02'>
                <Link href={'/find-account'} className='hover:text-primary'>
                  아이디 찾기
                </Link>
                <span className='px-2'>|</span>
                <Link href={'/change-password'} className='hover:text-primary'>
                  비밀번호 찾기
                </Link>
                <span className='px-2'>|</span>
                <Link href={'/sign-up'} className='hover:text-primary'>
                  회원가입
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailLoginPage;
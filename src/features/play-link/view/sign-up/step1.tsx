'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  SignUpStep1,
  signUpStep1Schema,
} from '../../types/sign-up/sign-up-schema';
import { useEffect, useState } from 'react';
import Input from '@/shares/common-components/input';
import EmailOption from '@/features/play-link/view/sign-up/email-option';
import useSelector from '@/hooks/useSelector';

import { useEmail } from '@/hooks/email/useEmail';
import { useEmailVerify } from '@/hooks/email/useEmailVerify';

import { useSms } from '@/hooks/sms/useSms';
import { useSmsVerify } from '@/hooks/sms/useSmsVerify';

import {
  TERMS_OF_SERVICE,
  PRIVACY_POLICY,
  LOCATION_POLICY,
  THIRD_PARTY_POLICY,
  MARKETING_POLICY,
} from '@/shares/constant/sigin-up-privacy';

const Step1 = ({
  onNext,
  defaultValues,
}: {
  onNext: (data: SignUpStep1) => void;
  defaultValues?: Partial<SignUpStep1>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SignUpStep1>({
    resolver: zodResolver(signUpStep1Schema),
    defaultValues,
  });

  const [toggle, setToggle] = useState<boolean>(false);

  const watched = useWatch({ control });

  const { selectorValue, handleGetSelectorValueData } = useSelector();
  const [emailAuthView, setEmailAuthView] = useState(false);
  const [smsView, setSmsView] = useState(false);

  // 인증코드 입력 상태
  const [emailCode, setEmailCode] = useState('');
  const [smsCode, setSmsCode] = useState('');

  const { mutate: emailSend, isPending: isSending } = useEmail({
    onSuccess: () => {
      setEmailAuthView(true);
    },
    onError: (err) => {
      console.error('이메일 인증 코드 전송 실패:', err.message);
    },
  });

  const { mutate: emailVerify, isPending: isVerifying } = useEmailVerify({
    onSuccess: () => {
      setEmailAuthView(false);
    },
    onError: (err) => {
      console.error('이메일 인증 확인 실패:', err.message);
    },
  });

  const { mutate: smsSend, isPending: isSmsSending } = useEmail({
    onSuccess: () => {
      setEmailAuthView(true);
    },
    onError: (err) => {
      console.error('로그인 실패:', err.message);
    },
  });

  const { mutate: smsVerify, isPending: isSmsVerify } = useEmailVerify({
    onSuccess: () => {
      setEmailAuthView(false);
    },
    onError: (err) => {
      console.error('로그인 실패:', err.message);
    },
  });

  const isAllRequiredFilled =
    watched.email?.trim() &&
    watched.password?.trim() &&
    watched.confirmPassword?.trim() &&
    watched.phone?.trim() &&
    watched.agreeTerms &&
    watched.agreePrivacy &&
    watched.isOver14 &&
    watched.agreeLocation &&
    watched.agreeThirdParty;

  const onSubmit = (data: SignUpStep1) => {
    onNext(data);
  };

  // 이메일 인증코드 전송
  const handleSendEmailCode = () => {
    if (!watched.email?.trim()) return;
    if (isSending) return;
    emailSend({ email: watched.email.trim() }); //
  };
  // 이메일 인증코드 확인
  const handleEmailCodeCheck = () => {
    if (!watched.email?.trim()) return;
    if (!emailCode.trim()) return;
    if (isVerifying) return;

    emailVerify({
      email: watched.email.trim(),
      code: emailCode.trim(),
    }); //
  };

  // 핸드폰 인증코드 전송
  const handleSmsCodeCheck = () => {
    if (!watched.email?.trim()) return;
    if (isSending) return;
    smsSend({ email: watched.email.trim() }); // <- useEmail 훅에서 기대하는 payload에 맞춰주세요
  };

  // 핸드폰 인증코드 확인
  const handleSendSmsCode = () => {
    if (!watched.email?.trim()) return;
    if (!emailCode.trim()) return;
    if (isVerifying) return;

    smsVerify({
      email: watched.email.trim(),
      code: emailCode.trim(),
    }); //
  };

  const checkboxClass =
    'relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-blue-500 checked:bg-blue-500 checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-xs checked:after:font-bold checked:after:text-white checked:after:content-["✓"]';
  const termsData: any = [
    { name: 'agreeTerms', label: '이용약관 동의', required: true },
    { name: 'agreePrivacy', label: '개인정보 처리방침 동의', required: true },
    { name: 'isOver14', label: '만 14세 이상입니다', required: true },
    { name: 'agreeLocation', label: '위치 정보 이용 동의', required: true },
    { name: 'agreeThirdParty', label: '제 3자 정보 제공 동의', required: true },
    { name: 'agreeMarketing', label: '마케팅 수신 동의', required: false },
  ];

  return (
    // <div style={{ whiteSpace: 'pre-wrap' }}>{TERMS_OF_SERVICE}</div>
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-4'>
      <div className='flex flex-col space-y-2'>
        <label htmlFor='email-id' className='text-lg font-semibold'>
          아이디
        </label>
        <div>
          <div className='flex justify-between gap-4'>
            <div className='relative flex-1'>
              <input
                id='email-id'
                type='email'
                className='bg-transparnent text-md w-full rounded-lg border border-gray-300 px-4 py-2 text-inherit placeholder-gray-400 focus:outline-none focus:ring-0 disabled:bg-gray-200'
                placeholder='이메일'
                {...register('email')}
              />
            </div>

            <button
              onClick={handleSendEmailCode}
              type='button'
              className='w-50 box-border cursor-pointer rounded-lg bg-[#E7E9EC] px-4 text-sm text-[#BDC0C6] transition-colors'
            >
              인증 받기
            </button>
          </div>

          {emailAuthView && (
            <div className='mt-4 flex justify-between gap-4'>
              <input
                id='text'
                type='text'
                className='bg-transparnent text-md flex-1 rounded-lg border border-gray-300 px-4 py-2 text-inherit placeholder-gray-400 focus:outline-none focus:ring-0 disabled:bg-gray-200'
                placeholder='이메일 인증번호'
                onChange={(e) => setEmailCode(e.target.value)}
              />
              <button
                className='w-300 box-border cursor-pointer rounded-lg bg-[#E7E9EC] px-4 text-sm text-[#BDC0C6] transition-colors'
                onClick={handleEmailCodeCheck}
                disabled={isVerifying || !emailCode.trim()}
              >
                인증 확인
              </button>
            </div>
          )}
          <p className='h-[20px] text-sm text-red-500'>
            {errors.email && errors.email.message}
          </p>
        </div>
      </div>

      <fieldset className='flex flex-col space-y-2'>
        <div>
          <legend className='text-lg font-semibold'>비밀번호</legend>
          <p className='text-sm text-gray-400'>
            6-20자/영문 대문자, 소문자, 숫자, 특수문자 중 2가지 이상 조합
          </p>
        </div>

        <div className='flex flex-col gap-y-2'>
          <label htmlFor='password' className='sr-only'>
            비밀번호
          </label>
          <Input
            id='password'
            type='password'
            variant={'default'}
            sizes={'md'}
            placeholder='비밀번호'
            {...register('password')}
          />

          {/* <p className='h-[20px] text-sm text-red-500'>
            {errors.password && errors.password.message}
          </p> */}

          <label htmlFor='confirmPassword' className='sr-only'>
            비밀번호 확인
          </label>
          <Input
            id='confirmPassword'
            type='password'
            variant={'default'}
            sizes={'md'}
            placeholder='비밀번호 확인'
            {...register('confirmPassword')}
          />

          <p className='h-[20px] text-sm text-red-500'>
            {(errors.password && errors.password.message) ||
              (errors.confirmPassword && errors.confirmPassword.message)}
          </p>
        </div>
      </fieldset>
      <div className='flex flex-col'>
        <label htmlFor='tel' className='text-lg font-semibold'>
          휴대폰 번호
        </label>
        <div>
          <div className='flex justify-between gap-4'>
            {/* <Input
              id='tel'
              type='tel'
              variant={'default'}
              sizes={'lg'}
              placeholder='휴대폰 번호'
              {...register('phone')}
            /> */}
            <input
              id='tel'
              type='tel'
              className='bg-transparnent text-md flex-1 rounded-lg border border-gray-300 px-4 py-2 text-inherit placeholder-gray-400 focus:outline-none focus:ring-0 disabled:bg-gray-200'
              placeholder='휴대폰 번호'
              {...register('phone')}
            />
            <button
              className='w-300 box-border cursor-pointer rounded-lg bg-[#E7E9EC] px-4 text-sm text-[#BDC0C6] transition-colors'
              onClick={handleSendSmsCode}
            >
              인증 받기
            </button>
          </div>
          {smsView && (
            <div className='mt-4 flex justify-between gap-4'>
              {/* <Input
                id='tel'
                type='tel'
                variant={'default'}
                sizes={'md'}
                placeholder='인증번호'
                {...register('phone')}
              /> */}
              <input
                id='tel'
                type='tel'
                className='bg-transparnent text-md flex-1 rounded-lg border border-gray-300 px-4 py-2 text-inherit placeholder-gray-400 focus:outline-none focus:ring-0 disabled:bg-gray-200'
                placeholder='인증번호'
                {...register('phone')}
              />
              <button
                className='w-300 box-border cursor-pointer rounded-lg bg-[#E7E9EC] px-4 text-sm text-[#BDC0C6] transition-colors'
                onClick={handleSmsCodeCheck}
              >
                인증 확인
              </button>
            </div>
          )}
          <p className='h-[20px] text-sm text-red-500'>
            {errors.phone && errors.phone.message}
          </p>
        </div>
      </div>
      {/* <div className='flex flex-col space-y-2'>
        <div className='flex justify-between'>
          <label className='flex cursor-pointer items-center gap-2'>
            <input
              type='checkbox'
              {...register('agreeTerms')}
              className='relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-blue-500 checked:bg-blue-500 checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-xs checked:after:font-bold checked:after:text-white checked:after:content-["✓"]'
            />
            <span>이용약관 동의 (필수)</span>
          </label>
          <div className='cursor-pointer text-gray-400'>{'>'}</div>
        </div>

        <div className='flex justify-between'>
          <label className='flex cursor-pointer items-center gap-2'>
            <input
              type='checkbox'
              {...register('agreePrivacy')}
              className='relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-blue-500 checked:bg-blue-500 checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-xs checked:after:font-bold checked:after:text-white checked:after:content-["✓"]'
            />
            <span>개인정보 처리방침 동의 (필수)</span>
          </label>
          <div className='cursor-pointer text-gray-400'>{'>'}</div>
        </div>

        <div className='flex justify-between'>
          <label className='flex cursor-pointer items-center gap-2'>
            <input
              type='checkbox'
              className='relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-blue-500 checked:bg-blue-500 checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-xs checked:after:font-bold checked:after:text-white checked:after:content-["✓"]'
              {...register('isOver14')}
            />
            <span>만 14세 이상입니다 (필수)</span>
          </label>
          <div className='cursor-pointer text-gray-400'>{'>'}</div>
        </div>

        <div className='flex justify-between'>
          <label className='flex cursor-pointer items-center gap-2'>
            <input
              type='checkbox'
              className='relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-blue-500 checked:bg-blue-500 checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-xs checked:after:font-bold checked:after:text-white checked:after:content-["✓"]'
              {...register('agreeLocation')}
            />
            <span>위치 정보 이용 동의 (필수)</span>
          </label>
          <div className='cursor-pointer text-gray-400'>{'>'}</div>
        </div>

        <div className='flex justify-between'>
          <label className='flex cursor-pointer items-center gap-2'>
            <input
              type='checkbox'
              className='relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-blue-500 checked:bg-blue-500 checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-xs checked:after:font-bold checked:after:text-white checked:after:content-["✓"]'
              {...register('agreeThirdParty')}
            />
            <span>제 3자 정보 제공 동의 (필수)</span>
          </label>
          <div className='cursor-pointer text-gray-400'>{'>'}</div>
        </div>

        <div className='flex justify-between'>
          <label className='flex cursor-pointer items-center gap-2'>
            <input
              type='checkbox'
              className='relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-blue-500 checked:bg-blue-500 checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-xs checked:after:font-bold checked:after:text-white checked:after:content-["✓"]'
              {...register('agreeMarketing')}
            />
            <span>마케팅 수신 동의 (선택)</span>
          </label>
          <div className='cursor-pointer text-gray-400'>{'>'}</div>
        </div>
      </div> */}

      <div className='flex flex-col space-y-2'>
        {termsData.map((term: any) => (
          <div key={term.name} className='flex justify-between'>
            <label className='flex cursor-pointer items-center gap-2'>
              <input
                type='checkbox'
                {...register(term.name)}
                className={checkboxClass}
              />
              <span>
                {term.label} ({term.required ? '필수' : '선택'})
              </span>
            </label>
            <div className='cursor-pointer text-gray-400'>{'>'}</div>
          </div>
        ))}
      </div>
      <div>
        <button
          type='submit'
          className='w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors ease-in-out focus:bg-blue-700 disabled:bg-[#E7E9EC] disabled:text-[#BDC0C6]'
          disabled={!isAllRequiredFilled}
        >
          다음
        </button>
      </div>
    </form>
  );
};

export default Step1;

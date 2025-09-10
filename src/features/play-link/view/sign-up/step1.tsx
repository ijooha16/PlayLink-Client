
'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  SignUpStep1,
  signUpStep1Schema,
} from '../../types/sign-up/sign-up-schema';
import { useState } from 'react';
import Input from '@/shares/common-components/input';

import { useEmail } from '@/hooks/query/email/useEmail';
import { useEmailVerify } from '@/hooks/query/email/useEmailVerify';

import { useSms } from '@/hooks/query/sms/useSms';
import { useSmsVerify } from '@/hooks/query/sms/useSmsVerify';
import Button from '@/shares/common-components/button';
import { useModalStore } from '@/shares/stores/modal-store';

import { ChevronDown } from 'lucide-react';

import { POLICY } from '@/shares/constant/sigin-up-privacy';

type TermsKey =
  | 'agreeTerms'
  | 'agreePrivacy'
  | 'isOver14'
  | 'agreeLocation'
  | 'agreeThirdParty'
  | 'agreeMarketing';

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

  const watched = useWatch({ control });
  const { openModal } = useModalStore();

  const [emailAuthView, setEmailAuthView] = useState(false);
  const [smsView, setSmsView] = useState(false);

  // 인증코드 입력 상태
  const [emailCode, setEmailCode] = useState('');
  const [smsCode, setSmsCode] = useState('');

  const [emailCodeError, setEmailCodeError] = useState<string | null>(null);
  const [smsCodeError, setSmsCodeError] = useState<string | null>(null);

  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  // 버튼 활성화
  const [emailButtonEnabled, setEmailButtonEnabled] = useState(true);
  const [smsButtonEnabled, setSmsButtonEnabled] = useState(true);

  // 약관 모달 열기
  const showTermsModal = (termName: string) => {
    const policyItem = POLICY.find(p => p.id === termName);
    if (policyItem) {
      openModal({
        title: policyItem.title,
        content: policyItem.content,
        isMarkdown: true,
        showCancelButton: false,
        confirmText: '확인',
      });
    }
  };

  // 이메일 인증코드 전송
  const { mutate: emailSend, isPending: isSending } = useEmail({
    onSuccess: () => {
      setEmailAuthView(true);
      setEmailCodeError(null); // 오류 초기화
      alert('인증번호를 발송하였습니다.');
    },
    onError: (err) => {
      setEmailCodeError(err.message || '인증 메일 전송에 실패했습니다.');
      console.error('이메일 인증 코드 전송 실패:', err.message);
    },
  });

  // 이메일 인증코드 확인
  const { mutate: emailVerify, isPending: isVerifying } = useEmailVerify({
    onSuccess: (data) => {
      if (data?.status !== 'error') {
        setEmailAuthView(false);
        setEmailCodeError(null);
        setEmailVerified(true);
      }
      if (data?.status === 'error') {
        setEmailCodeError('인증번호가 올바르지 않습니다.');
      }
    },
    onError: (err) => {
      setEmailCodeError(err.message || '인증번호가 올바르지 않습니다.');
      console.error('이메일 인증 확인 실패:', err.message);
    },
  });

  // sms 인증코드 전송
  const { mutate: smsSend, isPending: isSmsSending } = useSms({
    onSuccess: () => {
      setSmsView(true);
      setSmsCodeError(null);
      alert('인증번호를 발송하였습니다.');
    },
    onError: (err) => {
      setSmsCodeError(err.message || '인증 문자 전송에 실패했습니다.');
      console.error('휴대폰 인증코드 전송 실패:', err.message);
    },
  });

  // sms 인증코드 확인
  const { mutate: smsVerify, isPending: isSmsVerify } = useSmsVerify({
    onSuccess: (data) => {
      if (data?.status !== 'error') {
        setSmsView(false);
        setSmsCodeError(null);
        setPhoneVerified(true);
      }
      if (data?.status === 'error') {
        setSmsCodeError('인증번호가 올바르지 않습니다.');
      }
    },
    onError: (err) => {
      console.log('에러 떳음');
      setSmsCodeError('인증번호가 올바르지 않습니다.');
      console.error('휴대폰 인증코드 확인 실패:', err.message);
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

  // 핸드폰 인증코드 확인
  const handleSmsCodeCheck = () => {
    if (!watched.phone?.trim()) return;
    if (isSmsVerify) return;

    smsVerify({
      phoneNumber: watched.phone.trim(),
      code: smsCode.trim(),
    }); //
  };

  // 핸드폰 인증코드 전송
  const handleSendSmsCode = () => {
    if (!watched.phone?.trim()) return;
    if (isSmsSending) return;
    if (watched.phone.length < 10) {
      setSmsCodeError('올바른 휴대폰 번호로 입력해 주세요');
    } else {
      smsSend({ phoneNumber: watched.phone.trim() });
    }
  };

  const checkboxClass =
    'relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-blue-500 checked:bg-blue-500 checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-xs checked:after:font-bold checked:after:text-white checked:after:content-["✓"]';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={(e) => {
        if ((emailAuthView || smsView) && e.key === 'Enter') {
          e.preventDefault(); // 코드 입력 단계에서 Enter 제출 방지
        }
      }}
      className='flex flex-col space-y-4'
    >
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
                onChange={(e) => {
                  if (
                    e.target.value.includes('@') &&
                    e.target.value.includes('.')
                  ) {
                    setEmailButtonEnabled(false);
                  } else {
                    setEmailButtonEnabled(true);
                  }
                }}
              />
            </div>

            <button
              onClick={handleSendEmailCode}
              type='button'
              disabled={emailButtonEnabled}
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
                type='button'
              >
                인증 확인
              </button>
            </div>
          )}
          {emailCodeError && (
            <p className='text-sm text-red-500'>{emailCodeError}</p>
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
            <input
              id='tel'
              type='tel'
              className='bg-transparnent text-md flex-1 rounded-lg border border-gray-300 px-4 py-2 text-inherit placeholder-gray-400 focus:outline-none focus:ring-0 disabled:bg-gray-200'
              placeholder='휴대폰 번호'
              {...register('phone')}
              onChange={(e) => {
                const input = e.target.value;
                const sanitizedInput = input.replace(/[^0-9]/g, ''); // 숫자 이외의 문자 제거
                e.target.value = sanitizedInput;
                if (sanitizedInput.length >= 10) {
                  setSmsButtonEnabled(false);
                } else {
                  setSmsButtonEnabled(true);
                }
              }}
            />

            <button
              onClick={handleSendSmsCode}
              type='button'
            >
              인증 받기
            </button>
          </div>
          {smsView && (
            <div className='mt-4 flex justify-between gap-4'>
              <input
                id='tel'
                type='tel'
                className='bg-transparnent text-md flex-1 rounded-lg border border-gray-300 px-4 py-2 text-inherit placeholder-gray-400 focus:outline-none focus:ring-0 disabled:bg-gray-200'
                placeholder='인증번호'
                onChange={(e) => setSmsCode(e.target.value)}
              />
              <button
                className='w-300 box-border cursor-pointer rounded-lg bg-[#E7E9EC] px-4 text-sm text-[#BDC0C6] transition-colors'
                onClick={handleSmsCodeCheck}
                type='button'
              >
                인증 확인
              </button>
            </div>
          )}
          {smsCodeError && (
            <p className='mt-2 text-sm text-red-500'>{smsCodeError}</p>
          )}
        </div>
      </div>

      <p className='h-[20px] text-sm text-red-500'>
        {errors.phone && errors.phone.message}
      </p>
      <div className='flex flex-col space-y-4'>
        {POLICY.map((policy) => (
          <div key={policy.id} className='flex justify-between'>
            <label className='flex cursor-pointer items-center gap-2'>
              <input
                type='checkbox'
                {...register(policy.id as TermsKey)}
                className={checkboxClass}
              />
              <span>
                {policy.title} 동의 ({policy.required ? '필수' : '선택'})
              </span>
            </label>
            <button
              type='button'
              onClick={() => showTermsModal(policy.id)}
              className='cursor-pointer p-1'
            >

              <ChevronDown color='var(--color-grey-02)' className='' size={16} />
            </button>
          </div>
        ))}
      </div>
      <div>
        <button
          type='submit'
          className='w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors ease-in-out focus:bg-blue-700 disabled:bg-[#E7E9EC] disabled:text-[#BDC0C6]'
          disabled={!isAllRequiredFilled || !emailVerified || !phoneVerified}
          // disabled={!isAllRequiredFilled}
        >
          다음
        </button>
      </div>
    </form>
  );
};

export default Step1;

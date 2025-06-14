'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  SignUpStep1,
  signUpStep1Schema,
} from '../../types/sign-up/sign-up-schema';
import { useState } from 'react';

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-4'>
      <div className='flex flex-col space-y-2'>
        <label htmlFor='email-id' className='text-lg font-semibold'>
          아이디
        </label>
        <div>
          <input
            id='email-id'
            className='w-full rounded-lg border-2 border-gray-100 px-2 py-2'
            type='email'
            placeholder='이메일'
            {...register('email')}
          />
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

        <div className='flex flex-col'>
          <label htmlFor='password' className='sr-only'>
            비밀번호
          </label>
          <input
            id='password'
            type='password'
            className='w-full rounded-lg border-2 border-gray-100 px-2 py-2'
            placeholder='비밀번호'
            {...register('password')}
          />

          <p className='h-[20px] text-sm text-red-500'>
            {errors.password && errors.password.message}
          </p>

          <label htmlFor='confirmPassword' className='sr-only'>
            비밀번호 확인
          </label>
          <input
            id='confirmPassword'
            type='password'
            className='w-full rounded-lg border-2 border-gray-100 px-2 py-2'
            placeholder='비밀번호 확인'
            {...register('confirmPassword')}
          />

          <p className='h-[20px] text-sm text-red-500'>
            {errors.confirmPassword && errors.confirmPassword.message}
          </p>
        </div>
      </fieldset>

      <div className='flex flex-col space-y-2'>
        <label htmlFor='tel' className='text-lg font-semibold'>
          휴대폰 번호
        </label>
        <div>
          <input
            id='tel'
            type='tel'
            className='w-full rounded-lg border-2 border-gray-100 px-2 py-2'
            placeholder='휴대폰 번호'
            {...register('phone')}
          />
          <p className='h-[20px] text-sm text-red-500'>
            {errors.phone && errors.phone.message}
          </p>
        </div>
      </div>

      <div className='flex flex-col space-y-2'>
        <label>
          <input type='checkbox' {...register('agreeTerms')} /> 이용약관 동의
          (필수)
        </label>

        <label>
          <input type='checkbox' {...register('agreePrivacy')} /> 개인정보
          처리방침 동의 (필수)
        </label>

        <label>
          <input type='checkbox' {...register('isOver14')} /> 만 14세 이상입니다
          (필수)
        </label>

        <label>
          <input type='checkbox' {...register('agreeLocation')} /> 위치 정보
          이용 동의 (필수)
        </label>

        <label>
          <input type='checkbox' {...register('agreeThirdParty')} /> 제 3자 정보
          제공 동의 (필수)
        </label>

        <label>
          <input type='checkbox' {...register('agreeMarketing')} /> 마케팅 수신
          동의 (선택)
        </label>
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

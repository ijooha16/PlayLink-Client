'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  SignUpStep2,
  signUpStep2Schema,
} from '../../types/sign-up/sign-up-schema';
import Input from '@/shares/common-components/input';

// util
import randomProfileImage from '@/shares/libs/utills/random-profile-image';

const Step2 = ({
  onNext,
  defaultValues,
}: {
  onNext: (data: SignUpStep2) => void;
  defaultValues?: Partial<SignUpStep2>;
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpStep2>({
    resolver: zodResolver(signUpStep2Schema),
    defaultValues,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageFile = watch('profileImage');

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const url = URL.createObjectURL(file);
      setPreview(url);
      console.log(file);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }

    if (errors.profileImage) {
      {
        typeof errors.profileImage.message === 'string'
          ? alert(errors.profileImage.message)
          : '이미지 파일 오류가 있습니다.';
      }
    }
  }, [imageFile]);

  const onSubmit = (data: SignUpStep2) => {
    onNext({
      nickname: data.nickname,
      profileImage: imageFile[0],
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
      <div className='flex flex-col items-center space-y-4'>
        <h2 className='text-xl font-semibold'>프로필 설정</h2>
        <p className='text-sm text-gray-500'>
          프로필 사진과 이름을 설정해서 나만의 개성을 표현해보세요!
        </p>

        <div className='relative h-[100px] w-[100px]'>
          <div
            className='flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-gray-200'
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <Image
                src={preview}
                alt='user_profile_img'
                width={100}
                height={100}
                className='object-cover'
              />
            ) : (
              <Image
                src={randomProfileImage()}
                alt='random_profile_img'
                width={100}
                height={100}
                className='object-cover'
              />
            )}
          </div>

          <button
            type='button'
            onClick={() => fileInputRef.current?.click()}
            className='absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white shadow-md'
          >
            +
          </button>

          <input
            id='profileImage'
            type='file'
            accept='image/png, image/jpeg, image/jpg'
            {...register('profileImage')}
            ref={(e) => {
              register('profileImage').ref(e);
              fileInputRef.current = e;
            }}
            className='hidden'
          />
        </div>
      </div>

      <div className='flex flex-col space-y-2'>
        <Input
          id='nickname'
          type='text'
          placeholder='닉네임을 입력해주세요'
          variant={'default'}
          sizes={'sm'}
          {...register('nickname')}
        />

        {errors.nickname ? (
          <p className='text-sm text-red-500'>{errors.nickname.message}</p>
        ) : (
          <p className='text-xs text-gray-400'>
            이름은 2자 이상 - 15자 이하로 입력해주세요
          </p>
        )}
      </div>

      <div className='flex justify-between pt-4'>
        <button
          type='submit'
          disabled={!(watch('nickname')?.length > 0)}
          className='w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors ease-in-out focus:bg-blue-700 disabled:bg-[#E7E9EC] disabled:text-[#BDC0C6]'
        >
          다음
        </button>
      </div>
    </form>
  );
};

export default Step2;

'use client';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSignUpStepStore } from '@/store/sign-up-store';
import Image from 'next/image';
import { ProfileImg } from '@/utills/random-profile-image';
import randomProfileImage from '@/utills/random-profile-image';
import AuthLayoutContainer from '@/components/layout/auth-layout';

const ProfileSetup = () => {
  const router = useRouter();
  const { data, updateStep, validateStep } = useSignUpStepStore();

  // 페이지 진입 시 이전 단계 검증
  useEffect(() => {
    if (!validateStep('profile')) {
      router.push('/sign-up/email-check');
    }
  }, []);
  const [nickname, setNickname] = useState(data.nickname || '');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const randomImgRef = useRef<ProfileImg>(randomProfileImage());
  const [errors, setErrors] = useState<{
    nickname?: string;
  }>({});

  useEffect(() => {
    if (profileImage) {
      const url = URL.createObjectURL(profileImage);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [profileImage]);

  const validateNickname = (name: string) => {
    if (!name.trim()) return '닉네임을 입력해주세요';
    if (name.length < 2) return '닉네임은 2자 이상이어야 합니다';
    if (name.length > 15) return '닉네임은 15자 이하여야 합니다';
    return '';
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);

    const error = validateNickname(value);
    setErrors({ nickname: error || undefined });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 체크 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다');
        return;
      }

      // 파일 타입 체크
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('JPG, JPEG, PNG 파일만 업로드 가능합니다');
        return;
      }

      setProfileImage(file);
    }
  };

  const handleNext = () => {
    const nicknameError = validateNickname(nickname);
    if (nicknameError) {
      setErrors({ nickname: nicknameError });
      return;
    }

    updateStep({
      nickname,
      profileImage,
    });
    router.push('/sign-up/sports');
  };

  return (
    <AuthLayoutContainer title={'프로필 사진과 닉네임을 \n 설정해주세요!'}>
      <div className='flex flex-col items-center'>
        <div className='relative'>
          <div
            className='flex h-[120px] w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-200'
            onClick={() => fileInputRef.current?.click()}
          >
            <Image
              src={preview || randomImgRef.current}
              alt='profile_img'
              width={120}
              height={120}
              className='object-cover'
              priority={true}
            />
          </div>

          <button
            type='button'
            onClick={() => fileInputRef.current?.click()}
            className='absolute bottom-0 right-0 flex h-[32px] w-[32px] items-center justify-center rounded-full bg-blue-500 text-lg text-white shadow-md'
          >
            +
          </button>

          <input
            type='file'
            accept='image/png, image/jpeg, image/jpg'
            ref={fileInputRef}
            onChange={handleFileChange}
            className='hidden'
          />
        </div>
      </div>

      <div className='flex flex-col pb-[24px]'>
        <p className='text-body-04 pb-[8px] text-grey02'>닉네임</p>
        <Input
          variant='default'
          sizes='lg'
          placeholder='닉네임을 입력해주세요'
          value={nickname}
          onChange={handleNicknameChange}
          hasError={!!errors.nickname}
          errorMessage={errors.nickname || ''}
        />
        {!errors.nickname && (
          <p className='pt-[8px] text-caption text-grey02'>
            닉네임은 2자 이상 15자 이하로 입력해주세요
          </p>
        )}
      </div>

      <Button
        variant='default'
        onClick={handleNext}
        disabled={!nickname.trim() || !!errors.nickname}
      >
        다음
      </Button>
    </AuthLayoutContainer>
  );
};

export default ProfileSetup;

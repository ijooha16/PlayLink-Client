'use client';

import { Input } from '@/components/forms/input';
import { Edit, Profile } from '@/components/shared/icons';
import Button from '@/components/ui/button';
import { ERROR_MESSAGES, PATHS } from '@/constant';
import { completeStep } from '@/hooks/auth/use-signup-flow';
import { checkNicknameDuplicate } from '@/libs/api/frontend/auth/check-nickname';
import { validateNickname } from '@/libs/valid/auth/nickname';
import useSignUpStore from '@/store/use-sign-up-store';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

const ProfileSetup = () => {
  const { updateProfile, profile } = useSignUpStore();
  const router = useRouter();

  const [nickname, setNickname] = useState(profile.nickname || '');
  const isFile = (v: unknown): v is File => v instanceof File;
  const [profileImage, setProfileImage] = useState<File | string | null>(
    profile.img || null
  );
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [nicknameError, setNicknameError] = useState('');

  useEffect(() => {
    if (!profileImage) {
      setPreview(null);
      return;
    }

    if (isFile(profileImage)) {
      const url = URL.createObjectURL(profileImage);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(profileImage);
    }
  }, [profileImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('JPG, JPEG, PNG 파일만 업로드 가능합니다');
      return;
    }

    setProfileImage(file);
  };

  async function urlToFile(
    url: string,
    fileName = 'profile.jpg',
    mimeType?: string
  ) {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], fileName, { type: mimeType ?? blob.type });
  }

  const handleNext = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (isCheckingNickname) return;

    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      setNicknameError(ERROR_MESSAGES.NICKNAME.LENGTH_ERROR);
      return;
    }

    const formatError = validateNickname(trimmedNickname);
    if (formatError) {
      setNicknameError(formatError);
      return;
    }

    setIsCheckingNickname(true);
    setNicknameError('');

    try {
      const response = await checkNicknameDuplicate(trimmedNickname);

      if (response.status === 'error') {
        setNicknameError(
          response.message || '닉네임 확인 중 오류가 발생했습니다.'
        );
        return;
      }

      if (response.errCode !== 0 || response.data?.isDuplicate === 1) {
        setNicknameError(
          response.message || ERROR_MESSAGES.NICKNAME.DUPLICATED
        );
        return;
      }

      updateProfile('nickname', trimmedNickname);

      if (profileImage) {
        const imgToSave = isFile(profileImage)
          ? profileImage
          : await urlToFile(profileImage, 'profile-from-url.jpg');

        updateProfile('img', imgToSave);
      }

      completeStep('profile');
      router.push(PATHS.AUTH.ADDRESS);
    } catch (error) {
      setNicknameError(
        '닉네임 확인에 실패했습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setIsCheckingNickname(false);
    }
  };

  return (
    <>
      <div className='flex flex-col items-center'>
        <div className='relative my-s-24 h-[100px] w-[100px]'>
          <div
            className='flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-full'
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <Image
                src={preview}
                alt='profile_img'
                width={100}
                height={100}
                className='block h-full w-full object-cover'
                priority={true}
              />
            ) : (
              <Profile size={100} className='text-gray-400' />
            )}
          </div>

          <button
            type='button'
            onClick={() => fileInputRef.current?.click()}
            className='absolute bottom-0 right-0 flex h-[32px] w-[32px] items-center justify-center rounded-full border-2 border-white bg-bg-neutral'
          >
            <Edit size={24} />
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

      <form onSubmit={handleNext}>
        <div className='flex flex-col pb-[24px]'>
          <Input.Nickname
            value={nickname}
            onChange={(value) => {
              setNickname(value);
              if (nicknameError) {
                setNicknameError('');
              }
            }}
            autoFocus
            hasError={Boolean(nicknameError)}
            errorMessage={nicknameError}
          />
        </div>

        <Button
          variant='default'
          type='submit'
          disabled={!nickname.trim() || isCheckingNickname}
          isFloat
        >
          {isCheckingNickname ? '확인 중...' : '다음'}
        </Button>
      </form>
    </>
  );
};

export default ProfileSetup;

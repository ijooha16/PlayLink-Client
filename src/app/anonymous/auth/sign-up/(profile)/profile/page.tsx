'use client';

import { Input } from '@/components/forms/input';
import { Edit, Profile } from '@/components/shared/icons';

import Button from '@/components/ui/button';
import { PATHS } from '@/constant';
import { completeStep } from '@/hooks/auth/use-signup-flow';
import useSignUpStore from '@/store/use-sign-up-store';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';

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
  const [isNicknameValid, setIsNicknameValid] = useState(false);

  const normalizedNickname = useMemo(() => nickname.trim(), [nickname]);

  // 미리보기: File이면 objectURL, string이면 그대로 URL
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
      // string URL
      setPreview(profileImage);
    }
  }, [profileImage]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 5MB 제한
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

  // 서버가 File만 받는다면: 문자열이면 File로 변환
  const handleNext = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!isNicknameValid || !normalizedNickname.length) return;

    updateProfile('nickname', normalizedNickname);

    if (profileImage) {
      const imgToSave = isFile(profileImage)
        ? profileImage
        : await urlToFile(profileImage, 'profile-from-url.jpg');

      updateProfile('img', imgToSave);
    }

    completeStep('profile');
    router.push(PATHS.AUTH.ADDRESS);
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
            className='bg-bg-neutral absolute bottom-0 right-0 flex h-[32px] w-[32px] items-center justify-center rounded-full border-2 border-white'
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
            onChange={setNickname}
            onValidate={(isValid, error) => {
              setIsNicknameValid(isValid);
            }}
            autoFocus
            // TODO SUCCESS 및 디바운싱 db호출 구현
          />
        </div>

        <Button
          variant='default'
          type='submit'
          disabled={!nickname.trim() || !isNicknameValid}
          isFloat
        >
          다음
        </Button>
      </form>
    </>
  );
};

export default ProfileSetup;

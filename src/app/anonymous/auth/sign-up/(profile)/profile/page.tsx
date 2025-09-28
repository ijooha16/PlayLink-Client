'use client';

import { Input } from '@/components/forms/input';
import { Edit } from '@/components/shared/icons';
import Button from '@/components/ui/button';
import { PATHS } from '@/constant';
import useSignUpStore from '@/store/use-sign-up-store';
import randomProfileImage, { ProfileImg } from '@/utills/random-profile-image';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';

const ProfileSetup = () => {
  const { updateProfile } = useSignUpStore();
  const router = useRouter();

  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [randomImg, setRandomImg] = useState<ProfileImg | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isNicknameValid, setIsNicknameValid] = useState(false);

  const normalizedNickname = useMemo(() => {
    return nickname.trim();
  }, [nickname]);

  // 클라이언트에서만 랜덤 이미지 설정
  useEffect(() => {
    setRandomImg(randomProfileImage());
  }, []);

  useEffect(() => {
    if (profileImage) {
      const url = URL.createObjectURL(profileImage);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [profileImage]);


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

  const handleNext = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!isNicknameValid || !normalizedNickname.length) {
      return;
    }

    updateProfile('nickname', normalizedNickname);
    if (profileImage) {
      updateProfile('img', profileImage);
    }
    router.replace(PATHS.AUTH.ADDRESS);
  };

  return (
    <>
      <div className='flex flex-col items-center'>
        <div className='relative my-s-24'>
          <div
            className='flex h-[100px] w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-200'
            onClick={() => fileInputRef.current?.click()}
          >
            {(preview || randomImg) && (
              <Image
                src={preview || randomImg!}
                alt='profile_img'
                width={150}
                height={150}
                className='object-cover'
                priority={true}
              />
            )}
          </div>

          <button
            type='button'
            onClick={() => fileInputRef.current?.click()}
            className='absolute bottom-0 right-0 flex h-[32px] w-[32px] items-center justify-center rounded-full border-2 border-white bg-bg-netural'
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
          onValidate={(isValid) => setIsNicknameValid(isValid)}
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

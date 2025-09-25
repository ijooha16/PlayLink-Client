'use client';

import Header from '@/components/layout/header';
import { PATHS } from '@/constant/paths';
import { useGetProfileQuery, useUpdateProfile } from '@/hooks/react-query/profile/use-profile-query';
import { Auth } from '@/libs/api/auth/auth';
import { useAuthStore } from '@/store/auth-store';
import {
  Camera,
  Check,
  ChevronRight,
  Edit3,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';

export default function MyPage() {
  const token = useAuthStore((state) => state.token);
  const [isEditing, setIsEditing] = useState(false);
  const [isImageEditing, setIsImageEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile({
    onSuccess: () => {
      // 성공 시 상태 초기화
      setSelectedImage(null);
      setPreviewImage(null);
      setIsImageEditing(false);
      setIsEditing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (error) => {
      console.error('프로필 업데이트 실패:', error);
    }
  });

  const router = useRouter();
  const handleLogout = async () => {
    await Auth.Logout();
    router.push(PATHS.SPLASH);
  };

  // 미들웨어가 인증을 처리하므로 불필요한 useEffect 제거

  // 2) 토큰이 있어야 쿼리 실행
  const { data: profileData } = useGetProfileQuery();

  // 3) 데이터 있을 때만 안전하게 접근
  const profile = profileData?.data?.data; // 서버 응답 래핑 구조 유지
  const { email, name, nickname, phoneNumber, img_url } = profile ?? {};
  const [nicknameInput, setNicknameInput] = useState(nickname);

  // 이미지 선택 핸들러
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 파일 크기 검증 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      // 이미지 파일 타입 검증
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      setSelectedImage(file);

      // 미리보기 URL 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = () => {
    if (!selectedImage) {
      alert('업로드할 이미지를 선택해주세요.');
      return;
    }

    const data = new FormData();
    data.append('img', selectedImage);
    if (nicknameInput && nicknameInput.trim()) {
      data.append('nickname', nicknameInput.trim());
    }

    updateProfile(data);
  };

  // 이미지 편집 취소
  const handleImageEditCancel = () => {
    setSelectedImage(null);
    setPreviewImage(null);
    setIsImageEditing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpdateProfile = () => {
    if (!nicknameInput || nicknameInput.trim() === '') {
      alert('닉네임을 입력해주세요.');
      return;
    }

    const data = new FormData();
    data.append('nickname', nicknameInput.trim());

    updateProfile(data);
  };

  return (
    <>
      <Header title='마이페이지' />
      <div className='mt-10 flex flex-col items-center space-y-3'>
        {/* 프로필 이미지 영역 */}
        <div className='relative'>
          <div className='h-24 w-24 overflow-hidden rounded-full bg-gray-200'>
            <img
              src={previewImage || img_url}
              alt='profile'
              className='h-full w-full object-cover'
            />
          </div>

          {/* 이미지 편집 버튼 */}
          {!isImageEditing && (
            <button
              onClick={() => setIsImageEditing(true)}
              className='absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600'
            >
              <Camera size={16} />
            </button>
          )}

          {/* 이미지 편집 모드 */}
          {isImageEditing && (
            <div className='absolute -bottom-1 -right-1 flex gap-1'>
              <button
                onClick={handleImageUpload}
                disabled={!selectedImage || isUpdating}
                className='bg-green-500 hover:bg-green-600 flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-400'
              >
                {isUpdating ? (
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                ) : (
                  <Check size={16} />
                )}
              </button>
              <button
                onClick={handleImageEditCancel}
                className='bg-red-500 hover:bg-red-600 flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors'
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* 숨겨진 파일 입력 */}
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          onChange={handleImageSelect}
          className='hidden'
        />

        {/* 닉네임 편집 영역 */}
        <div className='flex items-center gap-2 text-lg font-bold'>
          {isEditing ? (
            <>
              <input
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                className='rounded border border-gray-300 px-2 py-1 text-center'
                placeholder='닉네임을 입력하세요'
              />
              <Check
                size={18}
                onClick={() => handleUpdateProfile()}
                className='text-green-500 hover:text-green-600 cursor-pointer'
              />
            </>
          ) : (
            <>
              {nickname}
              <Edit3
                size={18}
                onClick={() => setIsEditing(true)}
                className='cursor-pointer text-blue-500 hover:text-blue-600'
              />
            </>
          )}
        </div>

        {/* 이미지 선택 안내 */}
        {isImageEditing && !selectedImage && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className='text-sm text-blue-500 underline hover:text-blue-600'
          >
            이미지 선택하기
          </button>
        )}
      </div>
      <hr className='mb-4 mt-14' />
      <div
        className='flex cursor-pointer justify-between py-4 font-bold'
        onClick={handleLogout}
      >
        로그아웃 <ChevronRight />
      </div>
      {/* <div className='text-sm mt-20 text-center underline text-gray-500 underline-offset-4'>로그아웃</div> */}
    </>
  );
}

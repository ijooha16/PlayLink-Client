'use client';

import Header from '@/shares/common-components/header';
import { Check, CheckSquare, ChevronRight, Edit3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  handleRemoveSessionStorage,
  handleGetSessionStorage,
} from '@/shares/libs/utills/web-api';
import { useGetProfileQuery } from '@/hooks/react-query/profile/use-get-profile-query';
import { useUpdateProfileMutation } from '@/hooks/react-query/profile/use-update-profile-mutation';
import { set } from 'date-fns';

export default function MyPage() {
  const [token, setToken] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updatProfile } = useUpdateProfileMutation();

  const router = useRouter();
  const handleLogout = () => {
    const data = handleRemoveSessionStorage('PLAYLINK_AUTH');

    if (data.status === 'success') {
      router.push('/sign-in');
    }
  };

  useEffect(() => {
    const token = handleGetSessionStorage();
    if (!token) {
      router.push('/sign-in');
    }
  }, []);

  useEffect(() => {
    setToken(handleGetSessionStorage()); // sessionStorage 접근은 브라우저에서만
  }, []);

  // 2) 토큰이 있어야 쿼리 실행
  const { data: profileData } = useGetProfileQuery(token);

  // 3) 데이터 있을 때만 안전하게 접근
  const profile = profileData?.data?.data; // 서버 응답 래핑 구조 유지
  const { email, name, nickname, phoneNumber } = profile ?? {};

  const [nicknameInput, setNicknameInput] = useState(nickname);

  const handleUpdateProfile = () => {
    const data = new FormData();
    data.append('nickname', nicknameInput!);

    updatProfile({ token, profileData: data });
    setIsEditing(false);
  };

  return (
    <>
      <Header title='마이페이지' />
      <div className='mt-10 flex flex-col items-center space-y-3'>
        <div className='h-24 w-24 rounded-full bg-gray-200' />
        <div className='flex items-center gap-2 text-lg font-bold'>
          {isEditing ? (
            <>
              <input
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
              />
              <Check size={18} onClick={() => handleUpdateProfile()} />
            </>
          ) : (
            <>
              {nickname} <Edit3 size={18} onClick={() => setIsEditing(true)} />
            </>
          )}
        </div>
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

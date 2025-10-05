'use client';

import SportCard from '@/components/features/match/sport-card';
import Button from '@/components/ui/button';
import { PATHS } from '@/constant';
import { clearFlow, completeStep } from '@/hooks/auth/use-signup-flow';
import { useUpdateProfile } from '@/hooks/react-query/profile/use-profile-query';
import { useGetSportsQuery } from '@/hooks/react-query/sport/get-sport-query';
import { validateSports } from '@/libs/valid/auth';
import useSignUpStore from '@/store/use-sign-up-store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SportsSelectionPage() {
  const { profile, updateProfile } = useSignUpStore();
  const router = useRouter();

  const [selectedSports, setSelectedSports] = useState<number[]>(
    profile.prefer_sports ? JSON.parse(profile.prefer_sports) : []
  );
  const { data: sports } = useGetSportsQuery();

  const sportsList: { sports_name: string; sports_id: number }[] =
    sports?.data?.data?.sports ?? [];

  // 운동 토글 (최대 3개)
  const toggleSport = (id: number) => {
    setSelectedSports((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        // 선택된 항목을 클릭하면 제거
        return prev.filter((v) => v !== id);
      }
      if (prev.length < 3) {
        // 3개 미만이면 추가
        return [...prev, id];
      }
      // 3개 이상이면 첫 번째 선택된 것을 제거하고 새로운 것 추가
      const newSelection = [...prev.slice(1), id];
      return newSelection;
    });
  };

  const { mutate: updateProfileMutation } = useUpdateProfile({
    onSuccess: () => {
      completeStep('sports');
      clearFlow();
      router.replace(PATHS.HOME);
    },
  });

  const handleNext = () => {
    // 검증
    const errorMessage = validateSports(selectedSports);

    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    // Store 업데이트
    updateProfile('prefer_sports', JSON.stringify(selectedSports));

    // FormData 생성
    const formData = new FormData();
    formData.append('nickname', profile.nickname || '');
    formData.append('address', profile.address || '');
    formData.append('favor', profile.favor || '0');
    formData.append('prefer_sports', JSON.stringify(selectedSports)); // "[1, 5, 9]" 형태로

    if (profile.img) {
      formData.append('img', profile.img);
    }

    // API 호출
    updateProfileMutation(formData);
  };

  return (
    <>
      <div className='grid grid-cols-4 gap-[20px] pb-[60px]'>
        {sportsList.map((sport) => (
          <div key={sport.sports_id} className='flex justify-center'>
            <SportCard
              sport={sport.sports_id}
              sport_name={sport.sports_name}
              selected={selectedSports.includes(sport.sports_id)}
              onClick={() => toggleSport(sport.sports_id)}
            />
          </div>
        ))}
      </div>

      {/* 그라데이션 배경 */}
      <div className='pointer-events-none fixed bottom-0 left-0 right-0 z-40 h-32 bg-gradient-to-t from-white/90 via-white/60 to-transparent' />

      {/* 하단 버튼 */}
      <Button
        variant='default'
        onClick={handleNext}
        disabled={selectedSports.length === 0}
        isFloat
      >
        가입완료
      </Button>
    </>
  );
}

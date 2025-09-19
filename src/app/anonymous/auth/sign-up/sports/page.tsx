'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignUpStepStore } from '@/store/sign-up-store';
import { useGetSportsQuery } from '@/hooks/react-query/sport/get-sport-query';
import SportCard from '@/components/features/match/sport-card';
import Button from '@/components/ui/button';
import { PATHS } from '@/constant/paths';
import AuthLayoutContainer from '@/components/layout/auth-layout';

export default function SportsSelectionPage() {
  const router = useRouter();
  const { data, updateStep, validateStep } = useSignUpStepStore();
  const [selectedSports, setSelectedSports] = useState<number[]>(
    data.favoriteSports || []
  );
  const { data: sports } = useGetSportsQuery();

  const sportsList: { sports_name: string; sports_id: number }[] =
    sports?.data?.data?.sports ?? [];

  useEffect(() => {
    // 페이지 진입 시 이전 단계 검증
    if (!validateStep('sports')) {
      router.push(PATHS.AUTH.SIGN_UP + '/profile');
    }
  }, [validateStep, router]);

  // 운동 토글 (최대 3개)
  const toggleSport = (id: number) => {
    setSelectedSports((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        return prev.filter((v) => v !== id);
      }
      if (prev.length < 3) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const handleNext = () => {
    updateStep({ favoriteSports: selectedSports });
    router.push(PATHS.AUTH.SIGN_UP + '/complete');
  };

  return (
    <AuthLayoutContainer title={'좋아하는 운동을 \n 모두 선택해 주세요!'}>
      <div className='grid grid-cols-4 gap-[16px]'>
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

      {/* 하단 버튼 */}

      <Button
        variant='default'
        onClick={handleNext}
        disabled={selectedSports.length === 0}
        isFloat
      >
        다음
      </Button>
    </AuthLayoutContainer>
  );
}

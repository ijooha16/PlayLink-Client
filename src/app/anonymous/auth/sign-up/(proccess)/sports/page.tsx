'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignUpStepStore } from '@/store/sign-up-store';
import { useSignUpNavigation } from '@/hooks/use-sign-up-navigation';
import { useGetSportsQuery } from '@/hooks/react-query/sport/get-sport-query';
import SportCard from '@/components/features/match/sport-card';
import Button from '@/components/ui/button';
import { PATHS } from '@/constant/paths';
import AuthLayoutContainer from '@/components/layout/auth-layout';

export default function SportsSelectionPage() {
  const router = useRouter();
  const { data, updateStep } = useSignUpStepStore();
  const { currentStepTitle } = useSignUpNavigation({
    currentStep: 'sports',
  });
  const [selectedSports, setSelectedSports] = useState<number[]>(
    data.favoriteSports || []
  );
  const { data: sports } = useGetSportsQuery();

  const sportsList: { sports_name: string; sports_id: number }[] =
    sports?.data?.data?.sports ?? [];

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
    <AuthLayoutContainer title={currentStepTitle}>
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

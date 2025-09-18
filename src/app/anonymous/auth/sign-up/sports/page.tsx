'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignUpStepStore } from '@/stores/sign-up-store';
import { useGetSportsQuery } from '@/hooks/react-query/sport/get-sport-query';
import SportCard from '@/components/common/sport-card';
import Button from '@/components/common/button';

export default function SportsSelectionPage() {
  const router = useRouter();
  const { data, updateStep, validateStep } = useSignUpStepStore();
  const [selectedSports, setSelectedSports] = useState<number[]>(data.favoriteSports || []);
  const { data: sports } = useGetSportsQuery();

  const sportsList: { sports_name: string; sports_id: number }[] =
    sports?.data?.data?.sports ?? [];

  useEffect(() => {
    // 페이지 진입 시 이전 단계 검증
    if (!validateStep('sports')) {
      router.push('/sign-up/profile');
    }
  }, [validateStep, router]);

  // 운동 토글 (최대 3개)
  const toggleSport = (id: number) => {
    setSelectedSports(prev => {
      const exists = prev.includes(id);
      if (exists) {
        return prev.filter(v => v !== id);
      }
      if (prev.length < 3) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const handleNext = () => {
    updateStep({ favoriteSports: selectedSports });
    router.push('/sign-up/complete');
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-144px)]">
      <div className="px-[20px] pt-[24px]">
        <h1 className="text-title-1 pb-[24px]">선호하는 운동을 선택해주세요</h1>
        <p className="text-body-4 text-grey02 pb-[32px]">
          최대 3개까지 선택 가능합니다
        </p>

        <div className="mb-[24px]">
          <span className="text-body-2 text-primary">{selectedSports.length}/3</span>
          <span className="text-body-4 text-grey02"> 선택됨</span>
        </div>

        {/* 스포츠 그리드 */}
        <div className="grid grid-cols-4 gap-[16px] pb-[24px]">
          {sportsList.map((sport) => (
            <div
              key={sport.sports_id}
              className="flex justify-center"
            >
              <SportCard
                sport={sport.sports_id}
                sport_name={sport.sports_name}
                selected={selectedSports.includes(sport.sports_id)}
                onClick={() => toggleSport(sport.sports_id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="mt-auto px-[20px]">
        <Button
          variant="default"
          onClick={handleNext}
          disabled={selectedSports.length === 0}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
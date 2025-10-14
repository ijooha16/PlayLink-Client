'use client';

import SportCard from '@/components/features/match/sport-card';
import Button from '@/components/ui/button';
import { PATHS } from '@/constant';
import { useGetSportsQuery } from '@/hooks/react-query/sport/get-sport-query';
import { validateSportType } from '@/libs/valid/match';
import useCreateMatchStore from '@/store/use-create-match-store';
import { toast } from '@/utills/toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CreateMatchSports = () => {
  const router = useRouter();
  const updateSportType = useCreateMatchStore((state) => state.updateSportType);
  const sportType = useCreateMatchStore(state => state.matchData.sportType)
  const [selectedSport, setSelectedSport] = useState<number | null>(sportType);

  const { data: sports } = useGetSportsQuery();

  const sportsList: { sports_name: string; sports_id: number }[] =
    sports?.data?.data?.sports ?? [];

  const handleNext = () => {
    const error = validateSportType(selectedSport);
    if (error) {
      toast.error(error);
      return;
    }
    updateSportType(selectedSport!);
    router.replace(PATHS.MATCH.CREATE_MATCH + '/create');
  };

  return (
    <>
      <div className='grid grid-cols-4 gap-[20px] pb-[80px]'>
        {sportsList.map((sport) => (
          <div key={sport.sports_id} className='flex justify-center'>
            <SportCard
              sport={sport.sports_id}
              sport_name={sport.sports_name}
              selected={selectedSport === sport.sports_id}
              onClick={() => setSelectedSport(sport.sports_id)}
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
        disabled={selectedSport === null}
        isFloat
      >
        다음
      </Button>
    </>
  );
};

export default CreateMatchSports;

'use client';

import { X } from 'lucide-react';
import { MouseEvent, useState } from 'react';
import { useGetSportsQuery } from '@/hooks/react-query/sport/get-sport-query';
import {
  extractSportsFromResponse,
  getSportName,
} from '@/libs/helpers/sport';
import SportCard from '../features/match/sport-card';

interface SelectExerciseModalProps {
  onChange: (sport: number | null) => void;
  selectedSport: number | null;
}

const SelectExerciseModal = ({
  onChange,
  selectedSport,
}: SelectExerciseModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: sports } = useGetSportsQuery();

  const handleInputClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChange = (sport: number) => {
    onChange(sport);
    setIsOpen(false);
  };

  const sportsList = extractSportsFromResponse(sports);
  const sportsName = getSportName(sportsList, selectedSport ?? undefined);

  return (
    <div>
      <input
        className='w-full rounded-[10px] border border-[#d1d5db] bg-white px-4 py-2 text-base outline-none'
        value={sportsName!}
        onClick={handleInputClick}
        readOnly
        placeholder='스포츠 선택하기'
      />
      {isOpen && (
        <div
          onClick={handleClose}
          className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50'
        >
          <div
            className='flex h-[80%] w-[90%] select-none flex-col rounded-[10px] bg-white'
            onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            <div className='flex h-10 w-full shrink-0 items-center justify-between border-b border-gray-300 pl-4 pr-2'>
              <h4>종목 선택</h4>
              <X onClick={handleClose} />
            </div>
            <div className='grid flex-1 grid-cols-4 gap-3 overflow-auto p-2'>
              {sportsList.map(
                (sport: { sports_id: number; sports_name: string }) => (
                  <div
                    key={sport.sports_id}
                    onClick={() => handleChange(sport.sports_id)}
                  >
                    <SportCard
                      sport={sport.sports_id}
                      sport_name={sport.sports_name}
                      selected={selectedSport === sport.sports_id}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectExerciseModal;

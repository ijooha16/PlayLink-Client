'use client';

import { X } from 'lucide-react';
import { MouseEvent, useState } from 'react';
import { useGetSportsQuery } from '@/hooks/sport/get-sport-query';

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

  const sportsList = sports?.data?.data?.sports;
  const sportsName =
    sportsList &&
    sportsList.find(
      (sport: { sports_id: number; sports_name: string }) =>
        sport.sports_id === selectedSport
    )?.sports_name;

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
          className='fixed bottom-0 left-0 right-0 top-0 z-50 flex flex-col items-center justify-center bg-black/50'
        >
          <div
            className='w-4/5 select-none rounded-[10px] bg-white'
            onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            <div className='flex h-10 w-full items-center justify-between pl-4 pr-2'>
              <h4>종목 선택</h4>
              <X onClick={handleClose} />
            </div>
            <div className='mx-2 border-t border-gray-300 p-2'>
              {sportsList.map(
                (sport: { sports_id: number; sports_name: string }) => (
                  <div
                    key={sport.sports_id}
                    onClick={() => handleChange(sport.sports_id)}
                  >
                    {sport.sports_name}
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

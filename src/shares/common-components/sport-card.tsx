import Image from 'next/image';
import React from 'react';

const SportCard = ({
  sport,
  sport_name,
  selected,
  onClick,
}: {
  sport: number;
  sport_name: string;
  selected?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div className='flex flex-col items-center gap-1' onClick={onClick}>
      <div
        className={`border-2 ${selected ? 'border-primary' : 'border-gray-200'} flex h-[54px] w-[54px] flex-col items-center justify-center rounded-full`}
      >
        <Image
          width={32}
          height={32}
          src={`/images/sport-icons/sport=${sport}.png`}
          alt={`sport-${sport}`}
        />
      </div>
      <div className='text-center text-xs'>{sport_name}</div>
    </div>
  );
};

export default SportCard;

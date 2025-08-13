import { Star } from 'lucide-react';
import React from 'react';

const SportCard = ({ sport }: { sport: string }) => {
  return (
    <div className='flex flex-col items-center gap-1'>
      <div className='flex h-12 w-12 flex-col items-center justify-center rounded-full bg-sub01'>
        <Star />
      </div>
      <div className='text-sm'>{sport}</div>
    </div>
  );
};

export default SportCard;

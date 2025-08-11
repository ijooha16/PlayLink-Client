'use client';

import { useTempStore } from '@/shares/stores/temp-store';
import { HeartIcon, MessagesSquareIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const MatchCards = () => {
  const tempCard = useTempStore((state) => state.matchCards);
  return tempCard.map((item, idx) => {
    return (
      <Link key={item.제목 + idx} href={`/match/${idx}`}>
        <div className='my-2 flex border'>
          <div className='aspect-square h-[128px] min-h-[128px] w-[128px] min-w-[128px] overflow-hidden p-2'>
            <img
              src={item.이미지}
              alt={item.제목}
              className='h-full w-full rounded-xl object-cover'
            />
          </div>
          <div className='relative flex w-full flex-col justify-evenly truncate p-2'>
            <div className='flex gap-2'>
              <span className='break-keep font-bold text-blue-500'>
                {item.운동종류}
              </span>
              <span className='truncate font-semibold'>{item.제목}</span>
            </div>
            <div className='flex gap-2 text-sm text-gray-400'>
              <span>{item.위치}</span> | <span>{item.시간}</span>
            </div>
            <div className='flex justify-between'>
              <span className='font-semibold'>{item.장소}</span>
              <div className='flex gap-2 text-xs text-gray-400'>
                <div className='flex items-center'>
                  <HeartIcon size={12} />
                  {item.좋아요수}
                </div>
                <div className='flex items-center'>
                  <MessagesSquareIcon size={12} />
                  {item.댓글수}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  });
};

export default MatchCards;

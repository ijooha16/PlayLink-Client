'use client';

import { HeartIcon, MessagesSquareIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { MatchType } from '../../types/match/match';
import { useGetSportsQuery } from '@/hooks/sport/get-sport-query';

const MatchCards = (data: { data: MatchType }) => {
  const { data: sports } = useGetSportsQuery();
  const {
    matchId,
    title,
    sportsType,
    createdAt,
    likeCount,
    start_time,
    end_time,
    date,
  } = data.data;

  const sportsList = sports?.data?.data?.sports;
  const sportsName =
    sportsList &&
    sportsList.find(
      (sport: { sports_id: number; sports_name: string }) =>
        sport.sports_id === sportsType
    )?.sports_name;

  return (
    <Link key={title + matchId} href={`/match/${matchId}`}>
      <div className='my-2 flex border'>
        <div className='aspect-square h-[128px] min-h-[128px] w-[128px] min-w-[128px] overflow-hidden p-2'>
          {/* <img
              src={}
              alt={}
              className='h-full w-full rounded-xl object-cover'
            /> */}
        </div>
        <div className='relative flex w-full flex-col justify-evenly truncate p-2'>
          <div className='flex gap-2'>
            <span className='break-keep font-bold text-blue-500'>
              {sportsName}
            </span>
            <span className='truncate font-semibold'>{title}</span>
          </div>
          <div className='flex gap-2 text-sm text-gray-400'>
            <span>{date}</span> | <span>{start_time}</span>
          </div>
          {/* <div className='flex justify-between'>
            <span className='font-semibold'>{장소}</span>
            <div className='flex gap-2 text-xs text-gray-400'>
              <div className='flex items-center'>
                <HeartIcon size={12} />
                {likeCount}
              </div>
              <div className='flex items-center'>
                <MessagesSquareIcon size={12} />
                {댓글수}
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </Link>
  );
};

export default MatchCards;

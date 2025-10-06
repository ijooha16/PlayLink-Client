'use client';

// import { HeartIcon, MessagesSquareIcon } from 'lucide-react';
import { PATHS } from '@/constant';
import { useGetSportsQuery } from '@/hooks/react-query/sport/get-sport-query';
import {
  extractSportsFromResponse,
  getSportName,
} from '@/libs/helpers/sport';
import { MatchType } from '@/types/match/match';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const MatchCards = (data: { data: MatchType }) => {
  const router = useRouter();
  const { data: sports } = useGetSportsQuery();
  const [imageError, setImageError] = useState(false);

  const {
    matchId,
    title,
    sportsType,
    // createdAt,
    // likeCount,
    // end_time,
    start_time,
    placeAddress,
    date,
  } = data.data;

  const sportsList = extractSportsFromResponse(sports);
  const sportsName = getSportName(sportsList, sportsType);

  const handleMatchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(PATHS.MATCH.MATCH_DETAIL_ID(matchId.toString()));
  };

  return (
    <div
      key={title + matchId}
      onClick={handleMatchClick}
      className='cursor-pointer'
    >
      <div className='my-2 flex rounded-xl border'>
        <div className='flex aspect-square h-[128px] min-h-[128px] w-[128px] min-w-[128px] items-center justify-center overflow-hidden p-2'>
          {imageError ? (
            <div className='flex h-full w-full items-center justify-center rounded bg-gray-100 text-gray-400'>
              <div className='text-center'>
                <div className='text-xs'>{sportsName || '스포츠'}</div>
              </div>
            </div>
          ) : (
            <Image
              src={`/images/sport-images/${sportsType}.png`}
              alt={`${sportsName || '스포츠'} 이미지`}
              width={150}
              height={150}
              className='rounded object-contain'
              sizes='150px'
              onError={() => {
                setImageError(true);
              }}
            />
          )}
        </div>
        <div className='relative flex w-full flex-col justify-evenly truncate p-2'>
          <div className='flex gap-2'>
            <span className='break-keep font-bold text-blue-500'>
              {sportsName}
            </span>
            {/* text-heading-04 */}
            <span className='truncate font-semibold'>{title}</span>
          </div>
          <div className='flex gap-2 text-sm text-gray-400'>
            <span>{date}</span> | <span>{start_time}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm font-semibold'>{placeAddress}</span>
            {/* <div className='flex gap-2 text-xs text-gray-400'>
              <div className='flex items-center'>
                <HeartIcon size={12} />
                {likeCount}
              </div>
              <div className='flex items-center'>
                <MessagesSquareIcon size={12} />
                {2}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCards;

'use client';

// import { HeartIcon, MessagesSquareIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { MatchType } from '@/types/match/match';
import { useGetSportsQuery } from '@/hooks/react-query/sport/get-sport-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { handleGetSessionStorage } from '@/utills/web-api';

const MatchCards = (data: { data: MatchType }) => {
  const router = useRouter();
  const { data: sports } = useGetSportsQuery();
  const [imageError, setImageError] = useState(false);

  const handleMatchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const token = handleGetSessionStorage();

    if (!token) {
      // 인증되지 않은 경우 로그인 페이지로 이동
      router.push('/splash');
    } else {
      // 인증된 경우 매치 상세 페이지로 이동
      router.push(`/match/${matchId}`);
    }
  };
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

  const sportsList = sports?.data?.data?.sports;
  const sportsName =
    sportsList &&
    sportsList.find(
      (sport: { sports_id: number; sports_name: string }) =>
        sport.sports_id === sportsType
    )?.sports_name;

  return (
    <div key={title + matchId} onClick={handleMatchClick} className='cursor-pointer'>
      <div className='my-2 flex border rounded-xl'>
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
              objectFit='fit'
              width={150}
              height={150}
              style={{borderRadius:'4px'}}
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
            <span className='truncate
              font-semibold'>{title}</span>
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

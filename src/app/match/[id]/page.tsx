'use client';

import Link from 'next/link';
import DynamicNaverMapForDetail from '@/shares/common-components/dynamic-naver-map-for-detail';
import { Heart, MapPin, Share2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useGetMatchesQuery } from '@/hooks/match/use-get-match-detail-query';
import { useGetSportsQuery } from '@/hooks/sport/get-sport-query';

export default function MatchDetailPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetMatchesQuery({ matchId: id });
  const { data: sports } = useGetSportsQuery();
  const {
    title,
    start_time,
    sports_type,
    user_nickname,
    // end_time,
    // date,
    // createdAt,
    // likeCount,
    placeAddress,
  } = data?.data?.data || {};

  // console.log(room_id, end_time, date, createdAt, likeCount);

  const sportTypes = (sports && sports?.data?.data?.sports) || [];
  const sportTypeForThisMatch = sportTypes.filter(
    (sport: { sports_id: number }) => sport.sports_id === sports_type
  );

  if (!data) {
    return <div>매치 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className='flex flex-col'>
      <div className='absolute left-0 top-16 z-40 h-[40dvh] w-full'>
        <img
          src={`/images/sport-images/${sports_type}.png`}
          alt={title}
          className='h-full w-full object-cover'
        />
      </div>

      <div className='mt-[40dvh] flex h-24 items-center justify-between rounded-lg'>
        <div className='flex items-center gap-4'>
          <div className='h-14 w-14 rounded-full bg-gray-300'>
            {/* 프로필 이미지 */}
          </div>
          <div className='flex flex-col'>
            <span className='text-lg font-bold'>{user_nickname}</span>
            <span className='text-sm text-gray-500'>내 동네</span>
          </div>
        </div>
      </div>

      <div className='h-px border-t border-gray-300' />

      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <span className='pt-4 font-bold text-blue-500'>
            {sportTypeForThisMatch[0].sports_name}
          </span>
          <h1 className='text-2xl font-bold'>{title}</h1>
        </div>

        <div className='flex items-center gap-4 text-gray-500'>
          <div className='flex items-center gap-1'>
            <MapPin size={16} />
            <span>{placeAddress}</span>
          </div>
          <span>|</span>
          <span>{start_time}</span>
        </div>

        <div className='mt-4'>
          <h2 className='text-xl font-bold'>소개</h2>
          <p className='mt-2 text-gray-700'>
            여기에 매치에 대한 상세 설명이 들어갑니다. 함께 즐겁게 운동할 분들을
            모집합니다!
          </p>
        </div>

        <div className='mt-4'>
          <h2 className='text-xl font-bold'>장소 정보</h2>
          <div className='text-lg font-semibold'>{placeAddress}</div>
          <div className='mt-2'>
            <DynamicNaverMapForDetail />
          </div>
        </div>

        <div className='mt-4'>
          <h2 className='text-xl font-bold'>참가자 (1/5)</h2>
          <div className='mt-2 flex gap-2'>
            <div className='flex items-center gap-2'>
              <div className='h-8 w-8 rounded-full bg-gray-300' />
              <span>참가자1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className='h-20' />
      <div className='fixed bottom-0 left-0 flex h-20 w-full items-center justify-between border-t bg-white p-4'>
        <div className='flex items-center gap-4'>
          <Heart />
          <Share2 />
        </div>

        {id !== '5' ? (
          <Link href={`/apply/${id}`}>
            <button className='rounded-lg bg-blue-500 px-6 py-3 font-bold text-white'>
              참가하기
            </button>
          </Link>
        ) : (
          <Link href={`/apply/${id}`}>
            <button className='rounded-lg bg-blue-500 px-6 py-3 font-bold text-white'>
              매치 관리하기
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

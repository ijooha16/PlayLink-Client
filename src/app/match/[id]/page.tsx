'use client';

import Link from 'next/link';
import { Heart, MapPin, Share2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { handleGetSessionStorage } from '@/utills/web-api';
import { useGetMatchesQuery } from '@/hooks/react-query/match/use-get-match-detail-query';
import { useGetSportsQuery } from '@/hooks/react-query/sport/get-sport-query';
import Image from 'next/image';
import DynamicNaverMapForDetail from '@/components/common-components/dynamic-naver-map-for-detail';

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const token = handleGetSessionStorage();

    if (!token) {
      // 인증되지 않은 경우 로그인 페이지로 이동
      router.push('/sign-in');
    } else {
      // 인증된 경우 신청 페이지로 이동
      router.push(`/apply/${id}`);
    }
  };
  const { data } = useGetMatchesQuery({ matchId: id });
  const { data: sports } = useGetSportsQuery();
  const {
    title,
    start_time,
    sports_type,
    user_nickname,
    end_time,
    date,
    image_url,
    // createdAt,
    // likeCount,
    max_size,
    member_count,
    placeAddress,
    comment,
  } = data?.data?.data || {};

  const sportTypes = (sports && sports?.data?.data?.sports) || [];
  const sportTypeForThisMatch = sportTypes.filter(
    (sport: { sports_id: number }) => sport.sports_id === sports_type
  );

  if (!data) {
    return <div>매치 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className='flex flex-col'>
      <div className='absolute left-1/2 top-16 z-40 mx-auto h-[40dvh] w-full max-w-[640px] -translate-x-1/2'>
        <img
          src={`/images/sport-images/${sports_type}.png`}
          alt={title}
          className='h-full w-full object-cover'
        />
      </div>

      <div className='mt-[40dvh] flex h-24 items-center justify-between rounded-lg'>
        <div className='flex items-center gap-4'>
          <div className='h-14 w-14 overflow-hidden rounded-full border border-gray-200 bg-gray-300'>
            <img
              src={image_url}
              alt='profile'
              className='h-full w-full object-cover object-center'
            />
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
            {sportTypeForThisMatch[0]?.sports_name}
          </span>
          <h1 className='text-2xl font-bold'>{title}</h1>
        </div>

        <div className='flex items-center gap-4 text-gray-500'>
          <div className='flex items-center gap-1'>
            <MapPin size={16} />
            <span>{placeAddress}</span>
          </div>
          <span>|</span>
          <span>{date}</span>
          <span>|</span>
          <span>
            {start_time} ~ {end_time}
          </span>
        </div>

        <div className='mt-4'>
          <h2 className='text-xl font-bold'>소개</h2>
          <p className='mt-2 text-gray-700'>
            {comment || '소개글이 없습니다.'}
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
          <h2 className='text-xl font-bold'>
            참가자 ({member_count}/{max_size})
          </h2>
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
      <div className='fixed bottom-0 left-1/2 flex h-20 w-full max-w-[640px] -translate-x-1/2 items-center justify-between border-t bg-white p-4'>
        <div className='flex items-center gap-4'>
          <Heart />
          <Share2 />
        </div>

        {id !== '5' ? (
          <button
            onClick={handleApplyClick}
            className='rounded-lg bg-blue-500 px-6 py-3 font-bold text-white'
          >
            참가하기
          </button>
        ) : (
          <button
            onClick={handleApplyClick}
            className='rounded-lg bg-blue-500 px-6 py-3 font-bold text-white'
          >
            매치 관리하기
          </button>
        )}
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import DynamicNaverMapForDetail from '@/shares/common-components/dynamic-naver-map-for-detail';
import { Heart, MapPin, Share2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useTempStore } from '@/shares/stores/temp-store';

export default function MatchDetailPage() {
  const params = useParams();
  const { id } = params;
  const tempDate = useTempStore((state) => state.matchCards);
  const cardData = tempDate[Number(id)];

  if (!cardData) {
    return <div>매치 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className='relative flex flex-col'>
      <div className='relative h-[40dvh] w-full'>
        <img
          src={cardData.이미지}
          alt={cardData.제목}
          className='h-full w-full object-cover'
        />
      </div>

      <div className='flex h-24 items-center justify-between rounded-lg p-4'>
        <div className='flex items-center gap-4 p-4'>
          <div className='h-14 w-14 rounded-full bg-gray-300'>
            {/* 프로필 이미지 */}
          </div>
          <div className='flex flex-col'>
            <span className='text-lg font-bold'>주최자 이름</span>
            <span className='text-sm text-gray-500'>내 동네</span>
          </div>
        </div>
      </div>

      <div className='mx-6 h-px border-t border-gray-300' />

      <div className='flex flex-col gap-4 px-8 py-4'>
        <div className='flex flex-col gap-2'>
          <span className='font-bold text-blue-500'>{cardData.운동종류}</span>
          <h1 className='text-2xl font-bold'>{cardData.제목}</h1>
        </div>

        <div className='flex items-center gap-4 text-gray-500'>
          <div className='flex items-center gap-1'>
            <MapPin size={16} />
            <span>{cardData.위치}</span>
          </div>
          <span>|</span>
          <span>{cardData.시간}</span>
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
          <div className='text-lg font-semibold'>{cardData.장소}</div>
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

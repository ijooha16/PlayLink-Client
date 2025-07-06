'use client';

import { tempCard } from '@/shares/dummy-data/dummy-data';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { useAlertStore } from '@/shares/stores/alert-store';

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const matchData = tempCard[Number(id)];
  const alertOpen = useAlertStore((state) => state.openAlert);

  if (!matchData) {
    return <div>매치 정보를 찾을 수 없습니다.</div>;
  }

  const handleApply = () => {
    alertOpen(
      '매칭 신청이 완료되었어요!',
      '매치장이 승인하면 매칭 알람으로 알려드릴게요'
    );
    router.replace(`/match/${id}`); // 신청 후 상세 페이지로 돌아가기
  };

  return (
    <div className='flex min-h-screen flex-col bg-gray-50'>
      {/* Header */}
      <div className='relative flex items-center justify-center bg-white p-4 shadow-sm'>
        <button onClick={() => router.back()} className='absolute left-4'>
          <ChevronLeft size={24} />
        </button>
        <h1 className='text-xl font-bold'>매치 참가 신청</h1>
      </div>

      {/* Match Info Section */}
      <div className='mb-4 rounded-b-lg bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-2xl font-bold'>신청 매치 정보</h2>
        <div className='mb-4 flex items-center gap-4'>
          <div className='relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg'>
            <Image
              src={matchData.이미지}
              alt={matchData.제목}
              layout='fill'
              objectFit='cover'
            />
          </div>
          <div className='flex flex-col'>
            <span className='text-sm font-semibold text-blue-600'>
              {matchData.운동종류}
            </span>
            <h3 className='text-xl font-bold'>{matchData.제목}</h3>
            <p className='text-sm text-gray-600'>
              {matchData.위치} | {matchData.시간}
            </p>
            <p className='font-medium text-gray-700'>{matchData.장소}</p>
          </div>
        </div>
      </div>

      {/* Application Form Section */}
      <div className='mx-4 mb-4 flex-grow space-y-6 rounded-lg bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-2xl font-bold'>신청 상세 정보</h2>
        <div>
          <p className='font-bold'>신청자</p>
          <span className='mt-6 font-semibold text-blue-500'>내 이름</span>
        </div>
        <div>
          <p className='font-bold'>종목</p>
          <span className='mt-6 font-semibold text-blue-500'>
            {matchData.운동종류}
          </span>
        </div>
        <div>
          <p className='font-bold'>날짜</p>
          <span className='mt-6 font-semibold text-blue-500'>
            {matchData.시간}
          </span>
        </div>
        <div>
          <p className='font-bold'>장소</p>
          <span className='mt-6 font-semibold text-blue-500'>
            {matchData.장소}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <div className='border-t border-gray-200 bg-white p-4'>
        <button
          onClick={handleApply}
          className='w-full rounded-lg bg-blue-500 py-3 text-lg font-bold text-white'
        >
          참가 신청하기
        </button>
      </div>
    </div>
  );
}

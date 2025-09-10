'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAlertStore } from '@/shares/stores/alert-store';
import { handleGetSessionStorage } from '@/shares/libs/utills/web-api';
import { useApplyMatchMutation } from '@/hooks/react-query/match/use-apply-match-mutation';
import Header from '@/shares/common-components/header';

import { useGetSportsQuery } from '@/hooks/react-query/sport/get-sport-query';
import { useGetMatchesQuery } from '@/hooks/react-query/match/use-get-match-detail-query';

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const alertOpen = useAlertStore((state) => state.openAlert);
  const token = handleGetSessionStorage();
  const { mutate: applyMatch } = useApplyMatchMutation();
  const { data } = useGetMatchesQuery({ matchId: id });
  const { data: sports } = useGetSportsQuery();
  const {
    title,
    start_time,
    sports_type,
    // user_nickname,
    // end_time,
    // date,
    // createdAt,
    // likeCount,
    placeAddress,
    match_id,
  } = data?.data?.data || {};

  const sportTypes = (sports && sports?.data?.data?.sports) || [];
  const sportTypeForThisMatch = sportTypes.filter(
    (sport: { sports_id: number }) => sport.sports_id === sports_type
  );

  if (!data) {
    return <div>매치 정보를 찾을 수 없습니다.</div>;
  }

  const handleApply = () => {
    alertOpen(
      '매칭 신청이 완료되었어요!',
      '매치장이 승인하면 매칭 알람으로 알려드릴게요'
    );
    applyMatch({ token, join_message: '신청해요~', matchId: match_id });
    router.replace('/'); // 신청 후 상세 페이지로 돌아가기
  };

  return (
    <div className='flex min-h-screen flex-col bg-gray-50'>
      <Header backbtn title='매치 참가 신청' />

      {/* Match Info Section */}
      <div className='mb-4 rounded-b-lg bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-2xl font-bold'>신청 매치 정보</h2>
        <div className='mb-4 flex items-center gap-4'>
          <div className='relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg'>
            <img
              src={`/images/sport-images/${sports_type}.png`}
              alt={title}
              className='h-full w-full object-cover'
            />
          </div>
          <div className='flex flex-col'>
            <span className='text-sm font-semibold text-blue-600'>
              {sportTypeForThisMatch[0]?.sports_name}
            </span>
            <h3 className='text-xl font-bold'>{title}</h3>
            <p className='text-sm text-gray-600'>
              {placeAddress} | {start_time}
            </p>
            <p className='font-medium text-gray-700'>{placeAddress}</p>
          </div>
        </div>
      </div>

      {/* Application Form Section */}
      <div className='mb-4 flex-grow space-y-6 rounded-lg bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-2xl font-bold'>신청 상세 정보</h2>
        <div>
          <p className='font-bold'>신청자</p>
          <span className='mt-6 font-semibold text-blue-500'>내 이름</span>
        </div>
        <div>
          <p className='font-bold'>종목</p>
          <span className='mt-6 font-semibold text-blue-500'>
            {sportTypeForThisMatch[0]?.sports_name}
          </span>
        </div>
        <div>
          <p className='font-bold'>날짜</p>
          <span className='mt-6 font-semibold text-blue-500'>{start_time}</span>
        </div>
        <div>
          <p className='font-bold'>장소</p>
          <span className='mt-6 font-semibold text-blue-500'>
            {placeAddress}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <div className='border-t border-gray-200 bg-white p-4'>
        <button
          onClick={handleApply}
          className='fixed bottom-0 left-0 mx-4 my-4 h-12 w-[calc(100%-2rem)] rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white shadow-md transition-colors ease-in-out focus:bg-blue-700 disabled:bg-[#E7E9EC] disabled:text-[#BDC0C6]'
        >
          참가 신청하기
        </button>
      </div>
    </div>
  );
}

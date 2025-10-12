'use client';

import DynamicNaverMapForDetail from '@/components/maps/dynamic-naver-map-for-detail';
import { PATHS } from '@/constant';
import { useGetMatchesQuery } from '@/hooks/react-query/match/use-get-match-detail-query';
import { useGetSportsQuery } from '@/hooks/react-query/sport/get-sport-query';
import { extractSportsFromResponse, getSportName } from '@/libs/helpers/sport';
import { Heart, MapPin, Share2 } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function MatchDetailPage() {
  const [imgError, setImgError] = useState<{ [key: string]: boolean }>({});
  const { id } = useParams();
  const router = useRouter();
  const { data } = useGetMatchesQuery({ matchId: id as string });
  const { data: sports } = useGetSportsQuery();

  const matchData = data?.data;
  const sportsList = extractSportsFromResponse(sports);
  const sportsType = matchData?.sports_type ?? 0;
  const sportName = getSportName(sportsList, sportsType);

  if (!id || !matchData) return <div>매치를 찾을 수 없습니다.</div>;

  const { title, start_time, user_nickname, end_time, date, image_url, match_imgUrl, user_imgUrl, content, likeCount, least_size, max_size, member_count, placeAddress, placeLocation } = matchData;
  const [lat, lng] = placeLocation?.split(',').map(parseFloat) || [undefined, undefined];
  const matchImg = image_url || match_imgUrl;
  const hostImg = user_imgUrl || matchImg;

  return (
    <div className='flex flex-col'>
      <div className='absolute left-1/2 top-14 z-40 mx-auto h-[40dvh] w-full max-w-[640px] -translate-x-1/2'>
        {matchImg && !imgError.hero ? (
          <Image src={matchImg} alt={title || '매치'} fill className='rounded-lg object-cover' onError={() => setImgError(e => ({ ...e, hero: true }))} priority />
        ) : !imgError.sport ? (
          <Image src={`/images/sport-images/${sportsType}.png`} alt={sportName} fill className='rounded-lg object-cover' onError={() => setImgError(e => ({ ...e, sport: true }))} priority />
        ) : (
          <div className='flex h-full w-full items-center justify-center rounded-lg bg-gray-100'>{sportName}</div>
        )}
      </div>

      <div className='mt-[38dvh] flex h-24 items-center justify-between rounded-lg'>
        <div className='flex items-center gap-4'>
          <div className='h-14 w-14 overflow-hidden rounded-full border border-gray-200 bg-gray-300'>
            {hostImg && !imgError.host ? (
              <Image src={hostImg} alt={user_nickname} width={56} height={56} className='h-full w-full object-cover' onError={() => setImgError(e => ({ ...e, host: true }))} />
            ) : (
              <div className='flex h-full w-full items-center justify-center bg-gray-100 text-xs'>{sportName}</div>
            )}
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
          <span className='pt-4 font-bold text-blue-500'>{sportName}</span>
          <h1 className='text-2xl font-bold'>{title}</h1>
        </div>
        <div className='flex items-center gap-4 text-gray-500'>
          <MapPin size={16} />
          <span>{placeAddress}</span>
          <span>|</span>
          <span>{date}</span>
          <span>|</span>
          <span>{start_time} ~ {end_time}</span>
        </div>
        <div className='mt-4'>
          <h2 className='text-xl font-bold'>소개</h2>
          <p className='mt-2 text-gray-700'>{content || '소개글이 없습니다.'}</p>
        </div>
        <div className='mt-4'>
          <h2 className='text-xl font-bold'>장소 정보</h2>
          <div className='text-lg font-semibold'>{placeAddress}</div>
          <div className='mt-2'><DynamicNaverMapForDetail lat={lat} lng={lng} /></div>
        </div>
        <div className='mt-4'>
          <h2 className='text-xl font-bold'>참가자 ({member_count}/{max_size})</h2>
          <p className='mt-1 text-sm text-gray-500'>최소 인원: {least_size}명</p>
          <div className='mt-2 flex gap-2'>
            <div className='flex items-center gap-2'>
              <div className='h-8 w-8 rounded-full bg-gray-300' />
              <span>참가자1</span>
            </div>
          </div>
        </div>
      </div>
      <div className='h-20' />
      <div className='fixed bottom-0 left-1/2 flex h-20 w-full max-w-[640px] -translate-x-1/2 items-center justify-between border-t bg-white p-4'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-1'>
            <Heart />
            <span className='text-sm text-gray-600'>{likeCount || 0}</span>
          </div>
          <Share2 />
        </div>

        <button onClick={() => router.push(PATHS.MATCH.APPLY_MATCH_ID(id as string))} className='rounded-lg bg-blue-500 px-6 py-3 font-bold text-white'>
          {id === '5' ? '매치 관리하기' : '참가하기'}
        </button>
      </div>
    </div>
  );
}

'use client';

import { Location, Search, SearchNone } from '@/components/shared/icons';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useKakaoSdk } from '@/hooks/map/use-kakao-sdk';
import useSignUpStore from '@/store/use-sign-up-store';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const APP_KEY = process.env.NEXT_PUBLIC_KAKAO_APP_KEY!;

type SearchItem = {
  full: string;
  si: string;
  gu: string;
  dong: string;
};

const Address = () => {
  const sdkReady = useKakaoSdk(APP_KEY);
  const geocoderRef = useRef<any>(null);
  const { profile, updateProfile } = useSignUpStore();
  const router = useRouter();

  const [address, setAddress] = useState(profile.address || '');
  const [error, setError] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sdkReady) return;
    geocoderRef.current = new window.kakao.maps.services.Geocoder();
  }, [sdkReady]);

  const handleUseCurrentLocation = () => {
    if (!sdkReady || !geocoderRef.current) return;
    if (!navigator.geolocation) {
      setError('브라우저에서 위치 권한을 허용해주세요.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        geocoderRef.current.coord2RegionCode(
          longitude,
          latitude,
          (res: any[], status: string) => {
            if (status !== window.kakao.maps.services.Status.OK) {
              setError('주소를 불러오지 못했어요.');
              return;
            }
            const h = res.find((r) => r.region_type === 'H');
            if (!h) {
              setError('행정동 정보를 찾지 못했어요.');
              return;
            }

            const si = h.region_1depth_name; // 서울특별시
            const gu = h.region_2depth_name; // 서초구
            const dong = h.region_3depth_name; // 서초동

            // “동까지” 저장
            const full = `${si} ${gu} ${dong}`;
            setAddress(full); // 입력창엔 동만
            setResults([]); // 리스트 비움
            setError('');

            updateProfile('address', full);
          }
        );
      },
      () => setError('현재 위치를 가져오지 못했어요.')
    );
  };

  const debouncedQuery = useDebounce(address, 300);
  useEffect(() => {
    if (!sdkReady || !geocoderRef.current) return;
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    geocoderRef.current.addressSearch(
      debouncedQuery,
      (res: any[], status: string) => {
        setLoading(false);
        if (status !== window.kakao.maps.services.Status.OK) {
          setResults([]);
          return;
        }
        const items: SearchItem[] = res
          .map((r) => r.address || r.road_address)
          .filter(Boolean)
          .map((a: any) => {
            const si = a.region_1depth_name;
            const gu = a.region_2depth_name;
            const dong = a.region_3depth_name;
            const full = a.address_name;
            return { full, si, gu, dong };
          })
          .filter((x) => !!x.dong);

        setResults(items);
      }
    );
  }, [debouncedQuery, sdkReady]);

  // 결과에서 항목 클릭 → 동만 선택
  const handlePick = (item: SearchItem) => {
    setAddress(item.dong);
    setResults([]);
    setError('');
    updateProfile('address', item.dong);
  };

  const handleNext = () => {
    if (!address.trim()) {
      setError('주소를 입력해주세요.');
      return;
    }

    updateProfile('address', address.trim());
    router.push('/anonymous/auth/sign-up/interest');
  };

  return (
    <>
      <div className='gap-s-10 flex flex-col'>
        <Input
          variant='gray'
          sizes='lg'
          placeholder='동/읍/면 검색 (EX.서초동)'
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            setError('');
          }}
          hasError={!!error}
          errorMessage={error}
          leftElement={<Search size={20} className='text-icon-netural' />}
          showCancelToggle={!!address}
        />
        <div
          onClick={handleUseCurrentLocation}
          className='flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-s-4 px-s-12 py-s-16'
        >
          <Location size={16} />
          <span className='label-m font-regular text-brand-primary'>
            현재 위치로 설정 하기
          </span>
        </div>
      </div>
      <div className='h-[8px] bg-bg-normal'></div>
      {/* 검색 결과 */}
      {results.length === 0 && (
        <div className='mt-s-40 flex flex-col items-center gap-s-16'>
          <SearchNone size={120} />
          <span className='text-center text-body-01 font-semibold text-text-strong'>
            검색 결과가 없어요 <br />
            다시 입력해 주세요
          </span>
        </div>
      )}

      {results.length > 0 && (
        <div className='mt-s-20'>
          {results.map((item, idx) => (
            <div
              key={`${item.full}-${idx}`}
              onClick={() => handlePick(item)}
              className='hover:bg-bg-weak mx-s-20 flex min-h-[48px] w-full cursor-pointer gap-s-4 border-b border-line-normal px-s-12 py-s-16'
            >
              <span className='font-regular text-body-01 text-text-strong'>
                {item.si} {item.gu} <strong>{item.dong}</strong>
              </span>
            </div>
          ))}
        </div>
      )}

      <Button
        variant='default'
        disabled={!address.trim()}
        onClick={handleNext}
        isFloat
      >
        다음
      </Button>
    </>
  );
};

export default Address;

function useDebounce<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

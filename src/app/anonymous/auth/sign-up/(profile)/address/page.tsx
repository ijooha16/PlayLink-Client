'use client';

import { Input } from '@/components/forms/input';
import Button from '@/components/ui/button';
import { PATHS } from '@/constant';
import { completeStep } from '@/hooks/auth/use-signup-flow';
import useDebounce from '@/hooks/common/use-debounce';
import { useKakaoSdk } from '@/hooks/map/use-kakao-sdk';
import { requestPermissions } from '@/libs/permissions/permission';
import useSignUpStore from '@/store/use-sign-up-store';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const APP_KEY = process.env.NEXT_PUBLIC_KAKAO_APP_KEY!;

type SearchItem = {
  full: string;
  si: string;
  gu: string;
  dong: string;
  ri?: string;
};

type KakaoAddress = {
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  region_4depth_name?: string;
};

type KakaoSearchResult = {
  address?: KakaoAddress;
  road_address?: KakaoAddress;
};

type KakaoStatus = 'OK' | 'ZERO_RESULT' | 'ERROR';

type KakaoRegionResult = {
  region_type: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
};

type KakaoGeocoder = {
  addressSearch: (
    query: string,
    callback: (data: KakaoSearchResult[], status: KakaoStatus) => void,
    options?: {
      analyze_type?: string;
      page?: number;
      size?: number;
    }
  ) => void;
  coord2RegionCode: (
    lng: number,
    lat: number,
    callback: (data: KakaoRegionResult[], status: string) => void
  ) => void;
};

const Address = () => {
  const sdkReady = useKakaoSdk(APP_KEY);
  const geocoderRef = useRef<KakaoGeocoder | null>(null);
  const { profile, updateProfile } = useSignUpStore();
  const router = useRouter();

  const [address, setAddress] = useState(profile.address || '');
  const [error, setError] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sdkReady) return;
    geocoderRef.current =
      new window.kakao.maps.services.Geocoder() as KakaoGeocoder;
  }, [sdkReady]);

  const handleUseCurrentLocation = async () => {
    const geocoder = geocoderRef.current;
    if (!sdkReady || !geocoder) return;
    try {
      const position = await requestPermissions.geolocation();
      const { latitude, longitude } = position.coords;
      geocoder.coord2RegionCode(
        longitude,
        latitude,
        (rows: KakaoRegionResult[], status: string) => {
          if (status !== window.kakao.maps.services.Status.OK) {
            setError('주소를 불러오지 못했어요.');
            return;
          }
          const h = rows.find((v: KakaoRegionResult) => v.region_type === 'H');
          if (!h) {
            setError('행정동 정보를 찾지 못했어요.');
            return;
          }
          const full = `${h.region_1depth_name} ${h.region_2depth_name} ${h.region_3depth_name}`;
          setAddress(full);
          setResults([]);
          setError('');
          updateProfile('address', full);
        }
      );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : '현재 위치를 가져오지 못했어요.'
      );
    }
  };

  const debounced = useDebounce(address, 300);

  useEffect(() => {
    const geocoder = geocoderRef.current;

    console.log('=== 검색 useEffect 시작 ===');
    console.log('sdkReady:', sdkReady);
    console.log('geocoder:', geocoder);
    console.log('debounced:', debounced);

    if (!sdkReady || !geocoder) return;
    const q = debounced.trim();
    if (!q) {
      console.log('검색어가 비어있음, 결과 초기화');
      setResults([]);
      return;
    }

    console.log('=== Kakao 주소 검색 시작 ===');
    console.log('검색어:', q);

    setLoading(true);
    geocoder.addressSearch(
      q,
      (res: KakaoSearchResult[], status: KakaoStatus) => {
        console.log('=== Kakao 주소 검색 콜백 실행 ===');
        console.log('상태:', status);
        console.log('결과 개수:', res?.length || 0);
        console.log('원본 결과 (첫 5개):', res?.slice(0, 5));

        setLoading(false);
        if (
          status !== window.kakao.maps.services.Status.OK ||
          !Array.isArray(res)
        ) {
          console.log('검색 실패 또는 결과 없음');
          setResults([]);
          return;
        }

        console.log('=== 주소 파싱 시작 ===');
        const mapped = res
          .map((r) => r.address || r.road_address)
          .filter((a): a is KakaoAddress => Boolean(a))
          .map((a) => {
            const full = a.address_name;
            const parts = full.split(' ').filter(Boolean);

            // address_name에서 직접 파싱
            const si = parts[0] || a.region_1depth_name || '';
            const gu = parts[1] || a.region_2depth_name || '';
            const dong = parts[2] || a.region_3depth_name || '';
            const ri = parts[3] || a.region_4depth_name;

            console.log('원본 주소:', a);
            console.log('파싱된 주소:', { full, parts, si, gu, dong, ri });
            return { full, si, gu, dong, ri };
          })
          .filter((x) => x.dong);

        console.log('=== 동이 있는 주소만 필터링 완료 ===');
        console.log('필터링 후 개수:', mapped.length);

        const uniq = new Map<string, SearchItem>();
        mapped.forEach((x) => {
          if (!uniq.has(x.full)) uniq.set(x.full, x);
        });
        const arr = Array.from(uniq.values());

        console.log('=== 중복 제거 완료 ===');
        console.log('중복 제거 후 개수:', arr.length);

        const starts = arr.filter(
          (x) => x.dong && String(x.dong).startsWith(q)
        );
        const contains = arr.filter(
          (x) =>
            x.dong &&
            String(x.dong).includes(q) &&
            !String(x.dong).startsWith(q)
        );
        const rest = arr.filter((x) => !String(x.dong).includes(q));

        console.log('=== 정렬 완료 ===');
        console.log('시작하는 주소:', starts.length);
        console.log('포함하는 주소:', contains.length);
        console.log('나머지 주소:', rest.length);

        const finalResults = [...starts, ...contains, ...rest];
        console.log('=== 최종 결과 ===');
        console.log('총 개수:', finalResults.length);
        console.log(
          '첫 10개 동 이름:',
          finalResults.slice(0, 10).map((x) => x.dong)
        );

        setResults(finalResults);
      },
      { analyze_type: 'similar', size: 30, page: 1 }
    );
  }, [debounced, sdkReady]);

  const handlePick = (item: SearchItem) => {
    console.log('handlePick called:', item);
    const fullAddress = item.full;
    console.log('Setting address to:', fullAddress);
    setAddress(fullAddress);
    setResults([]);
    setError('');
    updateProfile('address', fullAddress);
  };

  const handleAddressChange = (v: string) => {
    setAddress(v);
    setError('');
  };

  const handleNext = () => {
    if (!address.trim()) {
      setError('주소를 입력해주세요.');
      return;
    }
    updateProfile('address', address.trim());
    completeStep('address');
    router.replace(PATHS.AUTH.INTEREST);
  };

  return (
    <>
      <Input.Address
        value={address}
        onChange={handleAddressChange}
        hasError={!!error}
        errorMessage={error}
        loading={loading}
        results={results}
        onResultSelect={handlePick}
        onCurrentLocationClick={handleUseCurrentLocation}
        autoFocus
      />
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

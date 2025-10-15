'use client';

import { Input } from '@/components/forms/input';
import Button from '@/components/ui/button';
import { PATHS } from '@/constant';
import { completeStep } from '@/hooks/auth/use-signup-flow';
import useDebounce from '@/hooks/common/use-debounce';
import { useKakaoSdk } from '@/hooks/map/use-kakao-sdk';
import { requestPermissions } from '@/libs/permissions/permission';
import useSignUpStore from '@/store/use-sign-up-store';
import { parseKoreanAddress } from '@/utills/kakao-map';
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
    options?: { analyze_type?: string; page?: number; size?: number }
  ) => void;
  coord2RegionCode: (
    lng: number,
    lat: number,
    callback: (data: KakaoRegionResult[], status: string) => void
  ) => void;
};

// Places(키워드 검색) 타입
type KakaoPlace = {
  address_name: string; // 지번 주소
  road_address_name: string; // 도로명 주소
  place_name: string;
  x: string;
  y: string;
};

type KakaoPlaces = {
  keywordSearch: (
    query: string,
    callback: (
      data: KakaoPlace[],
      status: KakaoStatus,
      pagination: { hasNextPage?: boolean; last?: number; current?: number }
    ) => void,
    options?: { page?: number; size?: number; location?: any }
  ) => void;
};

const Address = () => {
  const sdkReady = useKakaoSdk(APP_KEY);
  const geocoderRef = useRef<KakaoGeocoder | null>(null);
  const placesRef = useRef<KakaoPlaces | null>(null);
  const { profile, updateProfile } = useSignUpStore();
  const router = useRouter();

  const [address, setAddress] = useState(profile.address || '');
  const [selectedAddress, setSelectedAddress] = useState(profile.address || '');
  const [error, setError] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Kakao SDK 준비되면 Geocoder + Places 준비
  useEffect(() => {
    if (!sdkReady) return;
    geocoderRef.current =
      new window.kakao.maps.services.Geocoder() as KakaoGeocoder;
    placesRef.current = new window.kakao.maps.services.Places();
  }, [sdkReady]);

  // 현재 위치에서 행정동 가져오기 (그대로 유지)
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
          setSelectedAddress(full);
          setResults([]);
          setError('');
        }
      );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : '현재 위치를 가져오지 못했어요.'
      );
    }
  };

  const debounced = useDebounce(address, 300);

  // Places.keywordSearch 기반 키워드 검색 + 동까지만 + 중복제거
  useEffect(() => {
    const places = placesRef.current;
    if (!sdkReady || !places) return;

    const q = debounced.trim();
    if (!q) {
      setResults([]);
      return;
    }

    // 1페이지 검색을 Promise로
    const keywordSearchOnce = (
      query: string,
      page = 1,
      size = 15
    ): Promise<{ data: KakaoPlace[]; hasNext: boolean }> =>
      new Promise((resolve, reject) => {
        places.keywordSearch(
          query,
          (data, status, pagination) => {
            if (
              status === window.kakao.maps.services.Status.OK &&
              Array.isArray(data)
            ) {
              resolve({
                data,
                hasNext: Boolean(pagination?.hasNextPage),
              });
            } else if (
              status === window.kakao.maps.services.Status.ZERO_RESULT
            ) {
              resolve({ data: [], hasNext: false });
            } else {
              reject(new Error('kakao keywordSearch error'));
            }
          },
          { page, size }
        );
      });

    // 여러 페이지를 수집
    const fetchAllPages = async (query: string, maxPages = 7, size = 15) => {
      const all: KakaoPlace[] = [];
      for (let p = 1; p <= maxPages; p++) {
        const { data, hasNext } = await keywordSearchOnce(query, p, size);
        all.push(...data);
        if (!hasNext) break;
      }
      return all;
    };

    const labelOf = (x: SearchItem) => `${x.si} ${x.gu} ${x.dong}`.trim();

    (async () => {
      setLoading(true);
      try {
        // "서울" 같은 상위 키워드는 더 많이 모으기
        const isSingleToken = !q.includes(' ');
        const maxPages = isSingleToken ? 7 : 3;

        const raw = await fetchAllPages(q, maxPages, 15);

        // 주소 파싱 (도로명 있으면 우선, 없으면 지번)
        const parsed = raw
          .map(
            (
              p // Places 예시
            ) =>
              (p.road_address_name || p.address_name || '')
                .replace(/\s+/g, ' ')
                .trim()
          )
          .filter(Boolean)
          .map((addrStr) => parseKoreanAddress(addrStr))
          .filter((x) => !!x.dong);
        // 동 없는 항목 제외
        const onlyDong = parsed.filter((x) => !!x.dong);

        // 중복 제거 (si+gu+dong 기준)
        const uniq = new Map<string, SearchItem>();
        for (const x of onlyDong) {
          const key = `${x.si} ${x.gu} ${x.dong}`;
          if (!uniq.has(key)) uniq.set(key, x);
        }
        const arr = Array.from(uniq.values());

        // 정렬: 시작 일치 → 포함 → 나머지
        const qLower = q.toLowerCase();
        const starts = arr.filter((x) =>
          labelOf(x).toLowerCase().startsWith(qLower)
        );
        const contains = arr.filter(
          (x) =>
            labelOf(x).toLowerCase().includes(qLower) &&
            !labelOf(x).toLowerCase().startsWith(qLower)
        );
        const rest = arr.filter(
          (x) => !labelOf(x).toLowerCase().includes(qLower)
        );

        setResults([...starts, ...contains, ...rest]);
      } catch (e) {
        console.error(e);
        setResults([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [debounced, sdkReady]);

  const handlePick = (item: SearchItem) => {
    const fullAddress = item.full;
    setAddress(fullAddress);
    setSelectedAddress(fullAddress);

    updateProfile('address', selectedAddress.trim());
    completeStep('address');
    router.push(PATHS.AUTH.INTEREST);
  };

  const handleAddressChange = (v: string) => {
    setAddress(v);
    setSelectedAddress('');
    setError('');
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
        selectedValue={selectedAddress}
        onResultSelect={handlePick}
        onCurrentLocationClick={handleUseCurrentLocation}
        autoFocus
      />
    </>
  );
};

export default Address;

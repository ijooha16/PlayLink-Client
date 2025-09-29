'use client';

import { Input } from '@/components/forms/input';
import Button from '@/components/ui/button';
import { PATHS } from '@/constant';
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

  const handleUseCurrentLocation = async () => {
    if (!sdkReady || !geocoderRef.current) return;

    try {
      const position = await requestPermissions.geolocation();
      const { latitude, longitude } = position.coords;
      // TODO 나중에 zustand로 전역 current location 관리

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

          // "동까지" 저장
          const full = `${si} ${gu} ${dong}`;
          setAddress(full); // 입력창엔 동만
          setResults([]); // 리스트 비움
          setError('');

          updateProfile('address', full);
        }
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : '현재 위치를 가져오지 못했어요.'
      );
    }
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

  const handleAddressChange = (value: string) => {
    setAddress(value);
    setError('');
  };

  const handleNext = () => {
    if (!address.trim()) {
      setError('주소를 입력해주세요.');
      return;
    }

    updateProfile('address', address.trim());
    router.replace(PATHS.AUTH.INTEREST as string);
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

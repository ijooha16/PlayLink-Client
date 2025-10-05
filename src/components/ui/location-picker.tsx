'use client';

import { Search, SearchNone } from '@/components/shared/icons';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Button from './button';
import Input from './input';

interface LocationPickerProps {
  onLocationChange?: (location: string) => void;
  initialLocation?: string;
  onClose?: () => void;
}

interface KakaoPlace {
  place_name: string;
  road_address_name: string;
  address_name: string;
  x: string;
  y: string;
}

export default function LocationPicker({
  onLocationChange,
  initialLocation = '',
  onClose,
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<KakaoPlace[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  // 자체 API를 통한 장소 검색
  const searchPlaces = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/places/search?query=${encodeURIComponent(query)}`
      );

      if (response.ok) {
        const result = await response.json();
        if (result.status === 'success') {
          setSearchResults(result.data || []);
        } else {
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('장소 검색 오류:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 검색어 변경 시 debounce 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      searchPlaces(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleLocationSelect = (place: KakaoPlace) => {
    setSelectedLocation(place.place_name);
  };

  const handleConfirm = () => {
    if (selectedLocation && onLocationChange) {
      onLocationChange(selectedLocation);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className='flex h-full flex-col'>
      <h2 className='text-title-02 font-semibold text-text-strong'>
        장소 검색
      </h2>
      <p className='font-regular mb-s-24 text-body-02 text-text-netural'>
        장소를 선택해주세요.
      </p>

      {/* 검색창 */}
      <div className='mb-s-24'>
        <Input
          type='text'
          placeholder='어디서 만나나요?'
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          variant='gray'
          sizes='lg'
          leftElement={<Search size={20} className='text-icon-netural' />}
          showCancelToggle
        />
      </div>

      {/* 검색 결과 없을 때 초기 상태 */}
      {!searchQuery && (
        <div className='flex flex-1 flex-col items-center justify-center gap-s-16'>
          <Image
            src='/images/play-icons/ic_region.svg'
            alt='region'
            width={80}
            height={80}
            unoptimized
          />
          <div className='flex flex-col items-center gap-s-8'>
            <p className='text-body-1 font-medium text-text-strong'>
              장소, 지역으로 검색해보세요!
            </p>
            <p className='text-body-02 font-normal text-text-alternative'>
              EX. 구월체육관, 강남역, 함정동 등
            </p>
          </div>
        </div>
      )}

      {/* 검색 결과 영역 */}
      {searchQuery && (
        <div className='scrollbar-hide flex-1 overflow-y-auto pb-[100px]'>
          {isSearching ? (
            <p className='mt-s-24 text-center text-body-02 text-text-alternative'>
              검색 중...
            </p>
          ) : searchResults.length > 0 ? (
            <div className='flex flex-col'>
              {searchResults.map((place, index) => (
                <div key={`${place.place_name}-${index}`}>
                  <button
                    onClick={() => handleLocationSelect(place)}
                    className={`w-full text-left transition-colors hover:bg-bg-normal ${
                      selectedLocation === place.place_name
                        ? 'bg-bg-netural'
                        : ''
                    }`}
                  >
                    <div className='flex flex-col items-start gap-s-4 px-s-16 py-s-16'>
                      <span className='text-body-1 font-regular text-text-strong'>
                        {place.place_name}
                      </span>
                      <div className='flex items-center gap-s-8'>
                        <div className='font-regular flex items-center justify-center rounded-4 border border-line-netural px-s-6 py-s-2 text-caption-01 text-brand-primary'>
                          도로명
                        </div>
                        <span className='font-regular text-body-02 text-text-netural'>
                          {place.road_address_name || place.address_name}
                        </span>
                      </div>
                    </div>
                  </button>
                  {index < searchResults.length - 1 && (
                    <div className='h-[1px] bg-line-normal' />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className='mt-s-40 flex flex-col items-center gap-s-16'>
              <SearchNone size={120} className='text-icon-netural' />
              <p className='text-body-1 font-semibold text-text-strong'>
                검색 결과가 없어요!
              </p>
              <div className='flex h-s-40 items-center justify-center gap-s-8 rounded-8 border border-brand-primary px-s-16'>
                <button
                  onClick={() => {
                    if (onLocationChange) {
                      onLocationChange(searchQuery);
                    }
                    if (onClose) {
                      onClose();
                    }
                  }}
                  className='flex items-center gap-s-8 text-label-m font-semibold text-brand-primary'
                >
                  <span className='text-xl'>+</span>
                  <span>{searchQuery} 장소 입력</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedLocation && (
        <Button isFloat onClick={handleConfirm}>
          선택
        </Button>
      )}
    </div>
  );
}

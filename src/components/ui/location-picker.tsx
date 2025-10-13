'use client';

import { Search, SearchNone } from '@/components/shared/icons';
import useDebounce from '@/hooks/common/use-debounce';
import {
  KakaoPlace,
  useSearchPlaces,
  type SearchPlacesResponse,
} from '@/hooks/react-query/places/use-search-places';
import Image from 'next/image';
import { useState } from 'react';
import Button from './button';
import Input from './input';

export type LocationData = {
  placeName: string;
  placeAddress: string;
  placeLocation: string; // "y, x" 형식
};

interface LocationPickerProps {
  onLocationChange?: (location: LocationData) => void;
  initialLocation?: LocationData;
  onClose?: () => void;
}

export default function LocationPicker({
  onLocationChange,
  initialLocation,
  onClose,
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<KakaoPlace | null>(null);

  // 검색어 debounce 처리
  const debouncedQuery = useDebounce(searchQuery, 300);

  // React Query로 장소 검색 (페이지네이션)
  const {
    data: searchResultPages,
    isLoading: isInitialLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchPlaces(debouncedQuery);

  const searchResults =
    searchResultPages?.pages.flatMap(
      (page) => page.places
    ) ?? [];

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setSelectedPlace(null);
  };

  const handleLocationSelect = (place: KakaoPlace) => {
    setSelectedPlace(place);
  };

  const handleConfirm = () => {
    if (selectedPlace && onLocationChange) {
      onLocationChange({
        placeName: selectedPlace.place_name,
        placeAddress:
          selectedPlace.road_address_name || selectedPlace.address_name,
        placeLocation: `${selectedPlace.y}, ${selectedPlace.x}`,
      });
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
      <p className='font-regular mb-s-24 text-body-02 text-text-neutral'>
        장소를 선택해주세요.
      </p>

      {/* 검색창 */}
      <div className='mb-s-24'>
        <Input
          type='text'
          placeholder='어디서 만나나요?'
          value={searchQuery}
          isSignupFlow={false}
          showStatusIcons={false}
          onChange={(e) => handleSearch(e.target.value)}
          variant='gray'
          sizes='lg'
          leftElement={<Search size={20} className='text-icon-neutral' />}
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
      {debouncedQuery && (
        <div className='scrollbar-hide flex-1 overflow-y-auto pb-[100px]'>
          {isInitialLoading && searchResults.length === 0 ? (
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
                      selectedPlace?.place_name === place.place_name
                        ? 'bg-bg-neutral'
                        : ''
                    }`}
                  >
                    <div className='flex flex-col items-start gap-s-4 px-s-16 py-s-16'>
                      <span className='text-body-1 font-regular text-text-strong'>
                        {place.place_name}
                      </span>
                      <div className='flex items-center gap-s-8'>
                        <div className='font-regular flex items-center justify-center rounded-4 border border-line-neutral px-s-6 py-s-2 text-caption-01 text-brand-primary'>
                          도로명
                        </div>
                        <span className='font-regular text-body-02 text-text-neutral'>
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
              {hasNextPage && (
                <div className='flex items-center justify-center border-t border-line-neutral px-s-16 py-s-16'>
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className='text-label-m font-semibold text-brand-primary disabled:cursor-not-allowed disabled:opacity-60'
                  >
                    {isFetchingNextPage ? '불러오는 중...' : '더 보기'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className='mt-s-40 flex flex-col items-center gap-s-16'>
              <SearchNone size={120} className='text-icon-neutral' />
              <p className='text-body-1 font-semibold text-text-strong'>
                검색 결과가 없어요!
              </p>
              <div className='flex h-s-40 items-center justify-center gap-s-8 rounded-8 border border-brand-primary px-s-16'>
                <button
                  onClick={() => {
                    if (onLocationChange) {
                      onLocationChange({
                        placeName: debouncedQuery,
                        placeAddress: '',
                        placeLocation: '',
                      });
                    }
                    if (onClose) {
                      onClose();
                    }
                  }}
                  className='flex items-center gap-s-8 text-label-m font-semibold text-brand-primary'
                >
                  <span className='text-xl'>+</span>
                  <span>{debouncedQuery} 장소 입력</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedPlace && (
        <Button isFloat onClick={handleConfirm}>
          선택
        </Button>
      )}
    </div>
  );
}

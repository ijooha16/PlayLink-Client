import { useGetMatchesQuery } from '@/hooks/match/use-get-matches-query';
import SportCard from '@/shares/common-components/sport-card';
import Tag from '@/shares/common-components/tag';
import { SPORTS } from '@/shares/dummy-data/sports-data';
import { useSearchStore } from '@/shares/stores/search-store';
import { ChevronLeft } from 'lucide-react';
import React, { Dispatch, SetStateAction, useState } from 'react';

const SearchView = ({
  setSearchViewOpen,
}: {
  setSearchViewOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('구기');
  const [inputValue, setInputValue] = useState('');
  const { setKeyword } = useSearchStore();

  const items = SPORTS[selectedCategory];
  const remainder = items.length % 5;
  const emptySlots = remainder === 0 ? 0 : 5 - remainder;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchViewOpen(false);
    setKeyword(inputValue);
  };

  const categories = [
    '구기',
    '수상',
    '피트니스',
    '육상/체조',
    '육상 외 경주',
    '표적',
    '격투기',
    '레저/익스트림',
    '설상/빙상',
    '기타',
  ];

  return (
    <div className='fixed left-0 top-0 z-50 h-screen w-full bg-white px-4'>
      <div
        className={`fixed left-0 top-0 z-50 flex h-16 w-full max-w-[640px] items-center justify-between gap-6 bg-gray-100 px-4`}
      >
        <ChevronLeft onClick={() => setSearchViewOpen(false)} />
        <form
          onSubmit={handleSubmit}
          className='flex h-10 flex-1 items-center rounded-lg bg-gray-200 px-3'
        >
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            type='text'
            placeholder='스포츠 종목 검색'
          />
        </form>
        <div onClick={() => setSearchViewOpen(false)}>닫기</div>
      </div>
      <div className='mt-20 flex flex-col gap-4'>
        <div className='scrollbar-hide flex gap-2 overflow-x-auto'>
          {categories.map((category) => (
            <Tag
              key={category}
              onClick={() => setSelectedCategory(category)}
              selected={selectedCategory === category}
            >
              {category}
            </Tag>
          ))}
        </div>
        <hr className='h-[1px] bg-gray-400' />
        <div className='text-lg font-semibold'>
          전체 스포츠 종목 ({items.length}개)
        </div>
        <div className='flex flex-wrap justify-between gap-6'>
          {items.map((sport) => (
            <SportCard sport={sport} key={sport} />
          ))}
          {Array.from({ length: emptySlots }).map((_, i) => (
            <div key={`empty-${i}`} className='w-12' />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchView;

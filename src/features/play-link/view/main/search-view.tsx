import SportCard from '@/shares/common-components/sport-card';
import Tag from '@/shares/common-components/tag';
import { SPORTS } from '@/shares/dummy-data/sports-data';
import { ChevronLeft } from 'lucide-react';
import React, { Dispatch, SetStateAction, useState } from 'react';

const SearchView = ({
  setSearchViewOpen,
}: {
  setSearchViewOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('구기');

  const items = SPORTS[selectedCategory];
  const remainder = items.length % 5;
  const emptySlots = remainder === 0 ? 0 : 5 - remainder;

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
    <div className='fixed top-0 z-50 h-screen w-full bg-white px-4'>
      <div className='flex max-w-[640px] items-center justify-between gap-6 py-4'>
        <ChevronLeft onClick={() => setSearchViewOpen(false)} />
        <input
          type='text'
          className='h-10 flex-1 rounded-lg bg-gray-100 px-3'
          placeholder='스포츠 종목 검색'
        />
        <div onClick={() => setSearchViewOpen(false)}>닫기</div>
      </div>
      <div className='flex flex-col gap-4'>
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
        <div className='text-lg font-semibold'>전체 스포츠 종목 ({items.length}개)</div>
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

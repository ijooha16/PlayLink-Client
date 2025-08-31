import { useGetSportsQuery } from '@/hooks/sport/get-sport-query';
import SportCard from '@/shares/common-components/sport-card';
import Tag from '@/shares/common-components/tag';
import { useSearchStore } from '@/shares/stores/search-store';
import { ChevronLeft } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';

const SearchView = ({
  setSearchViewOpen,
}: {
  setSearchViewOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [inputValue, setInputValue] = useState('');
  const { setKeyword, setType } = useSearchStore();
  const { data: sportsData } = useGetSportsQuery();

  const categories = sportsData && sportsData?.data?.data?.Categories;
  const sports = sportsData && sportsData?.data?.data?.sports;

  const items =
    sports &&
    sports.filter(
      (sport: {
        sports_name: string;
        sports_id: number;
        category_id: number;
      }) => sport.category_id === selectedCategory
    );
  const remainder = items && items.length % 5;
  const emptySlots = remainder && remainder === 0 ? 0 : 5 - remainder;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchViewOpen(false);
    setKeyword(inputValue);
  };

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
          {categories &&
            categories.map(
              (category: { category_id: number; category_name: string }) => (
                <Tag
                  key={category.category_id}
                  onClick={() => setSelectedCategory(category.category_id)}
                  selected={selectedCategory === category.category_id}
                >
                  {category.category_name}
                </Tag>
              )
            )}
        </div>
        <hr className='h-[1px] bg-gray-400' />
        <div className='text-lg font-semibold'>
          전체 스포츠 종목 ({items && items.length}개)
        </div>
        <div className='grid grid-cols-5 gap-3'>
          {items &&
            items.map((sport: { sports_name: string; sports_id: number }) => (
              <SportCard
                sport={sport.sports_id}
                sport_name={sport.sports_name}
                key={sport.sports_id}
                onClick={() => {
                  setSearchViewOpen(false);
                  setType(sport.sports_id);
                }}
              />
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

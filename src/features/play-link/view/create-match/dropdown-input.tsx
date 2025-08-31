'use client';

import Input from '@/shares/common-components/input';
import { SearchIcon } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';

type DropdownInputProps = {
  dummyData: string[];
  keyword: string;
  setKeyword: Dispatch<SetStateAction<string>>;
  placeholderText: string;
  isSearchable?: boolean; // 검색 가능 여부 추가
};

const DropdownInput = ({
  dummyData,
  keyword,
  setKeyword,
  placeholderText,
  isSearchable = true, // 기본값은 검색 가능
}: DropdownInputProps) => {
  const [focused, setFocused] = useState(false);

  const filteredResults = isSearchable
    ? dummyData.filter((item) =>
        item.toLowerCase().includes(keyword.toLowerCase())
      )
    : dummyData; // 검색 불가능하면 전체 데이터 반환

  const handleSelect = (value: string) => {
    setKeyword(value);
    setFocused(false); // 선택 후 드롭다운 닫기
  };

  return (
    <div className='relative w-full'>
      <Input
        type='text'
        placeholder={placeholderText}
        variant={'default'}
        sizes={'md'}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 0)}
        readOnly={!isSearchable} // 검색 불가능하면 읽기 전용
      />

      {isSearchable && (
        <SearchIcon
          className='absolute right-4 top-3 text-gray-400'
          size={18}
        />
      )}

      {focused && (
        <ul className='absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-md'>
          {filteredResults.length > 0 ? (
            filteredResults.map((result, idx) => (
              <li
                key={idx}
                className='cursor-pointer px-4 py-2 hover:bg-blue-100'
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleSelect(result);
                }}
              >
                {result}
              </li>
            ))
          ) : (
            <li className='px-4 py-2 text-gray-500'>검색 결과가 없습니다</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default DropdownInput;

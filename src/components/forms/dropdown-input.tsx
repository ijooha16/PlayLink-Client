'use client';

import { SearchIcon } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';

type DropdownInputProps = {
  dummyData: string[];
  keyword: string;
  setKeyword: (e:string) => void;
  placeholderText: string;
  isSearchable?: boolean;
};

const DropdownInput = ({
  dummyData,
  keyword,
  setKeyword,
  placeholderText,
  isSearchable = true,
}: DropdownInputProps) => {
  const [focused, setFocused] = useState(false);

  const filteredResults = isSearchable
    ? dummyData.filter((item) =>
        item.toLowerCase().includes(keyword.toLowerCase())
      )
    : dummyData; // 검색 불가능하면 전체 데이터 반환

  const handleSelect = (value: string) => {
    setKeyword(value);
    setFocused(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleInputFocus = () => {
    setFocused(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => setFocused(false), 100);
  };

  const handleItemClick = (value: string) => {
    handleSelect(value);
  };

  return (
    <div className='relative w-full'>
      <input
        type='text'
        placeholder={placeholderText}
        value={keyword}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        readOnly={!isSearchable}
        className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
      />

      {isSearchable && (
        <SearchIcon
          className='absolute right-4 top-3 text-gray-400'
          size={18}
        />
      )}

      {focused && (
        <ul className='absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-md'>
          {filteredResults.length > 0 ? (
            dummyData.map((result, idx) => (
              <li
                key={`${result}-${idx}`}
                className='cursor-pointer px-4 py-2 hover:bg-blue-100'
                onClick={() => handleItemClick(result)}
              >
                {result}
              </li>
            ))
          ) : (
            <li className='cursor-pointer px-4 py-2 hover:bg-blue-100'>
              검색 결과가 없습니다.
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default DropdownInput;

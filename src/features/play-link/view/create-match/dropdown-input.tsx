'use client';

import Input from '@/shares/common-components/input';
import { SearchIcon } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';

type DropdownInputProps = {
  dummyData: string[];
  keyword: string;
  setKeyword: Dispatch<SetStateAction<string>>;
  placeholderText: string;
};

const DropdownInput = ({
  dummyData,
  keyword,
  setKeyword,
  placeholderText,
}: DropdownInputProps) => {
  const [focused, setFocused] = useState(false);

  const filteredResults = dummyData.filter((item) =>
    item.toLowerCase().includes(keyword.toLowerCase())
  );

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
        onBlur={() => setTimeout(() => setFocused(false), 200)}
      />

      <SearchIcon className='absolute right-4 top-3 text-gray-400' size={18} />

      {focused && keyword && (
        <ul className='absolute z-10 mt-1 w-full rounded-lg border bg-white shadow-md'>
          {filteredResults.length > 0 ? (
            filteredResults.map((result, idx) => (
              <li
                key={idx}
                className='cursor-pointer px-4 py-2 hover:bg-blue-100'
                onMouseDown={() => setKeyword(result)}
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

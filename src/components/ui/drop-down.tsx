'use client';

import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const DropDown = ({
  options,
  onSelect,
}: {
  options: string[];
  onSelect: (v: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>(options[0]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    setSelected(option);
    onSelect(option);
    setOpen(false);
  };

  return (
    <>
      {open && (
        <div
          className='fixed inset-0 z-10 w-full bg-black/40'
          onClick={() => setOpen(false)}
        />
      )}

      <div ref={ref} className='relative z-20 w-full'>
        <button
          type='button'
          tabIndex={0}
          aria-haspopup='listbox'
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className='flex w-1/2 place-items-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-start text-lg'
        >
          {selected ? (
            <span className='max-w-screen-md truncate'>{selected}</span>
          ) : (
            '선택하세요'
          )}

          <ChevronDown
            size={24}
            className={`transition-transform duration-200 ease-in-out ${open ? '-rotate-180' : ''}`}
          />
        </button>

        {open && (
          <ul
            role='listbox'
            tabIndex={-1}
            className='absolute left-0 right-0 mt-2 w-1/2 rounded-xl border bg-white shadow-md'
          >
            {options.map((option) => (
              <li
                key={option}
                role='option'
                tabIndex={0}
                aria-selected={selected === option}
                onClick={() => handleSelect(option)}
                className={`truncate rounded-xl px-4 py-3 text-start text-base ${
                  selected === option ? 'bg-blue-100 font-medium' : ''
                }`}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default DropDown;

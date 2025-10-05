'use client';

import { ChevronDown } from '@/components/shared/icons';
import React from 'react';

interface SelectButtonProps {
  icon: React.ReactNode;
  placeholder: string;
  value?: string;
  subText?: string | React.ReactNode;
  defaultSubText?: string;
  onClick?: () => void;
}

export default function SelectButton({
  icon,
  placeholder,
  value,
  subText,
  defaultSubText,
  onClick,
}: SelectButtonProps) {
  // defaultSubText가 있는 경우: subText가 defaultSubText와 다르면 선택된 상태
  // defaultSubText가 없는 경우: value가 있으면 선택된 상태
  const isSelected = defaultSubText ? subText !== defaultSubText : !!value;

  return (
    <button
      onClick={onClick}
      className='flex h-[48px] items-center gap-s-12 rounded-12 bg-bg-normal px-s-16'
    >
      {icon}
      <span
        className={`flex-1 text-left ${
          isSelected
            ? 'text-body-2 font-medium text-text-strong'
            : 'text-body-1 text-text-neutral'
        }`}
      >
        {value || placeholder}
      </span>
      {subText && (
        <span
          className={`${
            isSelected
              ? 'text-body-2 font-medium text-text-strong'
              : 'text-body-1 text-text-disabled'
          }`}
        >
          {subText}
        </span>
      )}
      <ChevronDown size={16} className='text-icon-neutral' />
    </button>
  );
}

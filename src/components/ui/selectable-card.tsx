'use client';

import Image from 'next/image';
import { Check } from '@/components/shared/icons';

interface SelectableCardProps {
  id: string;
  title: string;
  description?: string;
  icon?: string; // emoji or image path
  iconType?: 'emoji' | 'image';
  showIcon?: boolean;
  checkType?: 'checkbox' | 'check-icon';
  isSelected: boolean;
  onClick: () => void;
}

export default function SelectableCard({
  id,
  title,
  description,
  icon,
  iconType = 'emoji',
  showIcon = true,
  checkType = 'checkbox',
  isSelected,
  onClick,
}: SelectableCardProps) {
  return (
    <div
      onClick={onClick}
      className={`flex h-[80px] cursor-pointer items-center justify-between rounded-16 border px-5 transition-colors ${
        isSelected
          ? 'border-primary-800 bg-primary-50'
          : 'border-border-netural bg-white'
      }`}
    >
      <div className='flex items-center gap-3'>
        {showIcon && (
          <div
            className={`${isSelected ? 'bg-bg-netural bg-primary-300' : 'bg-bg-netural'} flex h-[40px] w-[40px] items-center justify-center rounded-full`}
          >
            {iconType === 'emoji' ? (
              <span className='text-xl'>{icon}</span>
            ) : (
              icon && (
                <Image
                  src={icon}
                  alt={title}
                  width={24}
                  height={24}
                  className='h-6 w-6'
                  unoptimized
                />
              )
            )}
          </div>
        )}
        <div className='flex flex-col'>
          <h3 className='text-body-1 font-semibold text-text-strong'>
            {title}
          </h3>
          {description && (
            <p className='text-body-02 font-normal text-text-alternative'>
              {description}
            </p>
          )}
        </div>
      </div>
      {checkType === 'checkbox' ? (
        <input
          type='checkbox'
          checked={isSelected}
          readOnly
          className='h-5 w-5 cursor-pointer'
        />
      ) : (
        <Check
          size={18}
          className={`transition-colors ${
            isSelected
              ? 'text-primary-800 [&_path]:stroke-[2.5]'
              : 'text-gray-400 [&_path]:stroke-[2.5]'
          }`}
        />
      )}
    </div>
  );
}

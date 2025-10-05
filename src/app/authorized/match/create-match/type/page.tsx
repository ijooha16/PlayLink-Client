'use client';

import { Check } from '@/components/shared/icons';
import Button from '@/components/ui/button';
import { PATHS } from '@/constant';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CreateMatchType = () => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedType === null) return;
    // TODO: Store에 저장
    router.replace(PATHS.MATCH.CREATE_MATCH + '/sports');
  };

  const options = [
    {
      id: 'play',
      title: '운동 함께하기',
      description: '함께 운동에 참여할 멤버를 찾아요',
      icon: '🤗',
    },
    {
      id: 'watch',
      title: '경기 보러가기',
      description: '함께 경기를 관람할 멤버를 찾아요',
      icon: '😎',
    },
  ];

  return (
    <>
      <div className='flex flex-col gap-s-16 pb-[24px]'>
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => setSelectedType(option.id)}
            className={`flex h-[80px] cursor-pointer items-center justify-between rounded-16 border px-5 transition-colors ${
              selectedType === option.id
                ? 'border-primary-800 bg-primary-50'
                : 'border-border-neutral bg-white'
            }`}
          >
            <div className='flex items-center gap-3'>
              <div
                className={`${selectedType === option.id ? 'bg-bg-neutral bg-primary-300' : 'bg-bg-neutral'} flex h-[40px] w-[40px] items-center justify-center rounded-full`}
              >
                <span className='text-xl'>{option.icon}</span>
              </div>
              <div className='flex flex-col'>
                <h3 className='text-title-03 font-semibold text-text-strong'>
                  {option.title}
                </h3>
                <p className='text-body-02 font-normal text-text-alternative'>
                  {option.description}
                </p>
              </div>
            </div>
            <Check
              size={18}
              className={`transition-colors ${
                selectedType === option.id
                  ? 'text-primary-800 [&_path]:stroke-[2.5]'
                  : 'text-gray-400 [&_path]:stroke-[2.5]'
              }`}
            />
          </div>
        ))}
      </div>

      <Button
        variant='default'
        disabled={selectedType === null}
        onClick={handleNext}
        isFloat
      >
        다음
      </Button>
    </>
  );
};

export default CreateMatchType;

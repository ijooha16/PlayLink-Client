'use client';

import Button from '@/components/ui/button';
import useSignUpStore from '@/store/use-sign-up-store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Interest = () => {
  const { profile, updateProfile } = useSignUpStore();
  const router = useRouter();

  const [selectedType, setSelectedType] = useState<string | null>(
    profile.favor || null
  );

  const handleNext = () => {
    if (selectedType === null) return;

    updateProfile('favor', selectedType);
    router.replace('/anonymous/auth/sign-up/sports');
  };

  const options = [
    {
      index: 0,
      id: '1',
      title: '운동 경기 참여',
      icon: '🏃‍♂️',
    },
    {
      index: 1,
      id: '2',
      title: '운동 경기 관람',
      icon: '👀',
    },
    {
      index: 2,
      id: '0',
      title: '운동 경기 참여와 관람 모두 선호',
      icon: '🏃‍♂️',
    },
  ] as const;

  return (
    <>
      <div className="flex flex-col gap-s-16 pb-[24px]">
        {options.map((option) => (
          <div
            key={option.index}
            onClick={() => setSelectedType(option.id)}
            className={`flex items-center gap-s-16 p-s-20 rounded-lg transition-colors cursor-pointer ${
              selectedType === option.id
                ? 'border border-brand-primary bg-primary-50'
                : 'border border-border-netural bg-white'
            }`}
          >
                        <div
              className={`w-[20px] h-[20px] rounded-full border-border-netural transition-colors ${
                selectedType === option.id
                  ? 'bg-brand-primary border-brand-primary border-4'
                  : 'border-icon-disabled border-2'
              }`}
            >
              {selectedType === option.id && (
                <div className="w-full h-full rounded-full bg-white scale-75" />
              )}
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-label-l font-semibold text-text-strong">
                {option.title}
              </h3>

            </div>

          </div>
        ))}
      </div>

      <Button
        variant="default"
        disabled={selectedType === null}
        onClick={handleNext}
        isFloat
      >
        다음
      </Button>
    </>
  );
};

export default Interest;
'use client';

import AuthLayoutContainer from '@/components/layout/auth-layout';
import Button from '@/components/ui/button';
import { useSignUpNavigation } from '@/hooks/use-sign-up-navigation';
import { useSignUpStepStore } from '@/store/sign-up-store';
import { useState } from 'react';

const Interest = () => {
  const { data, updateStep } = useSignUpStepStore();
  const { goToNext, currentStepTitle } = useSignUpNavigation({
    currentStep: 'interest',
  });

  const [selectedType, setSelectedType] = useState<'participate' | 'watch' | 'both' | null>(
    data.participationType || null
  );

  const handleNext = () => {
    if (!selectedType) return;

    updateStep({ participationType: selectedType });
    goToNext();
  };

  const options = [
    {
      id: 'participate',
      title: '운동 경기 참여',
      icon: '🏃‍♂️',
    },
    {
      id: 'watch',
      title: '운동 경기 관람',
      icon: '👀',
    },
    {
      id: 'both',
      title: '운동 경기 참여와 관람 모두 선호',
      icon: '🏃‍♂️',
    },
  ] as const;

  return (
    <AuthLayoutContainer title={currentStepTitle}>
      <div className="flex flex-col gap-s-16 pb-[24px]">
        {options.map((option) => (
          <div
            key={option.id}
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
        disabled={!selectedType}
        onClick={handleNext}
        isFloat
      >
        다음
      </Button>
    </AuthLayoutContainer>
  );
};

export default Interest;
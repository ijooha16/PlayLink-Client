'use client';

import AuthLayoutContainer from '@/components/layout/auth-layout';
import { Location, Search, SearchNone } from '@/components/shared/icons';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useSignUpNavigation } from '@/hooks/use-sign-up-navigation';
import { useSignUpStepStore } from '@/store/sign-up-store';
import { useState } from 'react';

const Address = () => {
  const { data, updateStep } = useSignUpStepStore();
  const { goToNext, currentStepTitle } = useSignUpNavigation({
    currentStep: 'address',
  });

  const [address, setAddress] = useState(data.address || '');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!address.trim()) {
      setError('주소를 입력해주세요.');
      return;
    }

    updateStep({ address: address.trim() });
    goToNext();
  };

  return (
    <AuthLayoutContainer title={currentStepTitle}>
      <div className="flex flex-col gap-s-10">
        <Input
          variant="gray"
          sizes="lg"
          placeholder="동/읍/면 검색 (EX.서초동)"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            setError('');
          }}
          hasError={!!error}
          errorMessage={error}
          leftElement={<Search size={20} className="text-icon-netural" />}
          showCancelToggle={!!address}
        />
        <div className="flex items-center gap-s-4 cursor-pointer px-s-12 py-s-16 w-full justify-center min-h-[48px]">
          <Location size={16} />
          <span className="label-m font-regular text-brand-primary">현재 위치로 설정 하기</span>
        </div>
      </div>
      <div className="h-[8px] bg-bg-normal"></div>
      {/* 검색 결과 */}
      <div className="flex flex-col mt-s-40 gap-s-16 items-center">
        <SearchNone size={120} />
        <span className="text-body-01 font-semibold text-text-strong text-center">검색 결과가 없어요 <br />다시 입력해 주세요</span>
      </div>
      {/* <div className="">
        {[1, 2, 3, 4, 5].map((item, index) => (
          <div
            key={index}
            className="flex gap-s-4 cursor-pointer px-s-12 py-s-16 w-full min-h-[48px] mx-s-20 border-b border-line-normal"
          >
            <span className="text-body-01 font-regular text-text-strong">서울 서포초구 서초{index +1}동</span>
          </div>
        ))}
      </div> */}

      <Button
        variant="default"
        disabled={!address.trim()}
        onClick={handleNext}
        isFloat
      >
        다음
      </Button>
    </AuthLayoutContainer>
  );
};

export default Address;
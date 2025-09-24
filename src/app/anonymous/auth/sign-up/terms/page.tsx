'use client';

import AuthLayoutContainer from '@/components/layout/auth-layout';
import { ChevronRight } from '@/components/shared/icons';
import Button from '@/components/ui/button';
import { POLICY } from '@/constant';
import { useSignUpNavigation } from '@/hooks/use-sign-up-navigation';
import { useModalStore } from '@/store/modal-store';
import { useSignUpStepStore } from '@/store/sign-up-store';
import { useState } from 'react';

const TermsScreen = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const { openModal } = useModalStore();
  const { updateStep } = useSignUpStepStore();
  const { goToNext, currentStepTitle } = useSignUpNavigation({
    currentStep: 'terms',
    skipValidation: true,
  });

  const handleCheckboxChange = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAllCheck = () => {
    const allChecked = POLICY.every((policy) => checkedItems[policy.id]);
    if (allChecked) {
      setCheckedItems({});
    } else {
      const newCheckedItems: Record<string, boolean> = {};
      POLICY.forEach((policy) => {
        newCheckedItems[policy.id] = true;
      });
      setCheckedItems(newCheckedItems);
    }
  };

  const showTermsModal = (policyId: string) => {
    const policy = POLICY.find((p) => p.id === policyId);
    if (policy) {
      openModal({
        title: policy.title,
        content: policy.content,
        isMarkdown: true,
        showCancelButton: false,
        confirmText: '확인',
      });
    }
  };

  const isAllRequiredChecked = POLICY.filter((p) => p.required).every(
    (p) => checkedItems[p.id]
  );
  const isAllChecked = POLICY.every((p) => checkedItems[p.id]);

  const handleNextClick = () => {
    if (isAllRequiredChecked) {
      updateStep({ terms: true });
      goToNext();
    }
  };

  return (
    <AuthLayoutContainer title={currentStepTitle}>
      <button className='flex justify-between pt-s-40' onClick={handleAllCheck}>
        <div className='flex select-none items-center gap-s-16'>
          <input type='checkbox' checked={isAllChecked} readOnly />
          <h4 className='text-title-04 font-semibold'>전체 동의하기</h4>
        </div>
      </button>
      <div className='my-s-16 h-[1px] bg-border-netural' />
      <div className='flex flex-col space-y-4'>
        {POLICY.map((policy) => (
          <div key={policy.id} className='flex justify-between'>
            <label className='flex cursor-pointer select-none items-center gap-s-16'>
              <input
                type='checkbox'
                checked={checkedItems[policy.id] || false}
                onChange={() => handleCheckboxChange(policy.id)}
              />
              <span className='text-text-alternative'>
                [{policy.required ? '필수' : '선택'}] {policy.title}
              </span>
            </label>

            <button
              type='button'
              className='cursor-pointer p-1'
              onClick={() => showTermsModal(policy.id)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        ))}
      </div>

      <Button
        variant='default'
        disabled={!isAllRequiredChecked}
        onClick={handleNextClick}
        isFloat
      >
        다음
      </Button>
    </AuthLayoutContainer>
  );
};

export default TermsScreen;

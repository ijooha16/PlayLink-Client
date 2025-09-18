'use client';

import AuthLayoutContainer from '@/components/layout/auth-layout';
import Button from '@/components/ui/button';
import { PATHS, POLICY } from '@/constant';
import { useModalStore } from '@/store/modal-store';
import { useSignUpStepStore } from '@/store/sign-up-store';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const TermsScreen = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const { openModal } = useModalStore();
  const router = useRouter();
  const { updateStep } = useSignUpStepStore();

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
      router.push(PATHS.AUTH.SIGN_UP + '/phone-check');
    }
  };

  return (
    <AuthLayoutContainer title={'서비스 이용을 위해 \n 약관에 동의해주세요.'}>
      <button className='flex justify-between' onClick={handleAllCheck}>
        <div className='flex select-none items-center gap-[16px]'>
          <input
            type='checkbox'
            className='checkbox-all'
            checked={isAllChecked}
            readOnly
          />
          <h4 className='text-title-04'>전체 동의하기</h4>
        </div>
      </button>
      <div className='my-[16px] h-[1px] bg-grey05' />
      <div className='flex flex-col space-y-4'>
        {POLICY.map((policy) => (
          <div key={policy.id} className='flex justify-between'>
            <label className='flex cursor-pointer select-none items-center gap-[16px]'>
              <input
                type='checkbox'
                className='checkbox-base'
                checked={checkedItems[policy.id] || false}
                onChange={() => handleCheckboxChange(policy.id)}
              />
              <span>
                [{policy.required ? '필수' : '선택'}] {policy.title}
              </span>
            </label>

            <button
              type='button'
              className='cursor-pointer p-1'
              onClick={() => showTermsModal(policy.id)}
            >
              <ChevronRight color='var(--color-black)' size={18} />
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

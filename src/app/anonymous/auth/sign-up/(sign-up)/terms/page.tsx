'use client';

import { ChevronRight } from '@/components/shared/icons';
import Button from '@/components/ui/button';
import { PATHS, POLICY, POLICY_CONTENT } from '@/constant';
import { completeStep } from '@/hooks/auth/use-signup-flow';
import { useModalStore } from '@/store/modal-store';
import useSignUpStore from '@/store/use-sign-up-store';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const TermsScreen = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const { openModal } = useModalStore();
  const router = useRouter();
  const { updateSignUp, resetSignUp, resetProfile } = useSignUpStore();

  // 회원가입 플로우 진입 시 store 초기화
  useEffect(() => {
    resetSignUp();
    resetProfile();
  }, []);

  // 체크박스 토글
  const handleCheckboxChange = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 전체 선택 / 해제
  const handleAllCheck = () => {
    const newChecked = POLICY.reduce<Record<string, boolean>>((acc, p) => {
      acc[p.id] = !isAllChecked;
      return acc;
    }, {});
    setCheckedItems(newChecked);
  };

  // 약관 모달 열기
  const showTermsModal = (policyId: string) => {
    const policy = POLICY.find((p) => p.id === policyId);
    if (!policy) return;

    // 모달을 열 때만 약관 내용을 불러옴
    const content = POLICY_CONTENT[policyId]?.() || '';

    openModal({
      title: policy.title,
      content,
      isMarkdown: true,
      showCancelButton: false,
      confirmText: '확인',
    });
  };

  // 필수 약관, 전체 체크 여부
  const isAllRequiredChecked = useMemo(
    () => POLICY.filter((p) => p.required).every((p) => checkedItems[p.id]),
    [checkedItems]
  );
  const isAllChecked = useMemo(
    () => POLICY.every((p) => checkedItems[p.id]),
    [checkedItems]
  );

  return (
    <>
      {/* 전체 동의 */}
      <button className='flex justify-between pt-s-40' onClick={handleAllCheck}>
        <div className='flex select-none items-center gap-s-16'>
          <input type='checkbox' checked={isAllChecked} readOnly />
          <h4 className='text-title-04 font-semibold'>전체 동의하기</h4>
        </div>
      </button>

      <div className='bg-border-neutral my-s-16 h-[1px]' />

      {/* 개별 약관 */}
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
        onClick={() => {
          updateSignUp('terms', isAllRequiredChecked);
          completeStep('terms');
          router.replace(PATHS.AUTH.PHONE_CHECK);
        }}
        isFloat
      >
        다음
      </Button>
    </>
  );
};

export default TermsScreen;

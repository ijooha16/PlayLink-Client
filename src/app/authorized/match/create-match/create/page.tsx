'use client';

import BottomSheet from '@/components/shared/bottom-sheet';
import Button from '@/components/ui/button';
import { useState } from 'react';

const BottomSheetExample = () => {
  const [isBasicOpen, setIsBasicOpen] = useState(false);
  const [isCustomContentOpen, setIsCustomContentOpen] = useState(false);
  const [isAutoHeightOpen, setIsAutoHeightOpen] = useState(false);
  const [isHalfHeightOpen, setIsHalfHeightOpen] = useState(false);
  const [isFullHeightOpen, setIsFullHeightOpen] = useState(false);
  const [isWithButtonsOpen, setIsWithButtonsOpen] = useState(false);

  return (
    <div className='flex flex-col gap-4 p-4'>
      <h1 className='text-heading-01 font-bold'>BottomSheet 예시</h1>

      <div className='flex flex-col gap-3'>
        <Button variant='default' onClick={() => setIsBasicOpen(true)}>
          기본 BottomSheet
        </Button>

        <Button variant='default' onClick={() => setIsCustomContentOpen(true)}>
          커스텀 컨텐츠
        </Button>

        <Button variant='default' onClick={() => setIsAutoHeightOpen(true)}>
          Auto 높이
        </Button>

        <Button variant='default' onClick={() => setIsHalfHeightOpen(true)}>
          Half 높이
        </Button>

        <Button variant='default' onClick={() => setIsFullHeightOpen(true)}>
          Full 높이
        </Button>

        <Button variant='default' onClick={() => setIsWithButtonsOpen(true)}>
          확인/취소 버튼
        </Button>
      </div>

      {/* 기본 BottomSheet */}
      <BottomSheet
        isOpen={isBasicOpen}
        onClose={() => setIsBasicOpen(false)}
        confirmText='확인'
        onConfirm={() => console.log('확인 클릭')}
      >
        이것은 기본 BottomSheet입니다.
      </BottomSheet>

      {/* 커스텀 컨텐츠 */}
      <BottomSheet
        isOpen={isCustomContentOpen}
        onClose={() => setIsCustomContentOpen(false)}
        showConfirmButton={false}
      >
        <div className='flex flex-col gap-4'>
          <button className='w-full rounded-lg border border-gray-200 p-4 text-left hover:bg-gray-50'>
            옵션 1
          </button>
          <button className='w-full rounded-lg border border-gray-200 p-4 text-left hover:bg-gray-50'>
            옵션 2
          </button>
          <button className='w-full rounded-lg border border-gray-200 p-4 text-left hover:bg-gray-50'>
            옵션 3
          </button>
        </div>
      </BottomSheet>

      {/* Auto 높이 */}
      <BottomSheet
        isOpen={isAutoHeightOpen}
        onClose={() => setIsAutoHeightOpen(false)}
        height='auto'
      >
        내용에 맞춰 높이가 자동으로 조절됩니다.
      </BottomSheet>

      {/* Half 높이 */}
      <BottomSheet
        isOpen={isHalfHeightOpen}
        onClose={() => setIsHalfHeightOpen(false)}
        height='half'
      >
        <div className='space-y-4'>
          <p>화면의 50% 높이를 차지합니다.</p>
          <p>스크롤 가능한 영역입니다.</p>
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i}>항목 {i + 1}</p>
          ))}
        </div>
      </BottomSheet>

      {/* Full 높이 */}
      <BottomSheet
        isOpen={isFullHeightOpen}
        onClose={() => setIsFullHeightOpen(false)}
        height='full'
      >
        <div className='space-y-4'>
          <p>화면의 90% 높이를 차지합니다.</p>
          {Array.from({ length: 50 }).map((_, i) => (
            <p key={i}>항목 {i + 1}</p>
          ))}
        </div>
      </BottomSheet>

      {/* 확인/취소 버튼 */}
      <BottomSheet
        isOpen={isWithButtonsOpen}
        onClose={() => setIsWithButtonsOpen(false)}
        confirmText='진행'
        cancelText='취소'
        showCancelButton
        showConfirmButton
        onConfirm={() => console.log('진행')}
        onCancel={() => console.log('취소')}
      >
        이 작업을 진행하시겠습니까?
      </BottomSheet>
    </div>
  );
};

export default BottomSheetExample;

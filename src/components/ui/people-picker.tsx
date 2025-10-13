'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import WheelPicker from './wheel-picker';

interface PeoplePickerProps {
  onPeopleChange?: (people: { min: number; max: number | null }) => void;
  initialPeople?: {
    min: number;
    max: number | null;
  };
}

export default function PeoplePicker({
  onPeopleChange,
  initialPeople,
}: PeoplePickerProps) {
  // 최소 인원: 2명 ~ 29명 (고정)
  const minPeople = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => `${i + 2}명`);
  }, []);

  // 최대 인원: 제한없음, 3명 ~ 30명 (고정)
  const maxPeople = useMemo(() => {
    const options = ['제한없음'];
    for (let i = 3; i <= 30; i++) {
      options.push(`${i}명`);
    }
    return options;
  }, []);

  const [selectedMinIndex, setSelectedMinIndex] = useState(() => {
    if (initialPeople) {
      return Math.max(0, Math.min(27, initialPeople.min - 2));
    }
    return 0; // 2명
  });

  const [selectedMaxIndex, setSelectedMaxIndex] = useState(() => {
    if (initialPeople) {
      if (initialPeople.max === null) {
        return 0; // 제한없음
      } else if (initialPeople.max >= 3 && initialPeople.max <= 30) {
        return initialPeople.max - 2; // 3명=인덱스1, 4명=인덱스2, ..., 30명=인덱스28
      }
    }
    return 1; // 3명 (최소+1)
  });

  // 최소 인원 변경 시 최대 인원이 최소보다 작으면 자동으로 최소+1로 조정
  useEffect(() => {
    const minValue = selectedMinIndex + 2; // 실제 최소 인원
    const maxValue = selectedMaxIndex === 0 ? null : selectedMaxIndex + 2; // 실제 최대 인원

    // 최대가 제한없음이 아니고, 최소보다 작거나 같으면 최소+1로 설정
    if (maxValue !== null && maxValue <= minValue) {
      setSelectedMaxIndex(minValue - 1); // minValue+1명 = 인덱스 minValue-1
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMinIndex]); // selectedMinIndex만 추적하여 무한 루프 방지

  const handleMaxChange = useCallback(
    (index: number) => {
      setSelectedMaxIndex(index);

      // 제한없음이 아닐 때만 검사
      if (index !== 0) {
        const maxValue = index + 2; // 선택하려는 최대 인원 (실제 값)
        const minValue = selectedMinIndex + 2; // 현재 최소 인원 (실제 값)

        // 최대가 최소보다 작거나 같으면 최소를 최대-1로 설정
        if (maxValue <= minValue) {
          const newMinValue = maxValue - 1; // 새 최소값 (실제 값)
          const newMinIndex = newMinValue - 2; // 새 최소 인덱스
          // 인덱스가 유효 범위(0-27) 내인지 확인
          if (newMinIndex >= 0 && newMinIndex <= 27) {
            setSelectedMinIndex(newMinIndex);
          }
        }
      }
    },
    [selectedMinIndex]
  );

  useEffect(() => {
    if (onPeopleChange) {
      const min = selectedMinIndex + 2;
      const max = selectedMaxIndex === 0 ? null : selectedMaxIndex + 2;
      onPeopleChange({ min, max });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMinIndex, selectedMaxIndex]);

  return (
    <div className='flex flex-col'>
      <h2 className='text-title-02 font-semibold'>모임인원</h2>
      <span className='mb-s-24 text-body-02 text-text-neutral'>
        본인을 포함한 총 인원을 선택해주세요
      </span>

      <div className='overflow-hidden rounded-8 border border-line-neutral'>
        <div className='flex items-center bg-bg-normal px-s-12 py-s-8'>
          <div className='flex flex-1 justify-center'>
            <span className='font-regular text-label-m text-text-alternative'>
              최소
            </span>
          </div>
          <div className='flex w-[40px] items-center justify-center' />
          <div className='flex flex-1 justify-center'>
            <span className='font-regular text-label-m text-text-alternative'>
              최대
            </span>
          </div>
        </div>

        <div className='relative flex'>
          <div
            className='pointer-events-none absolute left-0 right-0 z-10 bg-primary-50'
            style={{
              top: '96px',
              height: '48px',
            }}
          />

          <div className='flex-1'>
            <WheelPicker
              items={minPeople}
              selectedIndex={selectedMinIndex}
              onChange={setSelectedMinIndex}
              showHighlight={false}
              infinite
            />
          </div>

          <div className='flex w-[40px] items-center justify-center'>
            <span className='text-body-1 relative z-20 font-semibold text-primary-800'>
              ~
            </span>
          </div>

          <div className='flex-1'>
            <WheelPicker
              items={maxPeople}
              selectedIndex={selectedMaxIndex}
              onChange={handleMaxChange}
              showHighlight={false}
              infinite
            />
          </div>
        </div>
      </div>
    </div>
  );
}

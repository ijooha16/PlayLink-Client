'use client';

import { useState, useEffect, useMemo } from 'react';
import WheelPicker from './wheel-picker';

interface PeoplePickerProps {
  onPeopleChange?: (people: { min: number; max: number }) => void;
  initialPeople?: {
    min: number;
    max: number;
  };
}

export default function PeoplePicker({ onPeopleChange, initialPeople }: PeoplePickerProps) {
  // 인원 데이터 생성 (2명부터 시작) - 메모이제이션
  const people = useMemo(() => {
    return Array.from({ length: 99 }, (_, i) => `${i + 2}명`);
  }, []);

  // 초기값 계산
  const initialValues = useMemo(() => {
    if (initialPeople) {
      return {
        minIndex: Math.max(0, initialPeople.min - 2), // 2명이 인덱스 0
        maxIndex: Math.max(0, initialPeople.max - 2),
      };
    }
    return {
      minIndex: 0, // 2명
      maxIndex: 0, // 2명
    };
  }, [initialPeople]);

  const [selectedMinIndex, setSelectedMinIndex] = useState(initialValues.minIndex);
  const [selectedMaxIndex, setSelectedMaxIndex] = useState(initialValues.maxIndex);

  // initialPeople이 변경되면 인덱스 업데이트
  useEffect(() => {
    setSelectedMinIndex(initialValues.minIndex);
    setSelectedMaxIndex(initialValues.maxIndex);
  }, [initialValues]);

  // 최소값이 최대값보다 클 경우 최대값 조정
  useEffect(() => {
    if (selectedMinIndex > selectedMaxIndex) {
      setSelectedMaxIndex(selectedMinIndex);
    }
  }, [selectedMinIndex, selectedMaxIndex]);

  // 값이 변경될 때마다 부모에게 알림
  useEffect(() => {
    if (onPeopleChange) {
      const min = selectedMinIndex + 2;
      const max = selectedMaxIndex + 2;
      onPeopleChange({
        min,
        max: Math.max(min, max), // 최소값보다 작지 않도록 보장
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMinIndex, selectedMaxIndex]);

  return (
    <div className='flex flex-col'>
      <h2 className='text-title-02 mb-s-24 font-semibold'>모임인원</h2>

      <div className='rounded-8 border border-line-neutral overflow-hidden'>
        {/* 헤더 */}
        <div className='flex items-center bg-bg-normal px-s-12 py-s-8'>
          <div className='flex flex-1 justify-center'>
            <span className='text-label-m font-regular text-text-alternative'>최소</span>
          </div>
          <div className='flex w-[40px] items-center justify-center' />
          <div className='flex flex-1 justify-center'>
            <span className='text-label-m font-regular text-text-alternative'>최대</span>
          </div>
        </div>

        {/* 휠 피커 */}
        <div className='relative flex'>
          {/* 전체 선택 영역 하이라이트 */}
          <div
            className='pointer-events-none absolute left-0 right-0 z-10 bg-primary-50'
            style={{
              top: '96px', // paddingCount(2) * itemHeight(48)
              height: '48px',
            }}
          />

          {/* 최소 인원 */}
          <div className='flex-1'>
            <WheelPicker
              items={people}
              selectedIndex={selectedMinIndex}
              onChange={setSelectedMinIndex}
              showHighlight={false}
              infinite
            />
          </div>

          {/* 가운데 ~ */}
          <div className='flex w-[40px] items-center justify-center'>
            <span className='relative z-20 text-body-1 font-semibold text-primary-800'>~</span>
          </div>

          {/* 최대 인원 */}
          <div className='flex-1'>
            <WheelPicker
              items={people}
              selectedIndex={selectedMaxIndex}
              onChange={setSelectedMaxIndex}
              showHighlight={false}
              infinite
            />
          </div>
        </div>
      </div>
    </div>
  );
}

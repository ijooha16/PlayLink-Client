'use client';

import { useState, useEffect } from 'react';
import SelectableCard from './selectable-card';

interface GenderPickerProps {
  onGenderChange?: (gender: string) => void;
  initialGender?: string;
}

const GENDERS = [
  { id: 'male', label: '남성' },
  { id: 'female', label: '여성' },
  { id: 'all', label: '제한없음' },
];

export default function GenderPicker({ onGenderChange, initialGender = '' }: GenderPickerProps) {
  const [selectedGender, setSelectedGender] = useState<string>(initialGender);

  // initialGender이 변경되면 업데이트
  useEffect(() => {
    setSelectedGender(initialGender);
  }, [initialGender]);

  // 성별 선택 (단일 선택)
  const handleGenderSelect = (id: string) => {
    setSelectedGender(id);
  };

  // 값이 변경될 때마다 부모에게 알림
  useEffect(() => {
    if (onGenderChange) {
      onGenderChange(selectedGender);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGender]);

  return (
    <div className='flex flex-col'>
      <h2 className='text-title-02 font-semibold text-text-strong'>성별</h2>
      <p className='font-regular mb-s-24 text-body-02 text-text-netural'>
        참여 가능한 성별을 선택해주세요.
      </p>

      <div className='flex flex-col gap-s-16'>
        {GENDERS.map((gender) => (
          <SelectableCard
            key={gender.id}
            id={gender.id}
            title={gender.label}
            showIcon={false}
            checkType='check-icon'
            isSelected={selectedGender === gender.id}
            onClick={() => handleGenderSelect(gender.id)}
          />
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import SelectableCard from './selectable-card';

interface AgePickerProps {
  onAgeChange?: (ages: string[]) => void;
  initialAges?: string[];
}

const AGE_GROUPS = [
  { id: '20s', label: '20대' },
  { id: '30s', label: '30대' },
  { id: '40s', label: '40대' },
  { id: '50s', label: '50대 이상' },
];

export default function AgePicker({ onAgeChange, initialAges = [] }: AgePickerProps) {
  const [selectedAges, setSelectedAges] = useState<string[]>(initialAges);

  // initialAges이 변경되면 업데이트
  useEffect(() => {
    setSelectedAges(initialAges);
  }, [initialAges]);

  // 연령대 토글 (다중 선택)
  const handleAgeToggle = (id: string) => {
    setSelectedAges((prev) => {
      if (prev.includes(id)) {
        return prev.filter((ageId) => ageId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // 값이 변경될 때마다 부모에게 알림
  useEffect(() => {
    if (onAgeChange) {
      onAgeChange(selectedAges);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAges]);

  return (
    <div className='flex flex-col'>
      <h2 className='text-title-02 font-semibold text-text-strong'>연령대</h2>
      <p className='font-regular mb-s-24 text-body-02 text-text-netural'>
        참여 가능한 연령대를 모두 선택해주세요.
      </p>

      <div className='flex flex-col gap-s-16'>
        {AGE_GROUPS.map((age) => (
          <SelectableCard
            key={age.id}
            id={age.id}
            title={age.label}
            showIcon={false}
            isSelected={selectedAges.includes(age.id)}
            onClick={() => handleAgeToggle(age.id)}
          />
        ))}
      </div>
    </div>
  );
}

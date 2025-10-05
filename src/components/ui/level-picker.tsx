'use client';

import { useEffect, useState } from 'react';
import SelectableCard from './selectable-card';

interface LevelPickerProps {
  onLevelChange?: (levels: string[]) => void;
  initialLevels?: string[];
}

const LEVELS = [
  {
    id: 'lv1',
    label: 'Lv1. 입문',
    icon: '/images/medal/ic_level_1.svg',
    description: '운동을 거의 처음 시작해요.',
  },
  {
    id: 'lv2',
    label: 'Lv2. 초보',
    icon: '/images/medal/ic_level_2.svg',
    description: '기본적인 운동을 할 수 있어요.',
  },
  {
    id: 'lv3',
    label: 'Lv3. 중급',
    icon: '/images/medal/ic_level_3.svg',
    description: '기본 이상 난이도의 운동을 할 수 있어요.',
  },
  {
    id: 'lv4',
    label: 'Lv4. 고급',
    icon: '/images/medal/ic_level_4.svg',
    description: '높은 강도의 운동을 할 수 있어요.',
  },
  {
    id: 'lv5',
    label: 'Lv5. 매니아',
    icon: '/images/medal/ic_level_5.svg',
    description: '전문적인 수준의 운동이 가능해요.',
  },
];

export default function LevelPicker({
  onLevelChange,
  initialLevels = [],
}: LevelPickerProps) {
  const [selectedLevels, setSelectedLevels] = useState<string[]>(initialLevels);

  // initialLevels이 변경되면 업데이트
  useEffect(() => {
    setSelectedLevels(initialLevels);
  }, [initialLevels]);

  // 레벨 토글
  const handleLevelToggle = (id: string) => {
    setSelectedLevels((prev) => {
      if (prev.includes(id)) {
        return prev.filter((levelId) => levelId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // 값이 변경될 때마다 부모에게 알림
  useEffect(() => {
    if (onLevelChange) {
      onLevelChange(selectedLevels);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLevels]);

  return (
    <div className='flex flex-col'>
      <h2 className='text-title-02 font-semibold text-text-strong'>
        운동 레벨
      </h2>
      <p className='font-regular mb-s-24 text-body-02 text-text-netural'>
        참여 가능한 레벨을 모두 선택해주세요.
      </p>

      <div className='flex flex-col gap-s-16'>
        {LEVELS.map((level) => (
          <SelectableCard
            key={level.id}
            id={level.id}
            title={level.label}
            description={level.description}
            icon={level.icon}
            iconType='image'
            isSelected={selectedLevels.includes(level.id)}
            onClick={() => handleLevelToggle(level.id)}
          />
        ))}
      </div>
    </div>
  );
}

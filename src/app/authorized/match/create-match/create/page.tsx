'use client';

import BottomSheet from '@/components/shared/bottom-sheet';
import {
  BubbleChat,
  Calendar,
  LocationLarge,
  Sort,
  UserLove,
  UserMulti,
} from '@/components/shared/icons';
import AgePicker from '@/components/ui/age-picker';
import Button from '@/components/ui/button';
import DateTimePicker from '@/components/ui/date-time-picker';
import GenderPicker from '@/components/ui/gender-picker';
import LevelPicker from '@/components/ui/level-picker';
import LocationPicker from '@/components/ui/location-picker';
import PeoplePicker from '@/components/ui/people-picker';
import SelectButton from '@/components/ui/select-button';
import { PATHS } from '@/constant';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CreateMatchPage = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedPeople, setSelectedPeople] = useState('');

  // BottomSheet 상태
  const [isDateTimeOpen, setIsDateTimeOpen] = useState(false);
  const [tempDateTime, setTempDateTime] = useState({
    date: '',
    hour: '',
    minute: '',
    year: 0,
    month: 0,
    day: 0,
  });

  const [isPeopleOpen, setIsPeopleOpen] = useState(false);
  const [tempPeople, setTempPeople] = useState({
    min: 2,
    max: 2,
  });

  const [isLevelOpen, setIsLevelOpen] = useState(false);
  const [tempLevels, setTempLevels] = useState<string[]>([]);

  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [tempGender, setTempGender] = useState<string>('');

  const [isAgeOpen, setIsAgeOpen] = useState(false);
  const [tempAges, setTempAges] = useState<string[]>([]);

  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState<string>('');

  // 레벨명 매핑
  const LEVEL_NAMES = ['입문', '초보', '중급', '고급', '매니아'];
  const GENDER_MAP: Record<string, string> = {
    male: '남성',
    female: '여성',
    all: '제한없음',
  };
  const AGE_MAP: Record<string, string> = {
    '20s': '20대',
    '30s': '30대',
    '40s': '40대',
    '50s': '50대 이상',
  };

  // 구분자로 레이블 조인
  const joinLabels = (labels: string[]) => (
    <>
      {labels.map((label, idx) => (
        <span key={idx}>
          {label}
          {idx < labels.length - 1 && (
            <span className='text-text-alternative'> | </span>
          )}
        </span>
      ))}
    </>
  );

  const getLevelDisplayText = () => {
    if (tempLevels.length === 0) return '상관없음';
    const labels = tempLevels
      .map((id) => {
        const match = id.match(/lv(\d+)/);
        return match ? LEVEL_NAMES[parseInt(match[1]) - 1] : '';
      })
      .filter(Boolean);
    return joinLabels(labels);
  };

  const getGenderDisplayText = () => {
    return !tempGender ? '상관없음' : GENDER_MAP[tempGender] || '상관없음';
  };

  const getAgeDisplayText = () => {
    if (tempAges.length === 0) return '상관없음';
    if (tempAges.length === 4) return '제한없음';
    return joinLabels(tempAges.map((id) => AGE_MAP[id] || '').filter(Boolean));
  };

  return (
    <div className='flex flex-col gap-s-16 pt-s-24'>
      {/* 언제 만날까요? */}
      <div className='flex flex-col gap-s-12'>
        <label className='text-body-1 font-medium'>언제 만날까요?</label>
        <SelectButton
          icon={
            <Calendar
              size={24}
              className='text-icon-neutral'
              style={{ strokeWidth: 1.5 }}
            />
          }
          placeholder='날짜와 시간을 선택해 주세요.'
          value={selectedDate}
          onClick={() => setIsDateTimeOpen(true)}
        />
      </div>

      {/* 인원을 알려주세요! */}
      <div className='flex flex-col gap-s-12'>
        <label className='text-body-1 font-medium'>인원을 알려주세요!</label>
        <SelectButton
          icon={
            <UserMulti
              size={24}
              className='text-icon-neutral'
              style={{ strokeWidth: 1.5 }}
            />
          }
          placeholder='최소 2명 | 최대 n명'
          value={selectedPeople}
          onClick={() => setIsPeopleOpen(true)}
        />
      </div>

      {/* 어떤 멤버를 모을까요? */}
      <div className='flex flex-col gap-s-12'>
        <label className='text-body-1 font-medium'>어떤 멤버를 모을까요?</label>

        {/* 운동레벨 */}
        <SelectButton
          icon={
            <Sort
              size={24}
              className='text-icon-neutral'
              style={{ strokeWidth: 1.5 }}
            />
          }
          placeholder='운동레벨'
          subText={getLevelDisplayText()}
          defaultSubText='상관없음'
          onClick={() => setIsLevelOpen(true)}
        />

        {/* 성별 */}
        <SelectButton
          icon={
            <UserLove
              size={24}
              className='text-icon-neutral'
              style={{ strokeWidth: 1.5 }}
            />
          }
          placeholder='성별'
          subText={getGenderDisplayText()}
          defaultSubText='상관없음'
          onClick={() => setIsGenderOpen(true)}
        />

        {/* 연령대 */}
        <SelectButton
          icon={
            <BubbleChat
              size={24}
              className='text-icon-neutral'
              style={{ strokeWidth: 1.5 }}
            />
          }
          placeholder='연령대'
          subText={getAgeDisplayText()}
          defaultSubText='상관없음'
          onClick={() => setIsAgeOpen(true)}
        />
      </div>

      {/* 어디서 만날까요? */}
      <div className='flex flex-col gap-s-12'>
        <label className='text-body-1 font-medium'>어디서 만날까요?</label>
        <SelectButton
          icon={
            <LocationLarge
              size={24}
              className='text-icon-neutral'
              style={{ strokeWidth: 1.5 }}
            />
          }
          placeholder='장소를 선택해주세요'
          value={tempLocation}
          onClick={() => setIsLocationOpen(true)}
        />
      </div>

      {/* 모임 일시 선택 BottomSheet */}
      <BottomSheet
        isOpen={isDateTimeOpen}
        onClose={() => setIsDateTimeOpen(false)}
        height='auto'
        showConfirmButton
        showCancelButton={false}
        confirmText='선택'
        onConfirm={() => {
          const dateObj = new Date(
            tempDateTime.year,
            tempDateTime.month - 1,
            tempDateTime.day,
            parseInt(tempDateTime.hour),
            parseInt(tempDateTime.minute)
          );
          setSelectedDate(format(dateObj, 'yyyy년 MM월 dd일 HH:mm'));
          setIsDateTimeOpen(false);
        }}
      >
        <DateTimePicker
          key={isDateTimeOpen ? 'open' : 'closed'}
          onDateTimeChange={(dateTime) => setTempDateTime(dateTime)}
          initialDateTime={
            tempDateTime.year > 0
              ? {
                  year: tempDateTime.year,
                  month: tempDateTime.month,
                  day: tempDateTime.day,
                  hour: tempDateTime.hour,
                  minute: tempDateTime.minute,
                }
              : undefined
          }
        />
      </BottomSheet>

      {/* 모임 인원 선택 BottomSheet */}
      <BottomSheet
        isOpen={isPeopleOpen}
        onClose={() => setIsPeopleOpen(false)}
        height='auto'
        showConfirmButton
        showCancelButton={false}
        confirmText='선택'
        onConfirm={() => {
          // 선택된 인원을 "최소 n명 | 최대 n명" 형식으로 저장
          const formattedPeople = `최소 ${tempPeople.min}명 | 최대 ${tempPeople.max}명`;
          setSelectedPeople(formattedPeople);
          setIsPeopleOpen(false);
        }}
      >
        <PeoplePicker
          key={isPeopleOpen ? 'open' : 'closed'}
          onPeopleChange={(people) => setTempPeople(people)}
          initialPeople={tempPeople.min > 0 ? tempPeople : undefined}
        />
      </BottomSheet>

      {/* 운동 레벨 선택 BottomSheet */}
      <BottomSheet
        isOpen={isLevelOpen}
        onClose={() => setIsLevelOpen(false)}
        height='auto'
        showConfirmButton
        showCancelButton={false}
        confirmText='선택'
        onConfirm={() => {
          setIsLevelOpen(false);
        }}
      >
        <LevelPicker
          key={isLevelOpen ? 'open' : 'closed'}
          onLevelChange={(levels) => setTempLevels(levels)}
          initialLevels={tempLevels}
        />
      </BottomSheet>

      {/* 성별 선택 BottomSheet */}
      <BottomSheet
        isOpen={isGenderOpen}
        onClose={() => setIsGenderOpen(false)}
        height='auto'
        showConfirmButton
        showCancelButton={false}
        confirmText='선택'
        onConfirm={() => {
          setIsGenderOpen(false);
        }}
      >
        <GenderPicker
          key={isGenderOpen ? 'open' : 'closed'}
          onGenderChange={(gender) => setTempGender(gender)}
          initialGender={tempGender}
        />
      </BottomSheet>

      {/* 연령대 선택 BottomSheet */}
      <BottomSheet
        isOpen={isAgeOpen}
        onClose={() => setIsAgeOpen(false)}
        height='auto'
        showConfirmButton
        showCancelButton={false}
        confirmText='선택'
        onConfirm={() => {
          setIsAgeOpen(false);
        }}
      >
        <AgePicker
          key={isAgeOpen ? 'open' : 'closed'}
          onAgeChange={(ages) => setTempAges(ages)}
          initialAges={tempAges}
        />
      </BottomSheet>

      {/* 장소 선택 BottomSheet */}
      <BottomSheet
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        height='full'
        showConfirmButton={false}
        showCancelButton={false}
      >
        <LocationPicker
          key={isLocationOpen ? 'open' : 'closed'}
          onLocationChange={(location) => setTempLocation(location)}
          initialLocation={tempLocation}
          onClose={() => setIsLocationOpen(false)}
        />
      </BottomSheet>
      {!isDateTimeOpen &&
        !isPeopleOpen &&
        !isLevelOpen &&
        !isGenderOpen &&
        !isAgeOpen &&
        !isLocationOpen && (
          <Button
            isFloat
            onClick={() =>
              router.push(`${PATHS.MATCH.CREATE_MATCH}/description`)
            }
          >
            다음
          </Button>
        )}
    </div>
  );
};

export default CreateMatchPage;

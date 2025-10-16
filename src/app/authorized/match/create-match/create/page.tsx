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
import LocationPicker, { LocationData } from '@/components/ui/location-picker';
import PeoplePicker from '@/components/ui/people-picker';
import SelectButton from '@/components/ui/select-button';
import { AGE_MAP, GENDER_MAP, LEVEL_NAMES, PATHS } from '@/constant';
import {
  validateDateTime,
  validateLocation,
  validatePeople,
} from '@/libs/valid/match';
import useCreateMatchStore, {
  bitFlagToAges,
  bitFlagToLevels,
  numberToGender,
} from '@/store/use-create-match-store';
import { toast } from '@/utills/toast';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CreateMatchPage = () => {
  const router = useRouter();
  const {
    matchData,
    updateDateTime,
    updatePeople,
    updateLevels,
    updateGender,
    updateGeneration,
    updateLocation,
  } = useCreateMatchStore();

  const [selectedDate, setSelectedDate] = useState(matchData.date);
  const [selectedPeople, setSelectedPeople] = useState(
    matchData.maxSize === null
      ? `최소 ${matchData.leastSize}명 | 최대 제한없음`
      : `최소 ${matchData.leastSize}명 | 최대 ${matchData.maxSize}명`
  );

  console.log(matchData);

  // BottomSheet 상태 - 하나의 상태로 통합
  const [openSheet, setOpenSheet] = useState<
    'dateTime' | 'people' | 'level' | 'gender' | 'age' | 'location' | null
  >(null);

  const [tempDateTime, setTempDateTime] = useState({
    date: '',
    hour: '',
    minute: '',
    year: 0,
    month: 0,
    day: 0,
  });

  const [tempPeople, setTempPeople] = useState<{
    min: number;
    max: number | null;
  }>({
    min: 2,
    max: 2,
  });

  const [tempLevels, setTempLevels] = useState<string[]>(
    bitFlagToLevels(matchData.matchLevel)
  );
  const [tempGender, setTempGender] = useState<string>(
    numberToGender(matchData.gender)
  );
  const [tempAges, setTempAges] = useState<string[]>(
    bitFlagToAges(matchData.generation)
  );
  const [tempLocation, setTempLocation] = useState<LocationData | null>(matchData.location);

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
    if (tempLevels.length === LEVEL_NAMES.length) return '제한없음';

    const labels = tempLevels
      .map((id) => {
        const match = id.match(/lv(\d+)/);
        return match ? LEVEL_NAMES[parseInt(match[1]) - 1] : '';
      })
      .filter(Boolean);
    return joinLabels(labels);
  };

  const getGenderDisplayText = () => {
    return !tempGender
      ? '상관없음'
      : GENDER_MAP[tempGender as keyof typeof GENDER_MAP] || '상관없음';
  };

  const getAgeDisplayText = () => {
    if (tempAges.length === 0) return '상관없음';
    if (tempAges.length === 4) return '제한없음';
    return joinLabels(
      tempAges
        .map((id) => AGE_MAP[id as keyof typeof AGE_MAP] || '')
        .filter(Boolean)
    );
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
          onClick={() => setOpenSheet('dateTime')}
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
          onClick={() => setOpenSheet('people')}
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
          onClick={() => setOpenSheet('level')}
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
          onClick={() => setOpenSheet('gender')}
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
          onClick={() => setOpenSheet('age')}
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
          value={tempLocation?.placeName || ''}
          onClick={() => setOpenSheet('location')}
        />
      </div>

      {/* 모임 일시 선택 BottomSheet */}
      <BottomSheet
        isOpen={openSheet === 'dateTime'}
        onClose={() => setOpenSheet(null)}
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
          const formattedDate = format(dateObj, 'yyyy년 MM월 dd일 HH:mm');
          setSelectedDate(formattedDate);

          // Store에 저장 (API 형식에 맞게)
          const date = format(dateObj, 'yyyy-MM-dd');
          const startHour = tempDateTime.hour.padStart(2, '0');
          const startMinute = tempDateTime.minute.padStart(2, '0');
          const startTime = `${startHour}:${startMinute}`;

          // endTime은 startTime에서 2시간 후로 기본 설정
          const endDate = new Date(dateObj);
          endDate.setHours(endDate.getHours() + 2);
          const endTime = format(endDate, 'HH:mm');

          updateDateTime(date, startTime, endTime);
        }}
      >
        <DateTimePicker
          key={openSheet === 'dateTime' ? 'open' : 'closed'}
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
        isOpen={openSheet === 'people'}
        onClose={() => setOpenSheet(null)}
        height='auto'
        showConfirmButton
        showCancelButton={false}
        confirmText='선택'
        onConfirm={() => {
          // 선택된 인원을 "최소 n명 | 최대 n명" 형식으로 저장
          const formattedPeople =
            tempPeople.max === null
              ? `최소 ${tempPeople.min}명 | 최대 제한없음`
              : `최소 ${tempPeople.min}명 | 최대 ${tempPeople.max}명`;
          setSelectedPeople(formattedPeople);
          updatePeople(tempPeople.min, tempPeople.max ?? 999);
        }}
      >
        <PeoplePicker
          key={openSheet === 'people' ? 'open' : 'closed'}
          onPeopleChange={(people) => setTempPeople(people)}
          initialPeople={tempPeople.min > 0 ? tempPeople : undefined}
        />
      </BottomSheet>

      {/* 운동 레벨 선택 BottomSheet */}
      <BottomSheet
        isOpen={openSheet === 'level'}
        onClose={() => setOpenSheet(null)}
        height='auto'
        showConfirmButton
        showCancelButton={false}
        confirmText='선택'
        onConfirm={() => {
          updateLevels(tempLevels);
        }}
      >
        <LevelPicker
          key={openSheet === 'level' ? 'open' : 'closed'}
          onLevelChange={(levels) => setTempLevels(levels)}
          initialLevels={tempLevels}
        />
      </BottomSheet>

      {/* 성별 선택 BottomSheet */}
      <BottomSheet
        isOpen={openSheet === 'gender'}
        onClose={() => setOpenSheet(null)}
        height='auto'
        showConfirmButton
        showCancelButton={false}
        confirmText='선택'
        onConfirm={() => {
          updateGender(tempGender);
        }}
      >
        <GenderPicker
          key={openSheet === 'gender' ? 'open' : 'closed'}
          onGenderChange={(gender) => setTempGender(gender)}
          initialGender={tempGender}
        />
      </BottomSheet>

      {/* 연령대 선택 BottomSheet */}
      <BottomSheet
        isOpen={openSheet === 'age'}
        onClose={() => setOpenSheet(null)}
        height='auto'
        showConfirmButton
        showCancelButton={false}
        confirmText='선택'
        onConfirm={() => {
          updateGeneration(tempAges);
        }}
      >
        <AgePicker
          key={openSheet === 'age' ? 'open' : 'closed'}
          onAgeChange={(ages) => setTempAges(ages)}
          initialAges={tempAges}
        />
      </BottomSheet>

      {/* 장소 선택 BottomSheet */}
      <BottomSheet
        isOpen={openSheet === 'location'}
        onClose={() => setOpenSheet(null)}
        height='full'
        showConfirmButton={false}
        showCancelButton={false}
      >
        <LocationPicker
          key={openSheet === 'location' ? 'open' : 'closed'}
          onLocationChange={(location) => {
            setTempLocation(location);
            updateLocation(location);
          }}
          initialLocation={tempLocation ?? undefined}
          onClose={() => setOpenSheet(null)}
        />
      </BottomSheet>
      {!openSheet && (
        <Button
          isFloat
          disabled={!selectedDate || !selectedPeople || !tempLocation}
          onClick={() => {
            // 날짜/시간 검증
            if (!selectedDate) {
              toast.error('날짜와 시간을 선택해 주세요.');
              return;
            }

            // store에 저장된 값 사용
            const { date, startTime, endTime } = matchData;

            const dateTimeError = validateDateTime(date, startTime, endTime);
            if (dateTimeError) {
              toast.error(dateTimeError);
              return;
            }

            // 인원 검증
            const peopleError = validatePeople(
              matchData.leastSize,
              matchData.maxSize
            );
            if (peopleError) {
              toast.error(peopleError);
              return;
            }

            // 장소 검증
            const locationError = validateLocation(tempLocation);
            if (locationError) {
              toast.error(locationError);
              return;
            }

            router.push(`${PATHS.MATCH.CREATE_MATCH}/description`);
          }}
        >
          다음
        </Button>
      )}
    </div>
  );
};

export default CreateMatchPage;

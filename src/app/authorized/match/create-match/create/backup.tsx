'use client';

import DatePickerModal from '@/components/forms/date-picker-modal';
import DropdownInput from '@/components/forms/dropdown-input';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { DUMMY_PLACE, PATHS } from '@/constant';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CreateMatchForm = () => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [leastSize, setLeastSize] = useState(0);
  const [maxSize, setMaxSize] = useState<number | ''>('');

  const generateTimeOptions = () => {
    const times = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 30) {
        const hour = i;
        const minute = j;
        const formattedMinute = minute < 10 ? `0${minute}` : minute;
        times.push(`${hour}:${formattedMinute}`);
      }
    }
    return times;
  };

  const handleNext = () => {
    if (!title.trim() || !date || !startTime || !endTime || !placeId) return;
    // TODO: Store에 저장
    router.replace(PATHS.MATCH.CREATE_MATCH + '/description');
  };

  const isFormValid = title.trim() && date && startTime && endTime && placeId;

  return (
    <>
      <div className='flex flex-col gap-s-16 pb-[80px]'>
        <div className='flex flex-col space-y-2'>
          <label className='text-label-l font-semibold text-text-strong'>
            제목
          </label>
          <Input
            type='text'
            variant={'default'}
            sizes={'md'}
            placeholder='모임 제목을 입력해주세요'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className='flex flex-col space-y-2'>
          <label className='text-label-l font-semibold text-text-strong'>
            날짜
          </label>
          <DatePickerModal selectedDate={date} onChange={setDate} />
        </div>

        <div className='flex flex-col space-y-2'>
          <label className='text-label-l font-semibold text-text-strong'>
            시간
          </label>
          <div className='grid grid-cols-2 gap-2'>
            <DropdownInput
              dummyData={generateTimeOptions()}
              keyword={startTime}
              setKeyword={setStartTime}
              placeholderText='시작 시간'
              isSearchable={false}
            />
            <DropdownInput
              dummyData={generateTimeOptions()}
              keyword={endTime}
              setKeyword={setEndTime}
              placeholderText='종료 시간'
              isSearchable={false}
            />
          </div>
        </div>

        <div className='flex flex-col space-y-2'>
          <label className='text-label-l font-semibold text-text-strong'>
            장소
          </label>
          <DropdownInput
            dummyData={DUMMY_PLACE}
            keyword={placeId}
            setKeyword={setPlaceId}
            placeholderText='장소를 검색해보세요'
          />
        </div>

        <div className='flex flex-col space-y-2'>
          <label className='text-label-l font-semibold text-text-strong'>
            함께할 인원
          </label>
          <div className='grid grid-cols-2 gap-2'>
            <div className='flex flex-col'>
              <label className='text-body-s text-text-alternative'>
                최소인원
              </label>
              <Input
                type='number'
                variant={'default'}
                sizes={'md'}
                placeholder='최소인원'
                value={leastSize}
                onChange={(e) => setLeastSize(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className='flex flex-col'>
              <div className='flex gap-2'>
                <label className='text-body-s text-text-alternative'>
                  최대인원
                </label>
                <div className='flex items-center gap-1'>
                  <input
                    id='maxSize'
                    type='checkbox'
                    onChange={() => setMaxSize(maxSize === 0 ? '' : 0)}
                    className='h-4 w-4 rounded border-gray-300'
                  />
                  <label htmlFor='maxSize' className='text-body-s'>
                    제한 없음
                  </label>
                </div>
              </div>
              <Input
                type='number'
                variant={'default'}
                sizes={'md'}
                placeholder='최대인원'
                disabled={maxSize === 0}
                value={maxSize === 0 ? '' : maxSize}
                onChange={(e) => setMaxSize(parseInt(e.target.value) || '')}
              />
            </div>
          </div>
        </div>
      </div>

      <Button
        variant='default'
        disabled={!isFormValid}
        onClick={handleNext}
        isFloat
      >
        다음
      </Button>
    </>
  );
};

export default CreateMatchForm;

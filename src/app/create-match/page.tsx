'use client';

import Input from '@/components/common/input';
import { DUMMY_PLACE } from '@/dummy-data/dummy-data';
import { FormEvent, useState } from 'react';
import { useAlertStore } from '@/stores/alert-store';
import { useRouter } from 'next/navigation';
  import DatePickerModal from '@/components/common/date-picker-modal';
import SelectExerciseModal from '@/components/common/select-exercise-modal';
import { useAddMatchMutation } from '@/hooks/react-query/match/use-add-match-mutation';
import { handleGetSessionStorage } from '@/utills/web-api';
import { timeFormat } from '@/utills/format/create-match-formats';
import DropdownInput from '@/components/view/create-match/dropdown-input';

const CreateMatch = () => {
  const token = handleGetSessionStorage();

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    contents: '',
    sportType: null as number | null,
    date: null as Date | null,
    startTime,
    endTime,
    leastSize: 0,
    maxSize: '' as number | '',
    place_id: '',
    placeAddress: placeId,
    placeLocation: '35.15001, 126.8742',
  });

  const { mutate: addMatch } = useAddMatchMutation();

  const router = useRouter();
  const openAlert = useAlertStore((state) => state.openAlert);

  // const isFormValid = Object.values(formData).every(Boolean);

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    openAlert(
      '매치 생성 완료!',
      `${formData.title} 매칭이 생성 되었습니다! 즐거운 운동되세요!`
    );

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'date' && value instanceof Date) {
        // Date를 ISO 문자열로 변환
        data.append(key, value.toISOString());
      } else if (key === 'startTime') {
        data.append(key, timeFormat(startTime));
      } else if (key === 'endTime') {
        data.append(key, timeFormat(endTime));
      } else if (key === 'placeAddress') {
        data.append(key, placeId);
      } else {
        data.append(key, value as string);
      }
    });

    addMatch(data);
    router.push('/');
  };

  return (
    <form
      className='mb-4 flex w-full flex-col gap-y-4'
      onSubmit={(e) => handleSubmit(e)}
    >
      <div className='flex flex-col space-y-2'>
        <label className='text-lg font-bold'>제목</label>
        <Input
          type='text'
          variant={'default'}
          sizes={'md'}
          placeholder='제목'
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      </div>
      <div className='flex flex-col space-y-2'>
        <label className='text-lg font-bold'>종목 선택</label>
        <SelectExerciseModal
          selectedSport={formData.sportType}
          onChange={(sportType: number | null) =>
            setFormData((prev) => ({ ...prev, sportType }))
          }
        />
      </div>
      <div className='flex flex-col space-y-2'>
        <label className='text-lg font-bold'>날짜 선택</label>
        <DatePickerModal
          selectedDate={formData.date}
          onChange={(date: Date | null) => {
            setFormData((prev) => ({ ...prev, date }));
          }}
        />
      </div>
      <div className='flex flex-col space-y-2'>
        <label className='text-lg font-bold'>시간 선택</label>
        <div className='grid grid-cols-2 gap-2'>
          <DropdownInput
            dummyData={generateTimeOptions()}
            keyword={startTime}
            setKeyword={(e: string) => {
              setFormData((prev) => ({ ...prev, startTime: e }));
              setStartTime(e);
            }}
            placeholderText='시작 시간'
            isSearchable={false}
          />
          <DropdownInput
            dummyData={generateTimeOptions()}
            keyword={endTime}
            setKeyword={(e: string) => {
              setFormData((prev) => ({ ...prev, endTime: e }));
              setEndTime(e);
            }}
            placeholderText='종료 시간'
            isSearchable={false}
          />
        </div>
      </div>
      <div className='flex flex-col space-y-2'>
        <label className='text-lg font-bold'>장소</label>
        <DropdownInput
          dummyData={DUMMY_PLACE}
          keyword={placeId}
          setKeyword={(e: string) => {
            setFormData((prev) => ({ ...prev, place_id: e }));
            setPlaceId(e);
          }}
          placeholderText='장소를 검색해보세요.'
        />
      </div>
      <div className='flex flex-col space-y-2'>
        <h3 className='text-lg font-bold'>함께할 인원</h3>
        <div className='grid grid-cols-2 gap-2'>
          <div className='flex flex-col'>
            <label className='text-sm'>최소인원</label>
            <Input
              type='number'
              variant={'default'}
              sizes={'md'}
              placeholder='최소인원'
              value={formData.leastSize}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  leastSize: parseInt(e.target.value),
                }))
              }
            />
          </div>
          <div className='flex flex-col'>
            <div className='flex gap-4'>
              <label className='text-sm'>최대인원</label>
              <div className='flex place-items-center gap-1'>
                <input
                  id='maxSize'
                  type='checkbox'
                  onChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      maxSize: prev.maxSize === 0 ? '' : 0,
                    }))
                  }
                  className='h-4 w-4 appearance-none rounded-full border-2 border-gray-300 checked:border-transparent checked:bg-blue-500'
                />
                <label htmlFor='maxSize' className='text-xs'>
                  인원수 제한 없음
                </label>
              </div>
            </div>
            <Input
              type='number'
              variant={'default'}
              sizes={'md'}
              placeholder='최대인원'
              disabled={formData.maxSize === 0}
              value={formData.maxSize === 0 ? '' : formData.maxSize}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  maxSize: parseInt(e.target.value),
                }))
              }
            />
          </div>
        </div>
      </div>
      <div className='flex flex-col space-y-2'>
        <label className='text-lg font-bold'>자세한 설명</label>
        <textarea
          value={formData.contents}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, contents: e.target.value }))
          }
          className='bg-transparnent h-32 w-full resize-none overflow-auto rounded-lg border border-gray-300 px-4 py-2 text-inherit placeholder-gray-400 focus:outline-none focus:ring-0'
          placeholder={`이 운동을 어떻게 즐기고자 하는지 설명해주세요. \n 이 매치에 대해 궁금해하는 사람들을 위해 자세히 소개해주세요.`}
        />
      </div>
      <button
        type='submit'
        // disabled={!isFormValid}
        className='fixed bottom-0 left-0 mx-4 my-4 h-12 w-[calc(100%-2rem)] rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white shadow-md transition-colors ease-in-out focus:bg-blue-700 disabled:bg-[#E7E9EC] disabled:text-[#BDC0C6]'
      >
        작성완료
      </button>
    </form>
  );
};

export default CreateMatch;

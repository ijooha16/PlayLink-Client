'use client';

import DropdownInput from '@/features/play-link/view/create-match/dropdown-input';
import Input from '@/shares/common-components/input';
import { DUMMY_PLACE, SPORTS_LIST } from '@/shares/dummy-data/dummy-data';
import { FormEvent, useState } from 'react';
import { useTempStore } from '@/shares/stores/temp-store';
import { useAlertStore } from '@/shares/stores/alert-store';
import { useRouter } from 'next/navigation';
import DatePickerModal from '@/shares/common-components/date-picker-modal';
import SelectExerciseModal from '@/shares/common-components/select-exercise-modal';

const CreateMatch = () => {
  const [sport, setSport] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedStart, setSelectedStart] = useState<string>('');
  const [selectedEnd, setSelectedEnd] = useState<string>('');
  const [place, setPlace] = useState<string>('');
  const [maxDisable, setMaxDisable] = useState<boolean>(false);
  const [minPeople, setMinPeople] = useState<string>('');
  const [maxPeople, setMaxPeople] = useState<string>('');
  const [explain, setExplain] = useState<string>('');
  const [title, setTitle] = useState<string>('');

  const router = useRouter();
  const createMatch = useTempStore((state) => state.addMatchCard);
  const openAlert = useAlertStore((state) => state.openAlert);

  const peopleCount: number | '제한 없음' | false = maxDisable
    ? '제한 없음'
    : maxPeople === ''
      ? false
      : Number(maxPeople);

  const isFormValid = [
    sport,
    selectedDate,
    selectedStart,
    selectedEnd,
    place,
    minPeople,
    peopleCount,
    explain,
  ].every(Boolean);

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
      `${title} 매칭이 생성 되었습니다! 즐거운 운동되세요!`
    );
    console.log({
      userId: '유저uuid',
      leastSize: minPeople,
      maxSize: peopleCount,
      placeId: place,
      placeAddress: '임시주소',
      placeLocation: '임시위도/경도',
      date: selectedDate,
      startTime: selectedStart,
      endTime: selectedEnd,
      sportType: sport,
      title: title,
      contents: explain,
      image: '이미지',
    });
    createMatch();
    router.push('/');
  };

  return (
    <form
      className='mx-auto flex max-w-md flex-col gap-y-4 p-4'
      onSubmit={(e) => handleSubmit(e)}
    >
      <div className='flex flex-col space-y-2'>
        <label className='text-lg font-bold'>제목</label>
        <Input
          type='text'
          variant={'default'}
          sizes={'md'}
          placeholder='제목'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className='flex flex-col space-y-2'>
        <label className='text-lg font-bold'>종목 선택</label>
        <SelectExerciseModal
          selectedSport={sport}
          onChange={(sport: number | null) => setSport(sport)}
        />
      </div>
      <div className='flex flex-col space-y-2'>
        <label className='text-lg font-bold'>날짜 선택</label>
        <DatePickerModal
          selectedDate={selectedDate}
          onChange={(date: Date | null) => setSelectedDate(date)}
        />
      </div>
      <div className='flex flex-col space-y-2'>
        <label className='text-lg font-bold'>시간 선택</label>
        <div className='grid grid-cols-2 gap-2'>
          <DropdownInput
            dummyData={generateTimeOptions()}
            keyword={selectedStart}
            setKeyword={setSelectedStart}
            placeholderText='시작 시간'
            isSearchable={false}
          />
          <DropdownInput
            dummyData={generateTimeOptions()}
            keyword={selectedEnd}
            setKeyword={setSelectedEnd}
            placeholderText='종료 시간'
            isSearchable={false}
          />
        </div>
      </div>
      <div className='flex flex-col space-y-2'>
        <label className='text-lg font-bold'>장소</label>
        <DropdownInput
          dummyData={DUMMY_PLACE}
          keyword={place}
          setKeyword={setPlace}
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
              value={minPeople}
              onChange={(e) => setMinPeople(e.target.value)}
            />
          </div>
          <div className='flex flex-col'>
            <div className='flex gap-4'>
              <label className='text-sm'>최대인원</label>
              <div className='flex place-items-center gap-1'>
                <input
                  id='maxLimit'
                  type='checkbox'
                  onChange={() => setMaxDisable(!maxDisable)}
                  className='h-4 w-4 appearance-none rounded-full border-2 border-gray-300 checked:border-transparent checked:bg-blue-500'
                />
                <label htmlFor='maxLimit' className='text-xs'>
                  인원수 제한 없음
                </label>
              </div>
            </div>
            <Input
              type='number'
              variant={'default'}
              sizes={'md'}
              placeholder='최대인원'
              disabled={maxDisable}
              value={maxDisable ? '' : maxPeople}
              onChange={(e) => setMaxPeople(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className='flex flex-col space-y-2'>
        <label className='text-lg font-bold'>자세한 설명</label>
        <textarea
          value={explain}
          onChange={(e) => setExplain(e.target.value)}
          className='bg-transparnent h-32 w-full resize-none overflow-auto rounded-lg border border-gray-300 px-4 py-2 text-inherit placeholder-gray-400 focus:outline-none focus:ring-0'
          placeholder='이 운동을 어떻게 즐기고자 하는지 설명해주세요. 이 매치에 대해 궁금해하는 사람들을 위해 자세히 소개해주세요.'
        />
      </div>
      <button
        type='submit'
        disabled={!isFormValid}
        className='mt-2 h-12 w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors ease-in-out focus:bg-blue-700 disabled:bg-[#E7E9EC] disabled:text-[#BDC0C6]'
      >
        작성완료
      </button>
    </form>
  );
};

export default CreateMatch;

'use client';

import { addDays, format } from 'date-fns';
import { useEffect, useMemo, useRef, useState } from 'react';
import WheelPicker from './wheel-picker';

interface DateTimePickerProps {
  onDateTimeChange?: (dateTime: {
    date: string;
    hour: string;
    minute: string;
    year: number;
    month: number;
    day: number;
  }) => void;
  initialDateTime?: {
    year: number;
    month: number;
    day: number;
    hour: string;
    minute: string;
  };
}

export default function DateTimePicker({
  onDateTimeChange,
  initialDateTime,
}: DateTimePickerProps) {
  // 날짜 데이터 생성 (오늘부터 365일) - 메모이제이션
  const dates = useMemo(() => {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const today = new Date();
    return Array.from({ length: 365 }, (_, i) => {
      const date = addDays(today, i);
      const weekday = weekdays[date.getDay()];
      return `${format(date, 'MM.dd')} (${weekday})`;
    });
  }, []);

  // 시간 데이터 생성 (00-23) - 메모이제이션
  const hours = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  }, []);

  // 분 데이터 생성 (00, 10, 20, 30, 40, 50) - 메모이제이션
  const minutes = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => String(i * 10).padStart(2, '0'));
  }, []);

  // 초기값 계산
  const initialValues = useMemo(() => {
    if (initialDateTime && initialDateTime.year > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const targetDate = new Date(
        initialDateTime.year,
        initialDateTime.month - 1,
        initialDateTime.day
      );
      targetDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor(
        (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      // 분을 10분 단위로 반올림하여 인덱스 계산 (0, 10, 20, 30, 40, 50 -> 0, 1, 2, 3, 4, 5)
      const minuteValue = parseInt(initialDateTime.minute, 10);
      const minuteIndex = Math.round(minuteValue / 10) % 6;

      return {
        dateIndex: Math.max(0, Math.min(364, daysDiff)),
        hourIndex: parseInt(initialDateTime.hour, 10),
        minuteIndex: minuteIndex,
      };
    }

    const now = new Date();
    // 현재 분을 10분 단위로 반올림하여 인덱스 계산
    const minuteIndex = Math.round(now.getMinutes() / 10) % 6;
    return {
      dateIndex: 0,
      hourIndex: now.getHours(),
      minuteIndex: minuteIndex,
    };
  }, [initialDateTime]);

  const [selectedDateIndex, setSelectedDateIndex] = useState(
    initialValues.dateIndex
  );
  const [selectedHourIndex, setSelectedHourIndex] = useState(
    initialValues.hourIndex
  );
  const [selectedMinuteIndex, setSelectedMinuteIndex] = useState(
    initialValues.minuteIndex
  );

  // 무한 루프 방지를 위한 ref
  const isAdjustingRef = useRef(false);

  // initialDateTime이 변경되면 인덱스 업데이트
  useEffect(() => {
    setSelectedDateIndex(initialValues.dateIndex);
    setSelectedHourIndex(initialValues.hourIndex);
    setSelectedMinuteIndex(initialValues.minuteIndex);
  }, [initialValues]);

  // 과거 시간 자동 조정 로직
  useEffect(() => {
    // 조정 중이면 리턴 (무한 루프 방지)
    if (isAdjustingRef.current) {
      isAdjustingRef.current = false;
      return;
    }

    // 오늘 날짜가 아니면 검증 불필요
    if (selectedDateIndex !== 0) {
      return;
    }

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // 선택한 시간 계산
    const selectedHour = selectedHourIndex;
    const selectedMinute = selectedMinuteIndex * 10; // 0, 10, 20, 30, 40, 50

    // 과거 시간인지 확인
    const isPast =
      selectedHour < currentHour ||
      (selectedHour === currentHour && selectedMinute < currentMinute);

    if (isPast) {
      // 조정 플래그 설정
      isAdjustingRef.current = true;

      // 현재 분을 10분 단위로 올림
      const adjustedMinuteIndex = Math.ceil(currentMinute / 10) % 6;

      // 분이 60분을 넘어가면 다음 시간으로
      let adjustedHourIndex = currentHour;
      let finalMinuteIndex = adjustedMinuteIndex;

      if (currentMinute >= 50) {
        // 50분 이상이면 다음 시간 00분으로
        adjustedHourIndex = (currentHour + 1) % 24;
        finalMinuteIndex = 0;
      }

      // 부드럽게 조정
      setSelectedHourIndex(adjustedHourIndex);
      setSelectedMinuteIndex(finalMinuteIndex);
    }
  }, [selectedDateIndex, selectedHourIndex, selectedMinuteIndex]);

  // 값이 변경될 때마다 부모에게 알림
  useEffect(() => {
    if (onDateTimeChange) {
      const selectedDate = addDays(new Date(), selectedDateIndex);
      onDateTimeChange({
        date: dates[selectedDateIndex],
        hour: hours[selectedHourIndex],
        minute: minutes[selectedMinuteIndex],
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateIndex, selectedHourIndex, selectedMinuteIndex]);

  return (
    <div className='flex flex-col'>
      <h2 className='mb-s-24 text-title-02 font-semibold'>모임 일시</h2>

      <div className='overflow-hidden rounded-8 border border-line-neutral'>
        <div className='flex'>
          {/* 날짜 컬럼 */}
          <div className='flex flex-1 flex-col'>
            <div className='flex justify-center bg-bg-normal px-s-12 py-s-8'>
              <span className='font-regular text-label-m text-text-alternative'>
                일시
              </span>
            </div>
            <WheelPicker
              items={dates}
              selectedIndex={selectedDateIndex}
              onChange={setSelectedDateIndex}
            />
          </div>

          {/* 시간 컬럼 */}
          <div className='flex flex-1 flex-col'>
            <div className='flex justify-center bg-bg-normal px-s-12 py-s-8'>
              <span className='font-regular text-label-m text-text-alternative'>
                시
              </span>
            </div>
            <WheelPicker
              items={hours}
              selectedIndex={selectedHourIndex}
              onChange={setSelectedHourIndex}
            />
          </div>

          {/* 분 컬럼 */}
          <div className='flex flex-1 flex-col'>
            <div className='flex justify-center bg-bg-normal px-s-12 py-s-8'>
              <span className='font-regular text-label-m text-text-alternative'>
                분
              </span>
            </div>
            <WheelPicker
              items={minutes}
              selectedIndex={selectedMinuteIndex}
              onChange={setSelectedMinuteIndex}
              infinite
            />
          </div>
        </div>
      </div>
    </div>
  );
}

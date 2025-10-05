'use client';

import { addDays, format } from 'date-fns';
import { useState, useEffect, useMemo } from 'react';
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

export default function DateTimePicker({ onDateTimeChange, initialDateTime }: DateTimePickerProps) {
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

  // 분 데이터 생성 (00-59) - 메모이제이션
  const minutes = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  }, []);

  // 초기값 계산
  const initialValues = useMemo(() => {
    if (initialDateTime && initialDateTime.year > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const targetDate = new Date(initialDateTime.year, initialDateTime.month - 1, initialDateTime.day);
      targetDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      return {
        dateIndex: Math.max(0, Math.min(364, daysDiff)),
        hourIndex: parseInt(initialDateTime.hour, 10),
        minuteIndex: parseInt(initialDateTime.minute, 10),
      };
    }

    const now = new Date();
    return { dateIndex: 0, hourIndex: now.getHours(), minuteIndex: now.getMinutes() };
  }, [initialDateTime]);

  const [selectedDateIndex, setSelectedDateIndex] = useState(initialValues.dateIndex);
  const [selectedHourIndex, setSelectedHourIndex] = useState(initialValues.hourIndex);
  const [selectedMinuteIndex, setSelectedMinuteIndex] = useState(initialValues.minuteIndex);

  // initialDateTime이 변경되면 인덱스 업데이트
  useEffect(() => {
    setSelectedDateIndex(initialValues.dateIndex);
    setSelectedHourIndex(initialValues.hourIndex);
    setSelectedMinuteIndex(initialValues.minuteIndex);
  }, [initialValues]);

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
      <h2 className='text-title-02 mb-s-24 font-semibold'>모임 일시</h2>

      <div className='rounded-8 border border-line-neutral overflow-hidden'>
        <div className='flex'>
          {/* 날짜 컬럼 */}
          <div className='flex flex-1 flex-col'>
            <div className='flex justify-center bg-bg-normal px-s-12 py-s-8'>
              <span className='text-label-m font-regular text-text-alternative'>일시</span>
            </div>
            <WheelPicker
              items={dates}
              selectedIndex={selectedDateIndex}
              onChange={setSelectedDateIndex}
              infinite
            />
          </div>

          {/* 시간 컬럼 */}
          <div className='flex flex-1 flex-col'>
            <div className='flex justify-center bg-bg-normal px-s-12 py-s-8'>
              <span className='text-label-m font-regular text-text-alternative'>시</span>
            </div>
            <WheelPicker
              items={hours}
              selectedIndex={selectedHourIndex}
              onChange={setSelectedHourIndex}
              infinite
            />
          </div>

          {/* 분 컬럼 */}
          <div className='flex flex-1 flex-col'>
            <div className='flex justify-center bg-bg-normal px-s-12 py-s-8'>
              <span className='text-label-m font-regular text-text-alternative'>분</span>
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

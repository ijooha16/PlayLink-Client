'use client';

import { addDays, format } from 'date-fns';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

type Selection = {
  dateIndex: number;
  hourIndex: number;
  minuteIndex: number;
};

const MINUTE_STEP = 10;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const isSameSelection = (a: Selection, b: Selection) =>
  a.dateIndex === b.dateIndex &&
  a.hourIndex === b.hourIndex &&
  a.minuteIndex === b.minuteIndex;

export default function DateTimePicker({
  onDateTimeChange,
  initialDateTime,
}: DateTimePickerProps) {
  const dates = useMemo(() => {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const today = new Date();
    return Array.from({ length: 365 }, (_, i) => {
      const date = addDays(today, i);
      const weekday = weekdays[date.getDay()];
      return `${format(date, 'MM.dd')} (${weekday})`;
    });
  }, []);

  const hours = useMemo(
    () => Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')),
    []
  );

  const minutes = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) =>
        String(i * MINUTE_STEP).padStart(2, '0')
      ),
    []
  );

  const startOfToday = useMemo(() => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    return base;
  }, []);

  const clampSelection = useCallback(
    (draft: Selection): Selection => ({
      dateIndex: clamp(draft.dateIndex, 0, dates.length - 1),
      hourIndex: clamp(draft.hourIndex, 0, hours.length - 1),
      minuteIndex: clamp(draft.minuteIndex, 0, minutes.length - 1),
    }),
    [dates.length, hours.length, minutes.length]
  );

  const toDate = useCallback(
    (selection: Selection) => {
      const base = new Date(startOfToday);
      base.setDate(base.getDate() + selection.dateIndex);
      base.setHours(
        selection.hourIndex,
        selection.minuteIndex * MINUTE_STEP,
        0,
        0
      );
      return base;
    },
    [startOfToday]
  );

  const shiftToNextInterval = useCallback(() => {
    const now = new Date();
    now.setSeconds(0, 0);
    const remainder = now.getMinutes() % MINUTE_STEP;
    if (remainder !== 0) {
      now.setMinutes(now.getMinutes() + (MINUTE_STEP - remainder));
    } else {
      now.setMinutes(now.getMinutes() + MINUTE_STEP);
    }

    const diffMs = now.getTime() - startOfToday.getTime();
    let dateIndex = Math.floor(diffMs / DAY_IN_MS);
    if (dateIndex < 0) dateIndex = 0;
    if (dateIndex >= dates.length) {
      return {
        dateIndex: dates.length - 1,
        hourIndex: hours.length - 1,
        minuteIndex: minutes.length - 1,
      };
    }

    return {
      dateIndex,
      hourIndex: now.getHours(),
      minuteIndex: Math.floor(now.getMinutes() / MINUTE_STEP) % minutes.length,
    };
  }, [dates.length, hours.length, minutes.length, startOfToday]);

  const ensureFutureIfToday = useCallback(
    (draft: Selection): Selection => {
      const normalized = clampSelection(draft);

      if (normalized.dateIndex !== 0) {
        return normalized;
      }

      const candidate = toDate(normalized);
      const now = new Date();

      if (candidate <= now) {
        const bumped = shiftToNextInterval();
        return clampSelection(bumped);
      }

      return normalized;
    },
    [clampSelection, shiftToNextInterval, toDate]
  );

  const selectionFromInitial = useCallback(
    (
      source?: {
        year: number;
        month: number;
        day: number;
        hour: string;
        minute: string;
      }
    ): Selection => {
      if (!source || source.year <= 0) {
        return ensureFutureIfToday(shiftToNextInterval());
      }

      const midnight = new Date(source.year, source.month - 1, source.day);
      midnight.setHours(0, 0, 0, 0);

      const diffMs = midnight.getTime() - startOfToday.getTime();
      const rawDateIndex = Math.floor(diffMs / DAY_IN_MS);
      const hourValue = parseInt(source.hour, 10);
      const minuteValue = parseInt(source.minute, 10);

      return ensureFutureIfToday({
        dateIndex: rawDateIndex,
        hourIndex: Number.isNaN(hourValue) ? 0 : hourValue,
        minuteIndex: Number.isNaN(minuteValue)
          ? 0
          : Math.floor(minuteValue / MINUTE_STEP),
      });
    },
    [ensureFutureIfToday, shiftToNextInterval, startOfToday]
  );

  const [selection, setSelection] = useState<Selection>(() =>
    selectionFromInitial(initialDateTime)
  );
  const [scrollSignals, setScrollSignals] = useState({
    date: 0,
    hour: 0,
    minute: 0,
  });

  const lastPropSignatureRef = useRef<string | null>(null);
  const lastEmittedSignatureRef = useRef<string>('EMPTY');

  useEffect(() => {
    if (!initialDateTime || initialDateTime.year <= 0) {
      lastPropSignatureRef.current = 'EMPTY';
      return;
    }

    const signature = `${initialDateTime.year}-${initialDateTime.month}-${initialDateTime.day}-${initialDateTime.hour}-${initialDateTime.minute}`;

    if (lastPropSignatureRef.current === signature) {
      return;
    }

    lastPropSignatureRef.current = signature;

    const nextSelection = selectionFromInitial(initialDateTime);
    setSelection((prev) =>
      isSameSelection(prev, nextSelection) ? prev : nextSelection
    );
  }, [initialDateTime, selectionFromInitial]);

  const updateSelection = useCallback(
    (partial: Partial<Selection>) => {
      setSelection((prev) => {
        const draft: Selection = {
          dateIndex: partial.dateIndex ?? prev.dateIndex,
          hourIndex: partial.hourIndex ?? prev.hourIndex,
          minuteIndex: partial.minuteIndex ?? prev.minuteIndex,
        };

        const adjusted = ensureFutureIfToday(draft);

        if (
          draft.dateIndex !== adjusted.dateIndex ||
          draft.hourIndex !== adjusted.hourIndex ||
          draft.minuteIndex !== adjusted.minuteIndex
        ) {
          setScrollSignals((signals) => ({
            date: signals.date + (draft.dateIndex !== adjusted.dateIndex ? 1 : 0),
            hour: signals.hour + (draft.hourIndex !== adjusted.hourIndex ? 1 : 0),
            minute:
              signals.minute +
              (draft.minuteIndex !== adjusted.minuteIndex ? 1 : 0),
          }));
        }

        return isSameSelection(prev, adjusted) ? prev : adjusted;
      });
    },
    [ensureFutureIfToday]
  );

  const handleDateChange = useCallback(
    (index: number) => updateSelection({ dateIndex: index }),
    [updateSelection]
  );

  const handleHourChange = useCallback(
    (index: number) => updateSelection({ hourIndex: index }),
    [updateSelection]
  );

  const handleMinuteChange = useCallback(
    (index: number) => updateSelection({ minuteIndex: index }),
    [updateSelection]
  );

  const { dateIndex, hourIndex, minuteIndex } = selection;

  useEffect(() => {
    if (!onDateTimeChange) return;

    const signature = `${dateIndex}-${hourIndex}-${minuteIndex}`;
    if (lastEmittedSignatureRef.current === signature) {
      return;
    }

    lastEmittedSignatureRef.current = signature;

    const selectedDate = addDays(startOfToday, dateIndex);
    onDateTimeChange({
      date: dates[dateIndex],
      hour: hours[hourIndex],
      minute: minutes[minuteIndex],
      year: selectedDate.getFullYear(),
      month: selectedDate.getMonth() + 1,
      day: selectedDate.getDate(),
    });
  }, [
    dateIndex,
    hourIndex,
    minuteIndex,
    onDateTimeChange,
    dates,
    hours,
    minutes,
    startOfToday,
  ]);

  return (
    <div className='flex flex-col'>
      <h2 className='mb-s-24 text-title-02 font-semibold'>모임 일시</h2>

      <div className='overflow-hidden rounded-8 border border-line-neutral'>
        <div className='flex'>
          <div className='flex flex-1 flex-col'>
            <div className='flex justify-center bg-bg-normal px-s-12 py-s-8'>
              <span className='font-regular text-label-m text-text-alternative'>
                일시
              </span>
            </div>
            <WheelPicker
              items={dates}
              selectedIndex={dateIndex}
              onChange={handleDateChange}
              scrollSignal={scrollSignals.date}
            />
          </div>

          <div className='flex flex-1 flex-col'>
            <div className='flex justify-center bg-bg-normal px-s-12 py-s-8'>
              <span className='font-regular text-label-m text-text-alternative'>
                시
              </span>
            </div>
            <WheelPicker
              items={hours}
              selectedIndex={hourIndex}
              onChange={handleHourChange}
              scrollSignal={scrollSignals.hour}
            />
          </div>

          <div className='flex flex-1 flex-col'>
            <div className='flex justify-center bg-bg-normal px-s-12 py-s-8'>
              <span className='font-regular text-label-m text-text-alternative'>
                분
              </span>
            </div>
            <WheelPicker
              items={minutes}
              selectedIndex={minuteIndex}
              onChange={handleMinuteChange}
              scrollSignal={scrollSignals.minute}
              infinite
            />
          </div>
        </div>
      </div>
    </div>
  );
}

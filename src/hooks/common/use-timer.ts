import { useState, useEffect } from 'react';

/**
 * useTimer 훅
 * 지정한 초기 시간(initialTime)부터 1초 단위로 감소하는 타이머를 제공합니다.
 *
 * @param {number} initialTime - 타이머의 시작 시간(초 단위)
 * @returns {{
 *   timeLeft: number;           // 남은 시간(초)
 *   isActive: boolean;          // 타이머 활성화 여부
 *   isTimeout: boolean;         // 타이머 만료 여부
 *   start: () => void;          // 타이머 시작 함수
 *   stop: () => void;           // 타이머 중지 함수
 *   formattedTime: string;      // "MM:SS" 형식의 남은 시간 문자열 (만료 시 "만료")
 * }}
 */
export const useTimer = (initialTime: number) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setIsActive(false);
            setIsTimeout(true);
          }
          return newTime;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isActive, timeLeft]);

  const start = () => {
    setTimeLeft(initialTime);
    setIsActive(true);
    setIsTimeout(false);
  };

  const stop = () => {
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const displaySeconds = Math.max(0, seconds); // 음수가 되지 않도록
    const minutes = Math.floor(displaySeconds / 60);
    const remainingSeconds = displaySeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return {
    timeLeft,
    isActive,
    isTimeout,
    start,
    stop,
    formattedTime: formatTime(timeLeft)
  };
};
'use client';

import { useEffect, useState } from 'react';

interface KeyboardAvoidingViewProps {
  children: React.ReactNode;
  className?: string;
}

export default function KeyboardAvoidingView({
  children,
  className = '',
}: KeyboardAvoidingViewProps) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      // iOS Safari 및 Android Chrome 모두 지원
      if (window.visualViewport) {
        const viewport = window.visualViewport;
        const keyboardHeight = Math.max(
          0,
          window.innerHeight - viewport.height - viewport.offsetTop
        );
        setKeyboardHeight(keyboardHeight);
      } else {
        // visualViewport를 지원하지 않는 경우 폴백
        const viewportHeight = window.innerHeight;
        const documentHeight = document.documentElement.clientHeight;
        const keyboardHeight = Math.max(0, documentHeight - viewportHeight);
        setKeyboardHeight(keyboardHeight);
      }
    };

    // 초기 설정
    handleResize();

    // 다양한 이벤트 리스너 등록
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      window.visualViewport.addEventListener('scroll', handleResize);
    }

    window.addEventListener('resize', handleResize);

    // 포커스 이벤트로도 감지
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach((input) => {
      input.addEventListener('focus', handleResize);
      input.addEventListener('blur', handleResize);
    });

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
        window.visualViewport.removeEventListener('scroll', handleResize);
      }
      window.removeEventListener('resize', handleResize);

      inputs.forEach((input) => {
        input.removeEventListener('focus', handleResize);
        input.removeEventListener('blur', handleResize);
      });
    };
  }, []);

  return (
    <div
      className={className}
      style={{
        paddingBottom: keyboardHeight > 0 ? `${keyboardHeight}px` : '0px',
        transition: 'padding-bottom 0.15s ease-out',
        minHeight: '100%',
      }}
    >
      {children}
    </div>
  );
}

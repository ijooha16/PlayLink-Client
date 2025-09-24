'use client';

import { useEffect, useState } from 'react';

export function useKakaoSdk(appKey: string) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.kakao?.maps?.services) {
      setReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => setReady(true));
    };
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [appKey]);

  return ready;
}

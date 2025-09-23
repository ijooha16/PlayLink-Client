'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    kakao: {
      maps: {
        Map: new (container: HTMLElement, options: any) => any;
        LatLng: new (lat: number, lng: number) => any;
        Marker: new (options: any) => any;
        load: (callback: () => void) => void;
      };
    };
  }
}

interface KakaoMapProps {
  lat?: number;
  lng?: number;
  zoom?: number;
  className?: string;
}

const KakaoMap = ({ 
  lat = 37.4979, 
  lng = 127.0276, 
  zoom = 3,
  className = 'h-[400px] w-full overflow-hidden rounded-md shadow-md sm:h-[500px]'
}: KakaoMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  useEffect(() => {
    // 카카오맵 API가 이미 로드되었는지 확인
    if (window.kakao && window.kakao.maps) {
      initializeMap();
      return;
    }

    // 카카오맵 API 스크립트 동적 로드
    const script = document.createElement('script');

    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY}&autoload=false`;
    script.async = true;
    
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(initializeMap);
      }
    };

    script.onerror = () => {
      console.error('카카오맵 API 로드에 실패했습니다. API 키를 확인해주세요.');
    };

    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 정리
      cleanup();
      
      // 스크립트 제거 (메모리 누수 방지)
      const scripts = document.head.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src.includes('dapi.kakao.com')) {
          document.head.removeChild(scripts[i]);
          break;
        }
      }
    };
  }, [lat, lng, zoom]);

  const initializeMap = () => {
    if (!mapRef.current || !window.kakao || !window.kakao.maps) {
      return;
    }

    // 기존 인스턴스 정리
    cleanup();

    try {
      // 지도 생성
      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(lat, lng),
        level: zoom,
      });

      // 마커 생성
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(lat, lng),
        map: map,
      });

      mapInstance.current = map;
      markerInstance.current = marker;
    } catch (error) {
      console.error('카카오맵 초기화 중 오류가 발생했습니다:', error);
    }
  };

  const cleanup = () => {
    if (markerInstance.current) {
      markerInstance.current.setMap(null);
      markerInstance.current = null;
    }
    if (mapInstance.current) {
      mapInstance.current = null;
    }
  };

  return (
    <div className={className}>
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
};

export default KakaoMap;
'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    naver: Record<string, unknown>;
  }
}

interface DynamicNaverMapForDetailProps {
  lat?: number;
  lng?: number;
}

const DynamicNaverMapForDetail = ({
  lat = 37.4979, // 강남역 기본 위도
  lng = 127.0276, // 강남역 기본 경도
}: DynamicNaverMapForDetailProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const naverMapInstance = useRef<Record<string, unknown> | null>(null);
  const naverMarkerInstance = useRef<Record<string, unknown> | null>(null);

  useEffect(() => {
    // 네이버 지도 스크립트가 이미 로드되었는지 확인
    if (window.naver && window.naver.maps) {
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`;
    script.async = true;
    script.onload = initializeMap;

    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 지도 인스턴스 및 마커 정리
      if (naverMapInstance.current) {
        (naverMapInstance.current as any).destroy();
        naverMapInstance.current = null;
      }
      if (naverMarkerInstance.current) {
        (naverMarkerInstance.current as any).setMap(null);
        naverMarkerInstance.current = null;
      }
      // 스크립트 제거 (선택 사항, 메모리 누수 방지)
      const scripts = document.head.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src.includes('oapi.map.naver.com')) {
          document.head.removeChild(scripts[i]);
          break;
        }
      }
    };
  }, [lat, lng]);

  const initializeMap = () => {
    if (mapRef.current && window.naver) {
      // 기존 지도 인스턴스 정리 (의존성 변경 시)
      if (naverMapInstance.current) {
        (naverMapInstance.current as any).destroy();
        naverMapInstance.current = null;
      }
      if (naverMarkerInstance.current) {
        (naverMarkerInstance.current as any).setMap(null);
        naverMarkerInstance.current = null;
      }

      const naverMaps = window.naver.maps as any;
      const map = new naverMaps.Map(mapRef.current, {
        center: new naverMaps.LatLng(lat, lng),
        zoom: 15,
      });
      const marker = new naverMaps.Marker({
        position: new naverMaps.LatLng(lat, lng),
        map: map,
      });

      naverMapInstance.current = map;
      naverMarkerInstance.current = marker;
    }
  };

  return (
    <div className='relative z-0 h-[200px] w-full overflow-hidden rounded-lg shadow-md'>
      <div ref={mapRef} className='h-full w-full' />
    </div>
  );
};

export default DynamicNaverMapForDetail;

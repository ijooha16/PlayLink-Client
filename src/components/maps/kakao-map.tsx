'use client';

import { useEffect, useRef } from 'react';

interface KakaoMapProps {
  lat?: number;
  lng?: number;
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
}

const KakaoMap = ({
  lat = 37.4979,
  lng = 127.0276,
  zoom = 3,
  onMapClick
}: KakaoMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (window.kakao?.maps) {
      initMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY}&autoload=false`;
    script.onload = () => window.kakao.maps.load(initMap);
    document.head.appendChild(script);
  }, [lat, lng, zoom]);

  const initMap = () => {
    if (!mapRef.current) return;

    const map = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(lat, lng),
      level: zoom,
    });



    if (onMapClick) {
      window.kakao.maps.event.addListener(map, 'click', (e: any) => {
        onMapClick(e.latLng.getLat(), e.latLng.getLng());
      });
    }

    mapInstance.current = map;
  };

  return <div className='h-[400px] w-full'><div ref={mapRef} className="h-full w-full" /></div>;
};

export default KakaoMap;
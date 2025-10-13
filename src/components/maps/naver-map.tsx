'use client';

import { useEffect, useRef } from 'react';

interface NaverMapProps {
  lat?: number;
  lng?: number;
}

const NaverMap = ({ lat = 37.4979, lng = 127.0276 }: NaverMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`;
    script.async = true;
    script.onload = () => {
      if (mapRef.current && window.naver) {
        const naverMaps = window.naver.maps;
        const map = new naverMaps.Map(mapRef.current, {
          center: new naverMaps.LatLng(lat, lng),
          zoom: 15,
        });
        new naverMaps.Marker({
          position: new naverMaps.LatLng(lat, lng),
          map: map,
        });
      }
    };

    document.head.appendChild(script);
    return () => {
      // Clean up the script to avoid memory leaks
      const scripts = document.head.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        if (
          scripts[i].src.includes('oapi.map.naver.com')
        ) {
          document.head.removeChild(scripts[i]);
        }
      }
    };
  }, [lat, lng]);

  return (
    <div className='h-[400px] w-full overflow-hidden rounded-md shadow-md sm:h-[500px]'>
      <div ref={mapRef} className='h-full w-full' />
    </div>
  );
};

export default NaverMap;

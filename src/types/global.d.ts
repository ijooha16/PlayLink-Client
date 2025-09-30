export {};

declare global {
  interface Window {
    kakao: {
      maps: {
        Map: new (container: HTMLElement, options: KakaoMapOptions) => KakaoMap;
        LatLng: new (lat: number, lng: number) => KakaoLatLng;
        event: {
          addListener: (target: KakaoMap, type: string, handler: (e: KakaoMouseEvent) => void) => void;
        };
        load: (callback: () => void) => void;
        services: {
          Status: {
            OK: string;
            ZERO_RESULT: string;
            ERROR: string;
          };
          Geocoder: new () => KakaoGeocoder;
        };
      };
    };
    naver: {
      maps: {
        Map: new (container: HTMLElement, options: NaverMapOptions) => NaverMap;
        LatLng: new (lat: number, lng: number) => NaverLatLng;
        Marker: new (options: NaverMarkerOptions) => NaverMarker;
      };
    };
  }

  interface KakaoMapOptions {
    center: KakaoLatLng;
    level: number;
  }

  interface KakaoMap {
    setCenter: (latlng: KakaoLatLng) => void;
    getCenter: () => KakaoLatLng;
  }

  interface KakaoLatLng {
    getLat: () => number;
    getLng: () => number;
  }

  interface KakaoMouseEvent {
    latLng: KakaoLatLng;
  }

  interface KakaoGeocoder {
    addressSearch: (
      query: string,
      callback: (data: unknown[], status: string) => void,
      options?: {
        analyze_type?: string;
        page?: number;
        size?: number;
      }
    ) => void;
    coord2RegionCode: (
      lng: number,
      lat: number,
      callback: (data: unknown[], status: string) => void
    ) => void;
  }

  interface NaverMapOptions {
    center: NaverLatLng;
    zoom: number;
  }

  interface NaverMap {
    setCenter: (latlng: NaverLatLng) => void;
    getCenter: () => NaverLatLng;
    destroy: () => void;
  }

  interface NaverLatLng {
    lat: () => number;
    lng: () => number;
  }

  interface NaverMarkerOptions {
    position: NaverLatLng;
    map: NaverMap;
  }

  interface NaverMarker {
    setMap: (map: NaverMap | null) => void;
  }
}

import apiClient from '@/libs/http/api-client';

export interface KakaoPlace {
  place_name: string;
  road_address_name: string;
  address_name: string;
  x: string;
  y: string;
}

interface KakaoMeta {
  is_end: boolean;
  pageable_count: number;
  total_count: number;
  same_name?: {
    keyword: string;
    selected_region: string;
    region: string[];
  };
}

export interface SearchPlacesOptions {
  query: string;
  page?: number;
  size?: number;
}

export interface SearchPlacesResponse {
  places: KakaoPlace[];
  meta: KakaoMeta | null;
}

export const searchPlaces = async ({
  query,
  page = 1,
  size = 15,
}: SearchPlacesOptions): Promise<SearchPlacesResponse> => {
  if (!query.trim()) {
    return { places: [], meta: null };
  }

  const { data } = await apiClient.get<{
    status: string;
    data: SearchPlacesResponse;
  }>('/api/places/search', {
    params: { query, page, size },
  });

  if (data.status === 'success') {
    return data.data || { places: [], meta: null };
  }

  return { places: [], meta: null };
};

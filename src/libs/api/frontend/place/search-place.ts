import apiClient from '@/libs/http/api-client';

export interface KakaoPlace {
  place_name: string;
  road_address_name: string;
  address_name: string;
  x: string;
  y: string;
}

export const searchPlaces = async (query: string): Promise<KakaoPlace[]> => {
  if (!query.trim()) {
    return [];
  }

  const { data } = await apiClient.get<{
    status: string;
    data: KakaoPlace[];
  }>(`/api/places/search?query=${encodeURIComponent(query)}`);

  if (data.status === 'success') {
    return data.data || [];
  }

  return [];
};

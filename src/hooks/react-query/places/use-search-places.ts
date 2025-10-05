'use client';

import { QUERY_KEYS } from '@/constant/query-key';
import { searchPlaces } from '@/libs/api/frontend/place/search-place';
import { useQuery } from '@tanstack/react-query';

export { type KakaoPlace } from '@/libs/api/frontend/place/search-place';

export const useSearchPlaces = (query: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PLACE, query],
    queryFn: () => searchPlaces(query),
    enabled: query.trim().length > 0,
  });
};

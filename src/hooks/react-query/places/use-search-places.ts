'use client';

import { QUERY_KEYS } from '@/constant/query-key';
import {
  searchPlaces,
  type SearchPlacesResponse,
} from '@/libs/api/frontend/place/search-place';
import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';

export {
  type KakaoPlace,
  type SearchPlacesResponse,
} from '@/libs/api/frontend/place/search-place';

export const useSearchPlaces = (query: string) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.PLACE, query],
    queryFn: ({ pageParam = 1 }) =>
      searchPlaces({ query, page: pageParam as number, size: 15 }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.meta || lastPage.meta.is_end) {
        return undefined;
      }
      return allPages.length + 1;
    },
    initialPageParam: 1,
    enabled: query.trim().length > 0,
  });
};

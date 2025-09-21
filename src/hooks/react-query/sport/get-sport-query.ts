'use client';

import { QUERY_KEYS } from '@/constant/query-key';
import { getSports } from '@/libs/api/sports/get-sports-types';
import { useQuery } from '@tanstack/react-query';

export const useGetSportsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.SPORTS],
    queryFn: getSports,
  });
};

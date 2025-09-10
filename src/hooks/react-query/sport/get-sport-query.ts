'use client';

import { getSports } from '@/services/sports/get-sports-types';
import { QUERY_KEYS } from '@/shares/constant/query-key';
import { useQuery } from '@tanstack/react-query';

export const useGetSportsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.SPORTS],
    queryFn: getSports,
  });
};

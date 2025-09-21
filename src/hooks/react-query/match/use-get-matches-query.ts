'use client';

import { QUERY_KEYS } from '@/constant/query-key';
import { getMatches } from '@/libs/api/match/get-matche';
import { useQuery } from '@tanstack/react-query';

export const useGetMatchesQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.MATCH],
    queryFn: getMatches,
  });
};

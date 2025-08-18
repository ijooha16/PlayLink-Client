'use client';

import { getMatches } from '@/services/match/get-matche';
import { QUERY_KEYS } from '@/shares/constant/query-key';
import { useQuery } from '@tanstack/react-query';

export const useGetMatchesQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.MATCH],
    queryFn: getMatches,
  });
};

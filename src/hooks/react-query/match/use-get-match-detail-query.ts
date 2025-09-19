'use client';

import { QUERY_KEYS } from '@/constant/query-key';
import { getMatchDetail } from '@/libs/api/match/get-matche';
import { useQuery } from '@tanstack/react-query';

export const useGetMatchesQuery = ({ matchId }: { matchId: string | string[] }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.MATCH, matchId],
    queryFn: () => getMatchDetail(matchId),
    enabled: !!matchId
  });
};

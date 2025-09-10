'use client';

import { getMatchDetail } from '@/services/match/get-matche';
import { QUERY_KEYS } from '@/shares/constant/query-key';
import { useQuery } from '@tanstack/react-query';

export const useGetMatchesQuery = ({ matchId }: { matchId: string | string[] }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.MATCH, matchId],
    queryFn: () => getMatchDetail(matchId),
    enabled: !!matchId
  });
};

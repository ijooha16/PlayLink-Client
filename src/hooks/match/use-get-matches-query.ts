'use client';

import { QUERY_KEYS } from '@/shares/constant/query-key';
import { useQuery } from '@tanstack/react-query';

export const useGetMatchesQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.MATCH],
    queryFn: getMatches,
  });
};

const getMatches = async () => {
  const response = await fetch(`/api/match`);
  if (!response.ok) {
    throw new Error('Failed to fetch matchs');
  }
  return response.json();
};

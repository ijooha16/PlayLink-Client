'use client';

import { searchMatch } from '@/services/match/get-matche';
import { QUERY_KEYS } from '@/constant/query-key';
import { useMutation } from '@tanstack/react-query';

export const useGetMatchesMutation = () => {
  return useMutation({
    mutationFn: searchMatch,
  });
};

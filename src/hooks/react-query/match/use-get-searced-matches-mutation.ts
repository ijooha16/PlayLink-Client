'use client';

import { searchMatch } from '@/libs/api/match/get-matche';
import { useMutation } from '@tanstack/react-query';

export const useGetMatchesMutation = () => {
  return useMutation({
    mutationFn: searchMatch,
  });
};

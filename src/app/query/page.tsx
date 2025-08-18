'use client';

import { MatchType } from '@/features/play-link/types/match/match';
import MatchCards from '@/features/play-link/view/main/match-cards';
import { useGetMatchesMutation } from '@/hooks/match/use-get-searced-matches-mutation';
import Header from '@/shares/common-components/header';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const SearchResult = () => {
  const { mutate: search, data } = useGetMatchesMutation();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';

  useEffect(() => {
    if (keyword !== '') {
      search(keyword);
    }
  }, [keyword, search]);

  const matches: MatchType[] = data?.data || [];

  return (
    <>
      <Header backbtn title={`${keyword} 검색결과`} />
      {matches.map((match) => (
        <MatchCards key={match.matchId} data={match} />
      ))}
    </>
  );
};

export default SearchResult;

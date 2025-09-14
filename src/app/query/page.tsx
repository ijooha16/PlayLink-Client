'use client';

import { MatchType } from '@/types/match/match';
import MatchCards from '@/components/view/main/match-cards';
import { useGetMatchesMutation } from '@/hooks/react-query/match/use-get-searced-matches-mutation';
import { useGetSportsQuery } from '@/hooks/react-query/sport/get-sport-query';
import Header from '@/components/common-components/header';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

const SearchResultContent = () => {
  const { mutate: search, data } = useGetMatchesMutation();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const type = searchParams.get('type') || '';
  const { data: sportType } = useGetSportsQuery();

  useEffect(() => {
    search({ keyword, type });
  }, []);

  const matches: MatchType[] = data?.data?.data || [];
  const sports = sportType?.data.data.sports || [];

  const searchSport = sports.filter(
    (sport: { sports_id: number }) => sport.sports_id === parseInt(type)
  );

  return (
    <>
      <Header
        backbtn='home'
        title={`${keyword || searchSport[0]?.sports_name} 검색결과`}
      />
      {matches && matches?.length > 0 ? (
        matches?.map((match) => <MatchCards key={match.matchId} data={match} />)
      ) : (
        <div>검색결과가 없습니다</div>
      )}
    </>
  );
};

const SearchResult = () => {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <SearchResultContent />
    </Suspense>
  );
};

export default SearchResult;

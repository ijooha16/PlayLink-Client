'use client';

import MainHeader from '@/features/play-link/view/main/main-header';
import MainNewButton from '@/features/play-link/view/main/main-new-button';
import MatchCards from '@/features/play-link/view/main/match-cards';
import { useGetMatchesQuery } from '@/hooks/match/use-get-matches-query';

export default function Home() {
  const { data } = useGetMatchesQuery();

  return (
    <div>
      <MainHeader />
      <div className='overflow-auto'>
      {data && data.data.map(d => <MatchCards key={d.matchId} data={d}/>)}
      </div>
      <MainNewButton />
    </div>
  );
}

'use client'

import MainBottomNavigation from '@/features/play-link/view/main/main-bottom-navigation';
import MainHeader from '@/features/play-link/view/main/main-header';
import MainNewButton from '@/features/play-link/view/main/main-new-button';
import MatchCards from '@/features/play-link/view/main/match-cards';
import { useGetMatchesQuery } from '@/hooks/match/use-get-matches-query';

export default function Home() {
  const {data} = useGetMatchesQuery();

  
  return (
    <div>
      <MainHeader />
      <div className='overflow-auto'>
        <div>{JSON.stringify(data)}</div>
        <MatchCards />
        <MatchCards />
      </div>
      <MainNewButton />
      {/* <MainBottomNavigation /> */}
    </div>
  );
}

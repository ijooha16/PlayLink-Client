'use client'

import MainBottomNavigation from '@/features/play-link/view/main/main-bottom-navigation';
import MainHeader from '@/features/play-link/view/main/main-header';
import MainNewButton from '@/features/play-link/view/main/main-new-button';
import MatchCards from '@/features/play-link/view/main/match-cards';
import { useGetMatchesQuery } from '@/features/tanstack/queries/get-matches';

export default async function Home() {
  const {data} = useGetMatchesQuery();

  console.log(data)
  
  return (
    <div>
      <MainHeader />
      <div className='overflow-auto'>
        <MatchCards />
        <MatchCards />
      </div>
      <MainNewButton />
      {/* <MainBottomNavigation /> */}
    </div>
  );
}

'use client';

import MainHeader from '@/features/play-link/view/main/main-header';
import MainNewButton from '@/features/play-link/view/main/main-new-button';
import MatchCards from '@/features/play-link/view/main/match-cards';
import { useGetMatchesQuery } from '@/hooks/match/use-get-matches-query';
import { useSearchStore } from '@/shares/stores/search-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { data } = useGetMatchesQuery();
  const { keyword } = useSearchStore();
  const router = useRouter();

  useEffect(() => {
    if (keyword !== '') {
      router.push(`/query?keyword=${keyword}`);
    }
  }, [keyword]);

  return (
    <div>
      <MainHeader />
      <div className='overflow-auto'>
        {data && data.data.map((d) => <MatchCards key={d.matchId} data={d} />)}
      </div>
      <MainNewButton />
    </div>
  );
}

import MainBottomNavigation from '@/features/play-link/view/main/main-bottom-navigation';
import MainHeader from '@/features/play-link/view/main/main-header';
import MainNewButton from '@/features/play-link/view/main/main-new-button';
import MatchCards from '@/features/play-link/view/main/match-cards';

export default function Home() {
  return (
    <div className='py-16'>
      <MainHeader />
      <div className='overflow-auto'>
        <MatchCards />
      </div>
      <MainNewButton />
      <MainBottomNavigation />
    </div>
  );
}

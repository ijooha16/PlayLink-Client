import MainBottomNavigation from '@/features/play-link/view/main/main-bottom-navigation';
import MainHeader from '@/features/play-link/view/main/main-header';
import MainNewButton from '@/features/play-link/view/main/main-new-button';
import MatchCards from '@/features/play-link/view/main/match-cards';

export default function Home() {
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

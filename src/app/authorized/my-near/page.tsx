import ControlPannel from '@/components/features/location/control-pannel';
// import NaverMap from '@/components/maps/naver-map';
import KakaoMap from '@/components/maps/kakao-map';

const MyNear = () => {
  return (
    <main>
      {/* <NaverMap /> */}
      <KakaoMap/>
      <h2 className='mt-6 px-4 text-2xl font-bold'>내 동네</h2>
      <ControlPannel />
</main>
  );
};

export default MyNear;

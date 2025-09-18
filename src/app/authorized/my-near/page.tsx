import ControlPannel from '@/components/view/my-near/control-pannel';
import NaverMap from '@/components/view/my-near/naver-map';

const MyNear = () => {
  return (
    <main>
      <NaverMap />
      <h2 className='mt-6 px-4 text-2xl font-bold'>내 동네</h2>
      <ControlPannel />
    </main>
  );
};

export default MyNear;

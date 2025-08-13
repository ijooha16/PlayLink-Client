import { getDeviceInfo } from '@/shares/libs/utills/get-device-info';
import {
  SignUpStep1,
  SignUpStep2,
  SignUpStep3,
} from '../../types/sign-up/sign-up-schema';
import Router from 'next/router';
import { useAlertStore } from '@/shares/stores/alert-store';
import useSignup from '@/hooks/useSignup';

const Done = ({
  allData,
}: {
  allData: SignUpStep1 & SignUpStep2 & SignUpStep3;
}) => {
  const openAlert = useAlertStore((state) => state.openAlert);
  const { signup, isLoading, error, isSuccess, data } = useSignup();

  // const handleSubmitToServer = async () => {
  //   const infos = await getDeviceInfo();

  //   // 커스텀 훅에 전달할 데이터 구성
  //   const signupData = {
  //     name: allData.nickname,
  //     nickname: allData.nickname,
  //     email: allData.email,
  //     password: allData.password,
  //     passwordCheck: allData.confirmPassword,
  //     phoneNumber: allData.phone,
  //     platform: infos.platform,
  //     device_id: infos.deviceId,
  //     device_type: infos.deviceType,
  //     prefer_sports: [1], // 배열 형태로 직접 전달 (커스텀 훅에서 JSON.stringify 처리)
  //     img:
  //       allData.profileImage instanceof File
  //         ? allData.profileImage
  //         : new File([], 'empty'),
  //   };

  //   console.log('사인업 데이터', signupData);

  //   // 커스텀 훅의 signup 함수 호출
  //   signup(signupData, {
  //     onSuccess: (data) => {
  //       openAlert(
  //         '회원가입 성공!',
  //         '매너 있는 플레이링크 플레이! 부탁드립니다 :D'
  //       );
  //       Router.replace('/');
  //     },
  //     onError: (error: any) => {
  //       console.error('서버 전송 실패', error);
  //       openAlert(
  //         '회원가입 실패',
  //         error?.message || '회원가입 중 오류가 발생했습니다.'
  //       );
  //     },
  //   });
  // };

  const handleSubmitToServer = async () => {
    try {
      const infos = await getDeviceInfo();
      console.log('디바이스 정보:', infos);

      // 커스텀 훅에 전달할 데이터 구성
      const signupData = {
        name: allData.nickname,
        nickname: allData.nickname,
        email: allData.email,
        password: allData.password,
        passwordCheck: allData.confirmPassword,
        phoneNumber: allData.phone,
        platform: infos.platform,
        device_id: infos.deviceId,
        device_type: infos.deviceType,
        prefer_sports: [1], // 배열 형태로 직접 전달
        img:
          allData.profileImage instanceof File
            ? allData.profileImage
            : new File([], 'empty'),
      };

      console.log('회원가입 데이터 준비 완료:', signupData);

      // 커스텀 훅의 signup 함수 호출 - 콜백은 전달하지 않음
      signup(signupData);
    } catch (err) {
      console.error('회원가입 제출 오류:', err);
      openAlert('오류 발생', '회원가입 정보 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className='space-y-4'>
      <h2>회원가입 완료</h2>
      <pre className='rounded bg-gray-100 p-4 text-xs'>
        {JSON.stringify(allData.profileImage, null, 2)}
        {JSON.stringify([0])}
      </pre>
      <button
        onClick={handleSubmitToServer}
        className='rounded bg-black px-4 py-2 text-white'
      >
        서버에 전송
      </button>
    </div>
  );
};

export default Done;

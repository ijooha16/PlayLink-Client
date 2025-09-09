'use client';

import { getDeviceInfo } from '@/shares/libs/utills/get-device-info';
import {
  SignUpStep1,
  SignUpStep2,
  SignUpStep3,
} from '../../types/sign-up/sign-up-schema';
import useSignup from '@/hooks/useSignup';
import { useEffect } from 'react';

const Done = ({
  allData,
}: {
  allData: SignUpStep1 & SignUpStep2 & SignUpStep3;
}) => {
  const { signup } = useSignup();

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
        // prefer_sports: [1], // 배열 형태로 직접 전달
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
    }
  };

  useEffect(() => {
    handleSubmitToServer();
  }, []);

  return null;
  // <div className='space-y-4'>
  //   <h2>회원가입 완료</h2>
  //   <pre className='rounded bg-gray-100 p-4 text-xs'>
  //     {JSON.stringify(allData.profileImage, null, 2)}
  //     {JSON.stringify([0])}
  //   </pre>
  //   <button
  //     onClick={handleSubmitToServer}
  //     className='rounded bg-black px-4 py-2 text-white'
  //   >
  //     서버에 전송
  //   </button>
  // </div>
};

export default Done;

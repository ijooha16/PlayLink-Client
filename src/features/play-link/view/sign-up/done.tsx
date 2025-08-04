import { getDeviceInfo } from '@/shares/libs/utills/get-device-info';
import {
  SignUpStep1,
  SignUpStep2,
  SignUpStep3,
} from '../../types/sign-up/sign-up-schema';
import Router from 'next/router';

const Done = ({
  allData,
}: {
  allData: SignUpStep1 & SignUpStep2 & SignUpStep3;
}) => {
  const handleSubmitToServer = async () => {
    const infos = await getDeviceInfo();

    const formData = new FormData();

    const payload = {
      name: allData.nickname,
      nickname: allData.nickname,
      email: allData.email,
      password: allData.password,
      passwordCheck: allData.confirmPassword,
      phoneNumber: allData.phone,
      platform: infos.platform,
      ip: infos.ip,
      device_id: infos.deviceId,
      device_type: infos.deviceType,
      prefer_sports: JSON.stringify([1]),
      img: allData.profileImage,
    };

    formData.append('name', payload.name);
    formData.append('nickname', payload.nickname);
    formData.append('email', payload.email);
    formData.append('password', payload.password);
    formData.append('passwordCheck', payload.passwordCheck);
    formData.append('phoneNumber', payload.phoneNumber);
    formData.append('platform', payload.platform);
    formData.append('device_id', payload.device_id);
    formData.append('device_type', payload.device_type);
    formData.append('prefer_sports', payload.prefer_sports);
    if (payload.ip) {
      formData.append('ip', payload.ip);
    }
    if (payload.img instanceof File) {
      formData.append('img', payload.img, payload.img.name);
    }

    try {
      const result = await fetch('/api/signup', {
        method: 'POST',
        body: formData,
      });
      const resJson = await result.json();
      console.log('JSON', resJson);
      console.log('result', result);
      //조건에 http 응답 코드 200 넣기
      if (true) {
        openAlert(
          '로그인 성공!',
          '매너 있는 플레이링크 플레이! 부탁드립니다 :D'
        );
        Router.replace('/');
      }
    } catch (err) {
      console.error('서버 전송 실패', err);
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

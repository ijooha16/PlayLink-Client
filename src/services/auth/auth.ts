import { handleSetSessionStorage } from '@/shares/libs/utills/wep-api';

interface SignInType {
  email: string;
  password: string;
  device_id: string;
}

interface SignUpType {
  name: string;
  nickname: string;
  email: string;
  password: string;
  passwordCheck: string;
  phoneNumber: string;
  platform: string;
  device_id: string;
  device_type: string;
  prefer_sports: number[];
  img: File;
}

export const fetchSignIn = async (req: SignInType) => {
  try {
    const payload = {
      email: req.email,
      password: req.password,
      device_id: req.device_id,
    };

    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    console.log('서비스 레이어 json value', json);
    handleSetSessionStorage(json.accessToken);

    if (!res.ok) {
      console.error('server signin api error');
      throw new Error('server signin api error');
    }
  } catch (err) {
    console.error('sigin services api fetch error', err);
  }
};

export const fetchSignUp = async (signupData: SignUpType) => {
  const formData = new FormData();
  formData.append('name', signupData.name);
  formData.append('nickname', signupData.nickname);
  formData.append('email', signupData.email);
  formData.append('password', signupData.password);
  formData.append('passwordCheck', signupData.passwordCheck);
  formData.append('phoneNumber', signupData.phoneNumber);
  formData.append('platform', signupData.platform);
  formData.append('device_id', signupData.device_id);
  formData.append('device_type', signupData.device_type);
  formData.append('prefer_sports', JSON.stringify(signupData.prefer_sports));

  // 파일이 있으면 추가
  if (signupData.img) {
    formData.append('img', signupData.img);
  }

  // const formDataEntries = Object.fromEntries(formData.entries());
  // console.log('form data 내용:', formDataEntries);

  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      body: formData,
    });

    const json = await response.json();
    console.log('리스폰스', json);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '회원가입에 실패했습니다');
    }
    return json;
  } catch (err) {
    console.log('siginup services api fetch error', err);
  }
};

type SmsType = {
  phoneNumber: string;
};

type SmsVerifyType = SmsType & {
  code: string;
};

export const fetchSms = async (sms: SmsType) => {
  try {
    const payload = {
      phoneNumber: sms.phoneNumber,
    };

    const res = await fetch('/api/auth/sms/send', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      console.error('server sms send api error');
      throw new Error('server sms send api error');
    }
  } catch (err) {
    console.error('sms send services api fetch error', err);
  }
};

export const fetchSmsVerify = async (sms: SmsVerifyType) => {
  try {
    const payload = {
      phoneNumber: sms.phoneNumber,
      code: sms.code,
    };

    const res = await fetch('/api/auth/sms/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) {
      console.error('server sms verify api error');
      throw new Error('server sms verify api error');
    }

    return json; // 성공 응답 그대로 반환
  } catch (err) {
    console.error('sms verify services api fetch error', err);
  }
};

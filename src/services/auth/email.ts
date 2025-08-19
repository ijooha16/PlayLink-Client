type EmailType = {
  email: string;
};

type EmailVerifyType = EmailType & {
  code: string;
};

export const fetchEmail = async (test: EmailType) => {
  try {
    const payload = {
      email: test.email,
    };

    console.log(test.email, 'wqeqewqewqeq');

    const res = await fetch('/api/auth/email/send', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    console.log(json);

    if (!res.ok) {
      console.error('server email send api error');
      throw new Error('server email send api error');
    }
  } catch (err) {
    console.error('email send services api fetch error', err);
  }
};

export const fetchEmailVeriify = async (req: EmailVerifyType) => {
  try {
    const payload = {
      email: req.email,
      code: req.code,
    };

    const res = await fetch('/api/auth/email/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      console.error('server email verify api error');
      throw new Error('server email verify api error');
    }

    return json;
  } catch (err) {
    console.error('email verify services api fetch error', err);
  }
};

'use client';

import Button from '@/components/common/button';
import Input from '@/components/common/input';
import AuthLayoutContainer from '@/components/common/layout/auth-layout';
import Header from '@/components/common/layout/header';
import { PATHS } from '@/constant/paths';
import { useTimer } from '@/hooks/common/use-timer';
import { formatPhoneNumber } from '@/utills/format/phone-formats';
import { toast } from '@/utills/toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const FindId = () => {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [errors, setErrors] = useState<{
    phone?: string;
    code?: string;
  }>({});
  const { start, formattedTime } = useTimer(300); // 5분

  // API 응답 핸들러
  // const handlers = {
  //   findAccount: {
  //     onSuccess: (data: any) => {

  //       // find-id/[id] 페이지로 이동
  //       if (data.errCode === 0 && data.data) {
  //         const params = new URLSearchParams({
  //           id: data.data.id,
  //         });
  //         router.push(`/sign-up/account-exists?${params.toString()}`);
  //         return;
  //       }

  //       // handleAuthSuccess(data, 'phone', {
  //       //     onAccountExists: (message) => setErrors({ phone: message }),
  //       //     onUnverifiedAccount: () => smsSend({ phoneNumber: sanitizedPhone }),
  //       //     onInvalidInput: (message) => setErrors({ phone: message }),
  //       //     onAccountNotFound: () => smsSend({ phoneNumber: sanitizedPhone }),
  //       //     onServerError: () => smsSend({ phoneNumber: sanitizedPhone }),
  //       //     onUnknownError: () => smsSend({ phoneNumber: sanitizedPhone })
  //       // });
  //     },
  //     onError: (err: any) => {
  //       console.log('Find id error:', err);
  //       const sanitizedPhone = phoneNumber.replace(/[^0-9]/g, '');

  //       // handleAuthError(err, 'phone', {
  //       //   onAccountExists: (message) => setErrors({ phone: message }),
  //       //   onUnverifiedAccount: () => smsSend({ phoneNumber: sanitizedPhone }),
  //       //   onInvalidInput: (message) => setErrors({ phone: message }),
  //       //   onAccountNotFound: () => smsSend({ phoneNumber: sanitizedPhone }),
  //       //   onServerError: () => smsSend({ phoneNumber: sanitizedPhone }),
  //       //   onUnknownError: (message) => setErrors({ phone: message }),
  //       // });
  //     },
  //   },
  //   sms: {
  //     onSuccess: () => {
  //       setIsCodeSent(true);
  //       setErrors({});
  //       start();
  //       alert('인증번호를 발송하였습니다.');
  //     },
  //     onError: (err: Error) => {
  //       const errorMessage = handleVerificationError(err, 'phone');
  //       setErrors({ phone: errorMessage });
  //     },
  //   },
  //   verify: {
  //     onSuccess: (data?: { status: string }) => {
  //       if (data?.status === 'success') {
  //         setErrors({});
  //         router.push(`${}`); //다음 걸로 변경
  //       } else {
  //         setErrors({ code: '인증번호가 올바르지 않습니다.' });
  //       }
  //     },
  //     onError: () => {
  //       setErrors({ code: '인증번호가 올바르지 않습니다.' });
  //     },
  //   },
  // };

  // 가입 여부 조회
  // const { mutate: findAccount, isPending: isFindingAccount } =
  //   useFindAccountByPhone(handlers.findAccount);

  // // SMS 인증코드 전송
  // const { mutate: smsSend, isPending: isSmsSending } = useSms(handlers.sms);

  // // SMS 인증코드 확인
  // const { mutate: smsVerify, isPending: isSmsVerifying } = useSmsVerify(
  //   handlers.verify
  // );

  // const handleSendCode = () => {
  //   const sanitizedPhone = phoneNumber.replace(/[^0-9]/g, '');

  //   // 휴대폰 번호 유효성 검사
  //   if (sanitizedPhone.length !== 11) {
  //     setErrors({ phone: '휴대폰 번호는 11자리여야 합니다' });
  //     return;
  //   }

  //   // 가입 여부 확인 후 인증번호 전송
  //   findAccount({ phoneNumber: sanitizedPhone });
  // };

  // const handleVerifyCode = () => {
  //   if (!verificationCode.trim()) {
  //     setErrors({ code: '인증번호를 입력해 주세요' });
  //     return;
  //   }
  //   const sanitizedPhone = phoneNumber.replace(/[^0-9]/g, '');
  //   smsVerify({
  //     phoneNumber: sanitizedPhone,
  //     code: verificationCode.trim(),
  //   });
  // };

  return (
    <>
      <Header title='아이디 찾기' backbtn />
      <AuthLayoutContainer
        title={'가입하신 계정의 \n 휴대폰 번호를 입력해 주세요!'}
      >
        <Input
          label='휴대폰 번호'
          type='tel'
          inputMode='numeric'
          placeholder='000-0000-0000'
          value={phoneNumber}
          onChange={(e) => {
            const input = e.target.value;
            const formatted = formatPhoneNumber(input);
            setPhoneNumber(formatted);
            setErrors((prev) => ({ ...prev, phone: undefined }));
          }}
          hasError={!!errors.phone}
          errorMessage={errors.phone || ''}
        />

        {isCodeSent && (
          <Input
            label='인증번호'
            type='text'
            inputMode='numeric'
            timer={formattedTime}
            splitedRightElement={<div className='text-primary-800 font-semibold text-label-l'>재전송</div>}
            variant={'splited'}
            maxLength={4}
            placeholder='인증번호 4자리를 입력해 주세요.'
            value={verificationCode}
            onChange={(e) => {
              setVerificationCode(e.target.value);
              setErrors((prev) => ({ ...prev, code: undefined }));
            }}
            hasError={!!errors.code}
            errorMessage={errors.code || ''}
          />
        )}
      </AuthLayoutContainer>
      {!isCodeSent ? (
        <Button
          disabled={phoneNumber.length < 11}
          isFloat
          onClick={() => {
            setIsCodeSent(true);
            start();
          }}
        >
          인증번호 받기
        </Button>
      ) : (
        <Button disabled={verificationCode.length < 4} isFloat>
          확인
        </Button>
      )}
    </>
  );
};

export default FindId;

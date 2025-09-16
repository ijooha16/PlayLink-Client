'use client'

    import Button from "@/components/common/button";
import Input from "@/components/common/input";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useSignUpStepStore } from '@/stores/sign-up-store';
import { useTimer } from '@/hooks/common/use-timer';
import { useSms } from '@/hooks/react-query/sms/useSms';
import { useSmsVerify } from '@/hooks/react-query/sms/useSmsVerify';
import { useFindAccountByPhone } from '@/hooks/react-query/auth/use-find-account';
import { formatPhoneNumber } from '@/utills/format/phone-formats';
import { handleAuthError, handleAuthSuccess, handleVerificationError } from '@/services/auth/auth-error-handler';
const PhoneCheck = () => {
    const router = useRouter()
    const { data, updateStep, validateStep } = useSignUpStepStore()

    // 페이지 진입 시 이전 단계 검증
    useEffect(() => {
        if (!validateStep('phone')) {
            router.push('/sign-up/terms')
        }
    }, [])
    
    const [phoneNumber, setPhoneNumber] = useState(data.phone ? formatPhoneNumber(data.phone) : '')
    const [verificationCode, setVerificationCode] = useState('')
    const [isCodeSent, setIsCodeSent] = useState(false)
    const [errors, setErrors] = useState<{
        phone?: string
        code?: string
    }>({})
    const { start, formattedTime } = useTimer(300) // 5분

    // API 응답 핸들러
    const handlers = {
        findAccount: {
            onSuccess: (data: any) => {
                console.log('Find account success:', data);
                const sanitizedPhone = phoneNumber.replace(/[^0-9]/g, '');

                // errCode 0이면 기존 계정이 있음 - account-exists 페이지로 이동
                if (data.errCode === 0 && data.data) {
                    const params = new URLSearchParams({
                        nickname: data.data.nickname || '',
                        email: data.data.email || '',
                        accountType: data.data.account_type?.toString() || '0',
                        createdAt: data.data.created_at || ''
                    });
                    router.push(`/sign-up/account-exists?${params.toString()}`);
                    return;
                }

                handleAuthSuccess(data, 'phone', {
                    onAccountExists: (message) => setErrors({ phone: message }),
                    onUnverifiedAccount: () => smsSend({ phoneNumber: sanitizedPhone }),
                    onInvalidInput: (message) => setErrors({ phone: message }),
                    onAccountNotFound: () => smsSend({ phoneNumber: sanitizedPhone }),
                    onServerError: () => smsSend({ phoneNumber: sanitizedPhone }),
                    onUnknownError: () => smsSend({ phoneNumber: sanitizedPhone })
                });
            },
            onError: (err: any) => {
                console.log('Find account error:', err);
                const sanitizedPhone = phoneNumber.replace(/[^0-9]/g, '');

                handleAuthError(err, 'phone', {
                    onAccountExists: (message) => setErrors({ phone: message }),
                    onUnverifiedAccount: () => smsSend({ phoneNumber: sanitizedPhone }),
                    onInvalidInput: (message) => setErrors({ phone: message }),
                    onAccountNotFound: () => smsSend({ phoneNumber: sanitizedPhone }),
                    onServerError: () => smsSend({ phoneNumber: sanitizedPhone }),
                    onUnknownError: (message) => setErrors({ phone: message })
                });
            }
        },
        sms: {
            onSuccess: () => {
                setIsCodeSent(true)
                setErrors({})
                start()
                alert('인증번호를 발송하였습니다.')
            },
            onError: (err: Error) => {
                const errorMessage = handleVerificationError(err, 'phone');
                setErrors({ phone: errorMessage });
            }
        },
        verify: {
            onSuccess: (data?: { status: string }) => {
                if (data?.status === 'success') {
                    setErrors({})
                    updateStep({ phone: phoneNumber, phoneVerified: true })
                    router.push('/sign-up/email-check')
                } else {
                    setErrors({ code: '인증번호가 올바르지 않습니다.' })
                }
            },
            onError: () => {
                setErrors({ code: '인증번호가 올바르지 않습니다.' })
            }
        }
    }

    // 가입 여부 조회
    const { mutate: findAccount, isPending: isFindingAccount } = useFindAccountByPhone(handlers.findAccount)

    // SMS 인증코드 전송
    const { mutate: smsSend, isPending: isSmsSending } = useSms(handlers.sms)

    // SMS 인증코드 확인
    const { mutate: smsVerify, isPending: isSmsVerifying } = useSmsVerify(handlers.verify)

    const handleSendCode = () => {
        const sanitizedPhone = phoneNumber.replace(/[^0-9]/g, '')

        // 휴대폰 번호 유효성 검사
        if (sanitizedPhone.length !== 11) {
            setErrors({ phone: '휴대폰 번호는 11자리여야 합니다' })
            return
        }

        // 가입 여부 확인 후 인증번호 전송
        findAccount({ phoneNumber: sanitizedPhone })
    }


    const handleVerifyCode = () => {
        if (!verificationCode.trim()) {
            setErrors({ code: '인증번호를 입력해 주세요' })
            return
        }
        const sanitizedPhone = phoneNumber.replace(/[^0-9]/g, '')
        smsVerify({
            phoneNumber: sanitizedPhone,
            code: verificationCode.trim()
        })
    }


    return (
        <div className="flex flex-col min-h-[calc(100vh-144px)]">
        <div className="px-[20px] pt-[24px]">
            <h1 className="text-title-1 pb-[24px]">휴대폰 번호를 입력해 주세요</h1>
            <p className="text-body-4 text-grey02 pb-[8px]">휴대폰 번호</p>
            <div className="flex flex-col gap-[16px] pb-[24px]">

            <Input
                variant="default"
                sizes="lg"
                placeholder="010-0000-0000"
                value={phoneNumber}
                onChange={(e) => {
                    const input = e.target.value
                    const formatted = formatPhoneNumber(input)
                    setPhoneNumber(formatted)
                    setErrors(prev => ({ ...prev, phone: undefined }))
                }}
                hasError={!!errors.phone}
                errorMessage={errors.phone || ''}
            />
            <Button 
                variant="default" 
                size="base"
                onClick={handleSendCode}
                disabled={!phoneNumber || isSmsSending || isFindingAccount}
            >
                {isFindingAccount ? '가입 여부 확인 중...' : isSmsSending ? '전송 중...' : '인증번호 받기'}
            </Button>
            </div>
            {isCodeSent && (
                <div className="flex flex-col">
                    <p className="text-body-4 text-grey02 pb-[8px]">인증번호</p>
                    <div className="relative">
                        <Input
                            variant="default"
                            sizes="lg"
                            placeholder="인증번호 4자리를 입력해주세요"
                            value={verificationCode}
                            onChange={(e) => {
                                setVerificationCode(e.target.value)
                                setErrors(prev => ({ ...prev, code: undefined }))
                            }}
                            hasError={!!errors.code}
                            errorMessage={errors.code || ''}
                        />
                        <div className="absolute right-4 top-3 text-red text-sub z-10">
                            {formattedTime}
                        </div>
                    </div>
                </div>
            )}
        </div>
        
        <div className="mt-auto px-[20px]">
            <Button 
                variant="default" 
                disabled={!isCodeSent || !verificationCode || isSmsVerifying}
                onClick={handleVerifyCode}
            >
                다음
            </Button>
        </div>
        </div>
    )
}

export default PhoneCheck;
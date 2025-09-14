'use client'

    import Button from "@/components/common-components/button";
import Input from "@/components/common-components/input";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { useSignUpStepStore } from '@/shares/stores/sign-up-store';
import { useTimer } from '@/hooks/common/useTimer';
import { useSms } from '@/hooks/react-query/sms/useSms';
import { useSmsVerify } from '@/hooks/react-query/sms/useSmsVerify';

const PhoneCheck = () => {
    const router = useRouter()
    const { data, updateStep } = useSignUpStepStore()
    const [phoneNumber, setPhoneNumber] = useState(data.phone || '')
    const [verificationCode, setVerificationCode] = useState('')
    const [isCodeSent, setIsCodeSent] = useState(false)
    const [errors, setErrors] = useState<{
        phone?: string
        code?: string
    }>({})
    const { start, formattedTime } = useTimer(300) // 5분

    // API 응답 핸들러
    const handlers = {
        sms: {
            onSuccess: () => {
                setIsCodeSent(true)
                setErrors({})
                start()
                alert('인증번호를 발송하였습니다.')
            },
            onError: (err: Error) => {
                setErrors({ phone: err.message || '인증 문자 전송에 실패했습니다.' })
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
        
        smsSend({ phoneNumber: sanitizedPhone })
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
                    const sanitized = input.replace(/[^0-9]/g, '')
                    setPhoneNumber(sanitized)
                    setErrors(prev => ({ ...prev, phone: undefined }))
                }}
                hasError={!!errors.phone}
                errorMessage={errors.phone || ''}
            />
            <Button 
                variant="default" 
                size="base"
                onClick={handleSendCode}
                disabled={!phoneNumber || isSmsSending}
            >
                인증번호 받기
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
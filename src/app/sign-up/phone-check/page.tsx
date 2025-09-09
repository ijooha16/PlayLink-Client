'use client'

import Button from "@/shares/common-components/button";
import Input from "@/shares/common-components/input";
import React, { useState, useEffect } from "react";

const PhoneCheck = () => {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [verificationCode, setVerificationCode] = useState('')
    const [isCodeSent, setIsCodeSent] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [timeLeft, setTimeLeft] = useState(300) // 5분

    const handleSendCode = () => {
        if (phoneNumber) {
            setIsCodeSent(true)
            setHasError(false)
            setTimeLeft(300) // 5분으로 초기화
        }
    }

    // 타이머 효과
    useEffect(() => {
        if (isCodeSent && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
            
            return () => clearInterval(timer)
        }
    }, [isCodeSent, timeLeft])

    const handleVerifyCode = () => {
        // 임시로 '1234'가 아니면 에러로 처리
        if (verificationCode !== '1234') {
            setHasError(true)
        } else {
            setHasError(false)
            // 성공 처리 로직
        }
    }

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    return (
        <div className="flex flex-col min-h-[calc(100vh-144px)]">
        <div className="px-[20px] pt-[24px]">
            <h1 className="text-title-1 pb-[24px]">휴대폰 번호 인증</h1>
            <p className="text-body-4 text-grey02 pb-[8px]">휴대폰 번호</p>
            <div className="flex flex-col gap-[16px] pb-[24px]">

            <Input
                variant="default"
                sizes="lg"
                placeholder="010-1234-5678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Button 
                variant="default" 
                size="base"
                onClick={handleSendCode}
                disabled={!phoneNumber}
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
                            onChange={(e) => setVerificationCode(e.target.value)}
                            hasError={hasError}
                            errorMessage="인증번호가 일치하지 않아요"
                        />
                        <div className="absolute right-4 top-3 text-red text-sub z-10">
                            {formatTime(timeLeft)}
                        </div>
                    </div>
                </div>
            )}
        </div>
        
        <div className="mt-auto px-[20px]">
            <Button 
                variant="default" 
                disabled={!isCodeSent || !verificationCode}
                onClick={handleVerifyCode}
            >
                다음
            </Button>
        </div>
        </div>
    )
}

export default PhoneCheck;
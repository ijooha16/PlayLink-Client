'use client'

import Button from "@/shares/common-components/button";
import Input from "@/shares/common-components/input";
import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from 'lucide-react';

const EmailCheck = () => {
    const [email, setEmail] = useState('')
    const [verificationCode, setVerificationCode] = useState('')
    const [isCodeSent, setIsCodeSent] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [timeLeft, setTimeLeft] = useState(300) // 5분
    const [isCodeVerified, setIsCodeVerified] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [passwordError, setPasswordError] = useState('')
    const [confirmError, setConfirmError] = useState('')

    const handleSendCode = () => {
        if (email) {
            setIsCodeSent(true)
            setHasError(false)
            setTimeLeft(300) // 5분으로 초기화
        }
    }

    // 타이머 효과
    useEffect(() => {
        if (isCodeSent && timeLeft > 0 && !isCodeVerified) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
            
            return () => clearInterval(timer)
        }
    }, [isCodeSent, timeLeft, isCodeVerified])

    const handleVerifyCode = () => {
        if (verificationCode !== '1234') {
            setHasError(true)
        } else {
            setHasError(false)
            setIsCodeVerified(true)
        }
    }

    const validatePassword = (pwd: string) => {
        const hasLetter = /[a-zA-Z]/.test(pwd)
        const hasNumber = /\d/.test(pwd)
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
        const isValidLength = pwd.length >= 8 && pwd.length <= 16
        
        if (!isValidLength || !hasLetter || !hasNumber || !hasSpecial) {
            return '영문, 숫자, 특수문자 조합 8~16자'
        }
        return ''
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value
        setPassword(newPassword)
        
        const error = validatePassword(newPassword)
        setPasswordError(error)
        
        // 비밀번호 확인 필드도 다시 검증
        if (confirmPassword && newPassword !== confirmPassword) {
            setConfirmError('비밀번호가 일치하지 않습니다')
        } else if (confirmPassword && newPassword === confirmPassword) {
            setConfirmError('')
        }
    }

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newConfirmPassword = e.target.value
        setConfirmPassword(newConfirmPassword)
        
        if (password !== newConfirmPassword) {
            setConfirmError('비밀번호가 일치하지 않습니다')
        } else {
            setConfirmError('')
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
                <h1 className="text-title-1 pb-[24px]">이메일 인증 및 비밀번호 설정</h1>
                <p className="text-body-4 text-grey02 pb-[8px]">이메일 주소</p>
                <div className="flex flex-col gap-[16px] pb-[24px]">
                    <Input
                        variant="default"
                        sizes="lg"
                        placeholder="playlink@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button 
                        variant="default" 
                        size="base"
                        onClick={handleSendCode}
                        disabled={!email}
                    >
                        인증번호 받기
                    </Button>
                </div>
                
                {isCodeSent && (
                    <div className="flex flex-col pb-[24px]">
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
                                disabled={isCodeVerified}
                            />
                            <div className="absolute right-4 top-3 text-red text-sub z-10">
                                {formatTime(timeLeft)}
                            </div>
                        </div>
                    </div>
                )}

                {isCodeVerified && (
                    <div className="flex flex-col gap-[24px]">
                        <div className="flex flex-col">
                            <p className="text-body-4 text-grey02 pb-[8px]">비밀번호</p>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    variant="default"
                                    sizes="lg"
                                    placeholder="비밀번호를 입력해주세요"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    hasError={!!passwordError}
                                    errorMessage={passwordError}
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-4 text-grey02 z-10"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {!passwordError && (
                                <p className="text-caption text-grey02 pt-[8px]">영문, 숫자, 특수문자 조합 8~16자</p>
                            )}
                        </div>
                        
                        <div className="flex flex-col">
                            <p className="text-body-4 text-grey02 pb-[8px]">비밀번호 확인</p>
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    variant="default"
                                    sizes="lg"
                                    placeholder="비밀번호를 다시 입력해주세요"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    hasError={!!confirmError}
                                    errorMessage={confirmError}
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-4 text-grey02 z-10"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="mt-auto px-[20px]">
                {!isCodeVerified ? (
                    <Button 
                        variant="default" 
                        disabled={!isCodeSent || !verificationCode}
                        onClick={handleVerifyCode}
                    >
                        인증 확인
                    </Button>
                ) : (
                    <Button 
                        variant="default" 
                        disabled={!password || !confirmPassword || !!passwordError || !!confirmError}
                    >
                        다음
                    </Button>
                )}
            </div>
        </div>
    )
}

export default EmailCheck;
'use client'

import Button from "@/components/common-components/button";
import Input from "@/components/common-components/input";
import React, { useState } from "react";
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSignUpStepStore } from '@/shares/stores/sign-up-store';
import { useTimer } from '@/hooks/common/useTimer';
import { useEmail } from '@/hooks/react-query/email/useEmail';
import { useEmailVerify } from '@/hooks/react-query/email/useEmailVerify';

const EmailCheck = () => {
    const router = useRouter()
    const { data, updateStep } = useSignUpStepStore()
    const [email, setEmail] = useState(data.email || '')
    const [verificationCode, setVerificationCode] = useState('')
    const [isCodeSent, setIsCodeSent] = useState(false)
    const [isCodeVerified, setIsCodeVerified] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { start, formattedTime } = useTimer(600) // 10분
    const [errors, setErrors] = useState<{
        email?: string
        code?: string
        password?: string
        confirmPassword?: string
    }>({})

    // API 응답 핸들러
    const handlers = {
        email: {
            onSuccess: () => {
                setIsCodeSent(true)
                setErrors({})
                start()
                alert('인증번호를 발송하였습니다.')
            },
            onError: (err: Error) => {
                setErrors({ email: err.message || '인증 메일 전송에 실패했습니다.' })
            }
        },
        verify: {
            onSuccess: (data?: { status: string }) => {
                if (data?.status !== 'error') {
                    setErrors({})
                    setIsCodeVerified(true)
                } else {
                    setErrors({ code: '인증번호가 올바르지 않습니다.' })
                }
            },
            onError: () => {
                setErrors({ code: '인증번호가 올바르지 않습니다.' })
            }
        }
    }

    // 이메일 인증코드 전송
    const { mutate: emailSend, isPending: isEmailSending } = useEmail(handlers.email)

    // 이메일 인증코드 확인
    const { mutate: emailVerify, isPending: isEmailVerifying } = useEmailVerify(handlers.verify)

    const handleSendCode = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setErrors({ email: '올바른 이메일 형식을 입력해 주세요' })
            return
        }
        emailSend({ email })
    }

    const handleVerifyCode = () => {
        if (!verificationCode.trim()) {
            setErrors({ code: '인증번호를 입력해 주세요' })
            return
        }
        emailVerify({ email, code: verificationCode.trim() })
    }

    const validatePassword = (pwd: string) => {
        const hasLetter = /[a-zA-Z]/.test(pwd)
        const hasNumber = /\d/.test(pwd)
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
        const isValidLength = pwd.length >= 8 && pwd.length <= 16
        
        if (!pwd) return ''
        if (!isValidLength || !hasLetter || !hasNumber || !hasSpecial) {
            return '영문, 숫자, 특수문자 조합 8~16자'
        }
        return ''
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value
        setPassword(newPassword)
        
        const error = validatePassword(newPassword)
        setErrors(prev => ({ ...prev, password: error || undefined }))
        
        // 비밀번호 확인 필드도 다시 검증
        if (confirmPassword && newPassword !== confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: '비밀번호가 일치하지 않습니다' }))
        } else if (confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: undefined }))
        }
    }

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newConfirmPassword = e.target.value
        setConfirmPassword(newConfirmPassword)
        
        if (newConfirmPassword && password !== newConfirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: '비밀번호가 일치하지 않습니다' }))
        } else {
            setErrors(prev => ({ ...prev, confirmPassword: undefined }))
        }
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
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setErrors(prev => ({ ...prev, email: undefined }))
                        }}
                        hasError={!!errors.email}
                        errorMessage={errors.email || ''}
                        disabled={isCodeSent}
                    />
                    <Button 
                        variant="default" 
                        size="base"
                        onClick={handleSendCode}
                        disabled={!email || isEmailSending}
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
                                onChange={(e) => {
                                    setVerificationCode(e.target.value)
                                    setErrors(prev => ({ ...prev, code: undefined }))
                                }}
                                hasError={!!errors.code}
                                errorMessage={errors.code || ''}
                                disabled={isCodeVerified}
                            />
                            {!isCodeVerified && (
                                <div className="absolute right-4 top-3 text-red text-sub z-10">
                                    {formattedTime}
                                </div>
                            )}
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
                                    hasError={!!errors.password}
                                    errorMessage={errors.password || ''}
                                />
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    className="absolute right-4 top-4 text-grey02 z-10"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {!errors.password && password.length === 0 && (
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
                                    hasError={!!errors.confirmPassword}
                                    errorMessage={errors.confirmPassword || ''}
                                />
                                <button
                                    type="button"
                                    tabIndex={-1}
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
                        disabled={!isCodeSent || !verificationCode || isEmailVerifying}
                        onClick={handleVerifyCode}
                    >
                        인증 확인
                    </Button>
                ) : (
                    <Button 
                        variant="default" 
                        disabled={!password || !confirmPassword || !!errors.password || !!errors.confirmPassword}
                        onClick={() => {
                            updateStep({ 
                                email, 
                                password,
                                confirmPassword
                            })
                            router.push('/sign-up/profile')
                        }}
                    >
                        다음
                    </Button>
                )}
            </div>
        </div>
    )
}

export default EmailCheck;
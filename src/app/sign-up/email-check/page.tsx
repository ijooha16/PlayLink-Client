'use client'

import Button from "@/components/common/button";
import Input from "@/components/common/input";
import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSignUpStepStore } from '@/stores/sign-up-store';
import { useTimer } from '@/hooks/common/use-timer';
import { useEmail } from '@/hooks/react-query/email/useEmail';
import { useEmailVerify } from '@/hooks/react-query/email/useEmailVerify';
import { useFindAccountByPhoneEmail } from '@/hooks/react-query/auth/use-find-account';
import { handleAuthError, handleAuthSuccess, handleVerificationError } from '@/services/auth/auth-error-handler';

const EmailCheck = () => {
    const router = useRouter()
    const { data, updateStep, validateStep } = useSignUpStepStore()

    // 페이지 진입 시 이전 단계 검증
    useEffect(() => {
        if (!validateStep('email')) {
            router.push('/sign-up/phone-check')
        }
    }, [])
    const [email, setEmail] = useState(data.email || '')
    const [verificationCode, setVerificationCode] = useState('')
    const [isCodeSent, setIsCodeSent] = useState(false)
    const [isCodeVerified, setIsCodeVerified] = useState(false)
    const [passwordState, setPasswordState] = useState({
        password: '',
        confirmPassword: '',
        showPassword: false,
        showConfirmPassword: false
    })
    const { start, formattedTime } = useTimer(600) // 10분
    const [errors, setErrors] = useState<{
        email?: string
        code?: string
        password?: string
        confirmPassword?: string
    }>({})

    // API 응답 핸들러
    const handlers = {
        findAccount: {
            onSuccess: (data: any) => {
                console.log('Find account success:', data);

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

                handleAuthSuccess(data, 'email', {
                    onAccountExists: (message) => setErrors({ email: message }),
                    onUnverifiedAccount: (message) => setErrors({ email: message }),
                    onInvalidInput: (message) => setErrors({ email: message }),
                    onAccountNotFound: () => emailSend({ email }),
                    onServerError: () => emailSend({ email }),
                    onUnknownError: () => emailSend({ email })
                });
            },
            onError: (err: any) => {
                console.log('Find account error:', err);
                handleAuthError(err, 'email', {
                    onAccountExists: (message) => setErrors({ email: message }),
                    onUnverifiedAccount: (message) => setErrors({ email: message }),
                    onInvalidInput: (message) => setErrors({ email: message }),
                    onAccountNotFound: () => emailSend({ email }),
                    onServerError: () => emailSend({ email }),
                    onUnknownError: (message) => setErrors({ email: message })
                });
            }
        },
        email: {
            onSuccess: () => {
                setIsCodeSent(true)
                setErrors({})
                start()
                alert('인증번호를 발송하였습니다.')
            },
            onError: (err: Error) => {
                const errorMessage = handleVerificationError(err, 'email');
                setErrors({ email: errorMessage });
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

    // 가입 여부 조회
    const { mutate: findAccount, isPending: isFindingAccount } = useFindAccountByPhoneEmail(handlers.findAccount)

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

        // 전화번호가 있으면 함께 조회, 없으면 이메일만 조회
        if (data.phone) {
            const sanitizedPhone = data.phone.replace(/[^0-9]/g, '')
            findAccount({ phoneNumber: sanitizedPhone, email })
        } else {
            // 전화번호가 없는 경우 바로 인증번호 전송
            emailSend({ email })
        }
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
        setPasswordState(prev => ({ ...prev, password: newPassword }))
        
        const error = validatePassword(newPassword)
        setErrors(prev => ({ ...prev, password: error || undefined }))
        
        // 비밀번호 확인 필드도 다시 검증
        if (passwordState.confirmPassword && newPassword !== passwordState.confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: '비밀번호가 일치하지 않습니다' }))
        } else if (passwordState.confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: undefined }))
        }
    }

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newConfirmPassword = e.target.value
        setPasswordState(prev => ({ ...prev, confirmPassword: newConfirmPassword }))
        
        if (newConfirmPassword && passwordState.password !== newConfirmPassword) {
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
                        disabled={!email || isEmailSending || isFindingAccount}
                    >
                        {isFindingAccount ? '가입 여부 확인 중...' : isEmailSending ? '전송 중...' : '인증번호 받기'}
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
                                    type={passwordState.showPassword ? "text" : "password"}
                                    variant="default"
                                    sizes="lg"
                                    placeholder="비밀번호를 입력해주세요"
                                    value={passwordState.password}
                                    onChange={handlePasswordChange}
                                    hasError={!!errors.password}
                                    errorMessage={errors.password || ''}
                                />
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    className="absolute right-4 top-4 text-grey02 z-10"
                                    onClick={() => setPasswordState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                                >
                                    {passwordState.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {!errors.password && passwordState.password.length === 0 && (
                                <p className="text-caption text-grey02 pt-[8px]">영문, 숫자, 특수문자 조합 8~16자</p>
                            )}
                        </div>
                        
                        <div className="flex flex-col">
                            <p className="text-body-4 text-grey02 pb-[8px]">비밀번호 확인</p>
                            <div className="relative">
                                <Input
                                    type={passwordState.showConfirmPassword ? "text" : "password"}
                                    variant="default"
                                    sizes="lg"
                                    placeholder="비밀번호를 다시 입력해주세요"
                                    value={passwordState.confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    hasError={!!errors.confirmPassword}
                                    errorMessage={errors.confirmPassword || ''}
                                />
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    className="absolute right-4 top-4 text-grey02 z-10"
                                    onClick={() => setPasswordState(prev => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))}
                                >
                                    {passwordState.showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                        disabled={!passwordState.password || !passwordState.confirmPassword || !!errors.password || !!errors.confirmPassword}
                        onClick={() => {
                            updateStep({ 
                                email, 
                                password: passwordState.password,
                                confirmPassword: passwordState.confirmPassword
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
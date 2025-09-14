'use client'

import Button from "@/components/common-components/button";
import Input from "@/components/common-components/input";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useSignUpStepStore } from '@/shares/stores/sign-up-store';
import Image from 'next/image';
import { ProfileImg } from '@/shares/libs/utills/random-profile-image';
import randomProfileImage from '@/shares/libs/utills/random-profile-image';

const ProfileSetup = () => {
    const router = useRouter()
    const { data, updateStep } = useSignUpStepStore()
    const [nickname, setNickname] = useState(data.nickname || '')
    const [profileImage, setProfileImage] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const randomImgRef = useRef<ProfileImg>(randomProfileImage())
    const [errors, setErrors] = useState<{
        nickname?: string
    }>({})

    useEffect(() => {
        if (profileImage) {
            const url = URL.createObjectURL(profileImage)
            setPreview(url)
            return () => URL.revokeObjectURL(url)
        } else {
            setPreview(null)
        }
    }, [profileImage])

    const validateNickname = (name: string) => {
        if (!name.trim()) return '닉네임을 입력해주세요'
        if (name.length < 2) return '닉네임은 2자 이상이어야 합니다'
        if (name.length > 15) return '닉네임은 15자 이하여야 합니다'
        return ''
    }

    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setNickname(value)
        
        const error = validateNickname(value)
        setErrors({ nickname: error || undefined })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // 파일 크기 체크 (5MB 제한)
            if (file.size > 5 * 1024 * 1024) {
                alert('파일 크기는 5MB 이하여야 합니다')
                return
            }
            
            // 파일 타입 체크
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
            if (!allowedTypes.includes(file.type)) {
                alert('JPG, JPEG, PNG 파일만 업로드 가능합니다')
                return
            }
            
            setProfileImage(file)
        }
    }

    const handleNext = () => {
        const nicknameError = validateNickname(nickname)
        if (nicknameError) {
            setErrors({ nickname: nicknameError })
            return
        }

        updateStep({ 
            nickname,
            profileImage 
        })
        router.push('/sign-up/complete')
    }

    return (
        <div className="flex flex-col min-h-[calc(100vh-144px)]">
            <div className="px-[20px] pt-[24px]">
                <h1 className="text-title-1 pb-[24px]">프로필을 설정해주세요</h1>
                <p className="text-body-4 text-grey02 pb-[32px]">
                    프로필 사진과 닉네임을 설정해서 나만의 개성을 표현해보세요!
                </p>

                <div className="flex flex-col items-center pb-[32px]">
                    <div className="relative mb-[24px]">
                        <div
                            className="flex h-[120px] w-[120px] items-center justify-center overflow-hidden rounded-full bg-gray-200 cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Image
                                src={preview || randomImgRef.current}
                                alt="profile_img"
                                width={120}
                                height={120}
                                className="object-cover"
                                priority={true}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 flex h-[32px] w-[32px] items-center justify-center rounded-full bg-blue-500 text-white shadow-md text-lg"
                        >
                            +
                        </button>

                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                </div>

                <div className="flex flex-col pb-[24px]">
                    <p className="text-body-4 text-grey02 pb-[8px]">닉네임</p>
                    <Input
                        variant="default"
                        sizes="lg"
                        placeholder="닉네임을 입력해주세요"
                        value={nickname}
                        onChange={handleNicknameChange}
                        hasError={!!errors.nickname}
                        errorMessage={errors.nickname || ''}
                    />
                    {!errors.nickname && (
                        <p className="text-caption text-grey02 pt-[8px]">
                            닉네임은 2자 이상 15자 이하로 입력해주세요
                        </p>
                    )}
                </div>
            </div>
            
            <div className="mt-auto px-[20px]">
                <Button 
                    variant="default"
                    onClick={handleNext}
                    disabled={!nickname.trim() || !!errors.nickname}
                >
                    다음
                </Button>
            </div>
        </div>
    )
}

export default ProfileSetup;
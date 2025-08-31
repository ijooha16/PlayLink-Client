import { z } from 'zod';

/**
 * step1 - 이메일(필수), 비밀번호(필수, 최소 6자), 비밀번호 확인(필수, 최소 6자), 휴대폰 번호(필수), 이용 약관(필수),
 *         개인정보 처리(필수),만 14세 이상 이용(필수) , 마케팅 수신 동의(선택),
 *         위치 정보 이용 동의(필수), 제 3자 정보 제공 동의(필수)
 */
export const signUpStep1Schema = z
  .object({
    email: z.string().email('유효한 이메일을 입력해주세요.'),
    password: z
      .string()
      .min(6, '비밀번호는 최소 6자 이상이어야 합니다.')
      .max(20, '비밀번호는 최대 20자까지 입력 가능합니다.')
      .refine(
        (value) => {
          const rules = [
            /[A-Z]/.test(value), // 대문자
            /[a-z]/.test(value), // 소문자
            /[0-9]/.test(value), // 숫자
            /[^A-Za-z0-9]/.test(value), // 특수문자
          ];
          return rules.filter(Boolean).length >= 2;
        },
        {
          message:
            '영문 대/소문자, 숫자, 특수문자 중 2가지 이상을 조합해야 합니다.',
        }
      ),
    confirmPassword: z.string(),
    phone: z.string().min(10, '전화번호를 올바르게 입력해주세요.'),
    agreeTerms: z.literal(true),
    agreePrivacy: z.literal(true),
    isOver14: z.literal(true),
    agreeLocation: z.literal(true),
    agreeThirdParty: z.literal(true),
    agreeMarketing: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

/**
 * step2 - 프로필 이미지(선택), 닉네임(필수, 2~15자 사이)
 */
export const signUpStep2Schema = z.object({
  nickname: z
    .string()
    .min(2, '닉네임은 2자 이상이어야 합니다.')
    .max(15, '닉네임은 15자 이하이어야 합니다.'),
  profileImage: z
    .any()
    .optional()
    .refine(
      (fileList) => {
        if (!fileList || fileList.length === 0) return true;

        const file = fileList[0];
        return ACCEPTED_IMAGE_TYPES.includes(file?.type);
      },
      {
        message: 'jpg, jpeg, png 형식의 이미지 파일만 업로드 가능합니다.',
      }
    ),
});

/**
 * step3 - 선호하는 운동(최소 1개, 최대 3개)
 */
export const signUpStep3Schema = z.object({
  favoriteSports: z
    .array(z.number())
    .min(1, '최소 하나의 운동은 선택해주세요.')
    .max(3),
});

// 최종 병합 스키마
export const fullSignUpSchema = signUpStep1Schema
  .innerType()
  .merge(signUpStep2Schema)
  .merge(signUpStep3Schema);

// 타입 export
export type Step = 'step1' | 'step2' | 'step3' | 'done';
export type SignUpStep1 = z.infer<typeof signUpStep1Schema>;
export type SignUpStep2 = z.infer<typeof signUpStep2Schema>;
export type SignUpStep3 = z.infer<typeof signUpStep3Schema>;
export type FullSignUpForm = z.infer<typeof fullSignUpSchema>;

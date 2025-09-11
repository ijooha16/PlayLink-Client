// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import {
//   SignUpStep3,
//   signUpStep3Schema,
// } from '../../types/sign-up/sign-up-schema';
// import { useGetSportsQuery } from '@/hooks/sport/get-sport-query';
// import SportCard from '@/shares/common-components/sport-card';
// import type {
//   SignUpStep1,
//   SignUpStep2,
// } from '../../types/sign-up/sign-up-schema';

// type BaseData = Partial<SignUpStep1 & SignUpStep2>;
// export default function Step3({
//   baseData,
//   onNext,
//   defaultValues,
// }: {
//   baseData: BaseData; // ✅ step1+step2 데이터만
//   onNext: (d: SignUpStep3) => void;
//   defaultValues?: Partial<SignUpStep3>;
// }) {
//   const { register, handleSubmit, watch, getValues, setValue } =
//     useForm<SignUpStep3>({
//       resolver: zodResolver(signUpStep3Schema),
//       defaultValues,
//     });

//   const { data: sports } = useGetSportsQuery();
//   const sportsList: { sports_name: string; sports_id: number }[] =
//     sports?.data?.data?.sports;

//   const selected = watch('favoriteSports') || [];

//   const toggle = (value: string, id: number) => {
//     const current = getValues('favoriteSports') || [];
//     if (current.includes(value)) {
//       setValue(
//         'favoriteSports',
//         current.filter((v) => v !== value)
//       );
//     } else if (current.length < 3) {
//       setValue('favoriteSports', [...current, value]);
//     }

//     console.log(current);
//   };

//   const onSubmit = (data: SignUpStep3) => onNext(data);

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
//       <div className='text-center'>
//         <h2 className='text-lg font-semibold'>선호하는 스포츠를 선택하세요</h2>
//         <p className='text-sm text-gray-500'>최대 3개까지 선택할 수 있어요</p>
//       </div>

//       <div className='flex flex-col space-y-4'>
//         <h3 className='w-fit border-b-2 border-blue-500 text-lg font-semibold'>
//           스포츠 종목
//         </h3>
//         <div className='box-border grid h-auto grid-cols-5 gap-2 overflow-y-scroll p-2'>
//           {sportsList &&
//             sportsList.map((sport, idx) => (
//               <div key={sport.sports_id} className='relative'>
//                 <SportCard
//                   sport={sport.sports_id}
//                   sport_name={sport.sports_name}
//                   selected={selected.includes(sport.sports_name)}
//                   onClick={() => toggle(sport.sports_name, sport.sports_id)}
//                 />
//               </div>
//             ))}
//         </div>
//       </div>

//       <div className='flex justify-between pt-4'>
//         <button
//           type='submit'
//           disabled={selected.length === 0}
//           className='w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors ease-in-out focus:bg-blue-700 disabled:bg-[#E7E9EC] disabled:text-[#BDC0C6]'
//         >
//           다음
//         </button>
//       </div>
//     </form>
//   );
// }

'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  SignUpStep1,
  SignUpStep2,
  SignUpStep3,
  signUpStep3Schema,
} from '../../types/sign-up/sign-up-schema';
import { useGetSportsQuery } from '@/hooks/sport/get-sport-query';
import SportCard from '@/shares/common-components/sport-card';
import useSignup from '@/hooks/useSignup';
import { getDeviceInfo } from '@/shares/libs/utills/get-device-info';

type MaybeBaseData = Partial<SignUpStep1 & SignUpStep2>;

export default function Step3({
  baseData,
  onNext, // 필요시 부모에 선택값 전달용 (유지)
  defaultValues,
}: {
  baseData: MaybeBaseData; // Partial 수용
  onNext: (d: SignUpStep3) => void;
  defaultValues?: Partial<SignUpStep3>;
}) {
  const { register, handleSubmit, watch, getValues, setValue } =
    useForm<SignUpStep3>({
      resolver: zodResolver(signUpStep3Schema),
      defaultValues: {
        favoriteSports: defaultValues?.favoriteSports ?? [], // number[]
      },
    });

  // programmatic setValue를 쓰므로 필드 등록
  useEffect(() => {
    register('favoriteSports');
  }, [register]);

  const { data: sports } = useGetSportsQuery();
  const sportsList: { sports_name: string; sports_id: number }[] =
    sports?.data?.data?.sports ?? [];

  const selectedIds: number[] = watch('favoriteSports') || [];

  const { signup, isLoading } = useSignup();

  // id 기반 토글 (최대 3개)
  const toggle = (id: number) => {
    const current: number[] = getValues('favoriteSports') || [];
    const exists = current.includes(id);
    const next = exists
      ? current.filter((v) => v !== id)
      : current.length < 3
        ? [...current, id]
        : current;

    setValue('favoriteSports', next, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // ✅ 최종 서버 전송(기존 Done 로직 흡수)
  const onSubmit = async (data: SignUpStep3) => {
    // 필수값 체크(가드)
    if (
      !baseData.email ||
      !baseData.password ||
      !baseData.confirmPassword ||
      !baseData.phone ||
      !baseData.nickname
    ) {
      // 필요 시 라우팅/알림 처리
      console.warn('이전 단계 정보가 없습니다.');
      return;
    }

    // 선택값 부모에 전달(필요 시)
    // onNext?.(data);

    // 디바이스 정보
    const infos = await getDeviceInfo();

    // 이미지 파일 준비
    const imgFile =
      baseData.profileImage instanceof File
        ? baseData.profileImage
        : new File([], 'empty');

    // Done에서 만들던 payload 그대로
    const signupData = {
      name: baseData.nickname,
      nickname: baseData.nickname,
      email: baseData.email,
      password: baseData.password,
      passwordCheck: baseData.confirmPassword,
      phoneNumber: baseData.phone,
      platform: infos.platform,
      device_id: infos.deviceId,
      device_type: infos.deviceType,
      account_type: '0',
      favor: '0',
      // prefer_sports: data.favoriteSports,
      img: imgFile,
    };

    console.log(signupData);
    // 서버 전송
    signup(signupData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
      <div className='text-center'>
        <h2 className='text-lg font-semibold'>선호하는 스포츠를 선택하세요</h2>
        <p className='text-sm text-gray-500'>최대 3개까지 선택할 수 있어요</p>
      </div>

      <div className='flex flex-col space-y-4'>
        <h3 className='w-fit border-b-2 border-blue-500 text-lg font-semibold'>
          스포츠 종목
        </h3>

        <div className='box-border grid h-auto grid-cols-5 gap-2 overflow-y-scroll p-2'>
          {sportsList.map((sport) => (
            <div key={sport.sports_id} className='relative'>
              <SportCard
                sport={sport.sports_id}
                sport_name={sport.sports_name}
                selected={selectedIds.includes(sport.sports_id)}
                onClick={() => toggle(sport.sports_id)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className='flex justify-between pt-4'>
        <button
          type='submit'
          disabled={isLoading || selectedIds.length === 0}
          className='w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors ease-in-out focus:bg-blue-700 disabled:bg-[#E7E9EC] disabled:text-[#BDC0C6]'
        >
          {isLoading ? '전송 중…' : '회원가입'}
        </button>
      </div>
    </form>
  );
}

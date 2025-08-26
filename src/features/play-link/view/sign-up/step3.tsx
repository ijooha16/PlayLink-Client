import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  SignUpStep3,
  signUpStep3Schema,
} from '../../types/sign-up/sign-up-schema';
import { useGetSportsQuery } from '@/hooks/sport/get-sport-query';
import SportCard from '@/shares/common-components/sport-card';

export default function Step3({
  onNext,
  defaultValues,
}: {
  onNext: (d: SignUpStep3) => void;
  defaultValues?: Partial<SignUpStep3>;
}) {
  const { register, handleSubmit, watch, getValues, setValue } =
    useForm<SignUpStep3>({
      resolver: zodResolver(signUpStep3Schema),
      defaultValues,
    });

  const { data: sports } = useGetSportsQuery();
  const sportsList:{sports_name:string;sports_id:number;}[] = sports?.data?.data?.sports;

  const selected = watch('favoriteSports') || [];

  const toggle = (value: string) => {
    const current = getValues('favoriteSports') || [];
    if (current.includes(value)) {
      setValue(
        'favoriteSports',
        current.filter((v) => v !== value)
      );
    } else if (current.length < 3) {
      setValue('favoriteSports', [...current, value]);
    }
  };

  const onSubmit = (data: SignUpStep3) => onNext(data);

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
          {sportsList && sportsList.map((sport, idx) => (
            <div key={sport.sports_id} className='relative'>
              <SportCard sport={sport.sports_id} sport_name={sport.sports_name} selected={selected.includes(sport.sports_name)} onClick={() => toggle(sport.sports_name)}/>
                {/* <input
                  type='checkbox'
                  value={sport.sports_name}
                  id={`sport-${idx}`}
                  {...register('favoriteSports')}
                  onChange={() => toggle(sport.sports_name)}
                  checked={selected.includes(sport.sports_name)}
                  className='peer hidden'
                />
              <label
                htmlFor={`sport-${idx}`}
                className={`flex aspect-square h-full w-full flex-col items-center justify-center truncate rounded-full bg-gray-100 p-3 text-sm text-gray-600 transition-colors peer-checked:bg-blue-500 peer-checked:text-white`}
              >
                <span className='text-xl'>🎯</span>
                {sport.sports_name}
              </label> */}
            </div>
          ))}
        </div>
      </div>

      <div className='flex justify-between pt-4'>
        <button
          type='submit'
          disabled={selected.length === 0}
          className='w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors ease-in-out focus:bg-blue-700 disabled:bg-[#E7E9EC] disabled:text-[#BDC0C6]'
        >
          다음
        </button>
      </div>
    </form>
  );
}

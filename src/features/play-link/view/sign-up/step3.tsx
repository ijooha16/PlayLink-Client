import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  SignUpStep3,
  signUpStep3Schema,
} from '../../types/sign-up/sign-up-schema';
import { SPORTS_LIST } from '@/shares/dummy-data/dummy-data';

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
          {SPORTS_LIST.map((sport, idx) => (
            <div key={sport} className='relative'>
              <input
                type='checkbox'
                value={sport}
                id={`sport-${idx}`}
                {...register('favoriteSports')}
                onChange={() => toggle(sport)}
                checked={selected.includes(sport)}
                className='peer hidden'
              />
              <label
                htmlFor={`sport-${idx}`}
                className={`flex aspect-square h-full w-full flex-col items-center justify-center truncate rounded-full bg-gray-100 p-3 text-sm text-gray-600 transition-colors peer-checked:bg-blue-500 peer-checked:text-white`}
              >
                <span className='text-xl'>🎯</span>
                {sport}
              </label>
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

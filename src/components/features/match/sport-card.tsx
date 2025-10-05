import { Check } from '@/components/shared/icons';
import { SPORT_ICONS } from '@/constant/images';
import Image from 'next/image';

const SportCard = ({
  sport,
  sport_name,
  selected,
  onClick,
}: {
  sport: number;
  sport_name: string;
  selected?: boolean;
  onClick?: () => void;
}) => {
  const sportData =
    SPORT_ICONS[
      sport as keyof Omit<typeof SPORT_ICONS, 'POPULAR_SPORTS_IDS'>
    ] || SPORT_ICONS[31];
  const iconSrc = `/images/sport-svg-icons/${sportData.icon}`;

  return (
    <div
      className='flex cursor-pointer flex-col items-center gap-1'
      onClick={onClick}
    >
      <div
        className={`${
          selected
            ? 'border-2 border-brand-primary shadow-brand-medium'
            : 'border-border-neutral border hover:shadow-brand-soft'
        } relative flex h-[68px] w-[68px] flex-col items-center justify-center rounded-full bg-white transition-all`}
      >
        <Image
          width={32}
          height={32}
          src={iconSrc}
          alt={`${sport_name} 아이콘`}
          className='object-contain'
          sizes='32px'
          quality={60}
          loading='eager'
          priority={sport <= 10}
          unoptimized
        />

        {/* 선택 시 체크 아이콘 */}
        {selected && (
          <div className='absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary'>
            <Check size={12} className='text-white' />
          </div>
        )}
      </div>
      <div
        className={`text-label-m font-medium ${selected ? 'text-brand-primary' : 'text-text-strong'}`}
      >
        {sport_name}
      </div>
    </div>
  );
};

export default SportCard;

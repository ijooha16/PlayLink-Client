import Image from 'next/image';
import { useMemo } from 'react';

// 아이콘 맵을 컴포넌트 외부에 정의하여 재생성 방지
const ICON_MAP: { [key: number]: string } = {
  1: 'sport=1_Ic_Soccer.svg',
  2: 'sport=2_Ic_Futsal.svg',
  3: 'sport=3_Ic_Basketball.svg',
  4: 'sport=4_Ic_Volleyball.svg',
  5: 'sport=5_Ic_Foot.svg',
  6: 'sport=Ic_Handball.svg',  // 핸드볼
  7: 'sport=Ic_7_Badminton.svg',
  8: 'sport=8_Ic_TableT.svg',
  9: 'sport=9_Ic_Bowling.svg',
  10: 'sport=10_Ic_Hockey.svg',
  11: 'sport=11_Ic_Tennis.svg',
  12: 'sport=12_Ic_Squash.svg',
  13: 'sport=13_Ic_Swim.svg',
  14: 'sport=14_Ic_Surf.svg',
  15: 'sport=15_Ic_Fitness.svg',
  16: 'sport=16_Ic_Yoga.svg',
  17: 'sport=17_Ic_Crossfit.svg',
  18: 'sport=18_Ic_Aerobics.svg',
  19: 'sport=19_Ic_Dance.svg',
  20: 'sport=20_Ic_Running.svg',
  21: 'sport=Ic_Board.svg',  // 스케이트보드/롱보드
  22: 'sport=22_Ic_Bicycle.svg',
  23: 'sport=23_Ic_Roller.svg',
  24: 'sport=24_Ic_Golf.svg',
  25: 'sport=25_Ic_Boxing.svg',
  26: 'sport=26_Ic_Muaythai.svg',
  27: 'sport=27_Ic_Judo.svg',
  28: 'sport=28_Ic_Climing.svg',
  29: 'sport=29_Ic_Hiking.svg',
  30: 'sport=30_Ic_Ski.svg',
  31: 'sport=31_Ic_other.svg',
  32: 'sport=Ic_Baseball.svg',  // 야구
};

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
  // useMemo로 아이콘 경로 메모이제이션
  const iconSrc = useMemo(() => {
    const iconFile = ICON_MAP[sport] || 'sport=31_Ic_other.svg';
    return `/images/sport-svg-icons/${iconFile}`;
  }, [sport]);

  return (
    <div className='flex flex-col items-center gap-1 cursor-pointer' onClick={onClick}>
      <div
          className={`${
            selected
              ? 'border-2 border-brand-primary shadow-brand-medium'
              : 'border border-border-netural hover:shadow-brand-soft'
          } bg-white flex h-[68px] w-[68px] flex-col items-center justify-center rounded-full transition-all`}
        >
        <Image
          width={32}
          height={32}
          src={iconSrc}
          alt={`${sport_name} 아이콘`}
          className="object-contain"
          sizes="32px"
          quality={75}
          loading="eager"
          priority={sport <= 10}
        />
      </div>
      <div className={`text-label-m font-medium ${selected ? 'text-brand-primary' : 'text-text-strong'}`}>{sport_name}</div>
    </div>
  );
};

export default SportCard;

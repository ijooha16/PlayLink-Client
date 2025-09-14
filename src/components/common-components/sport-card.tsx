import Image from 'next/image';
import React from 'react';

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
  // 실제 파일명 기반 SVG 경로 생성
  const getSportIcon = (sportId: number) => {
    const iconMap: { [key: number]: string } = {
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

    // 매핑되지 않은 ID는 기타(other) 아이콘 사용
    return `/images/sport-svg-icons/${iconMap[sportId] || 'sport=31_Ic_other.svg'}`;
  };

  return (
    <div className='flex flex-col items-center gap-1 cursor-pointer' onClick={onClick}>
      <div
        className={`border-2 ${selected ? 'border-primary' : 'border-gray-200'} flex h-[54px] w-[54px] flex-col items-center justify-center rounded-full transition-all ${selected ? 'bg-blue-50' : 'bg-white'}`}
      >
        <Image
          width={32}
          height={32}
          src={getSportIcon(sport)}
          alt={`sport-${sport}`}
        />
      </div>
      <div className='text-center text-xs'>{sport_name}</div>
    </div>
  );
};

export default SportCard;

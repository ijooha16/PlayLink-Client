'use client';

import { Apple, Email, Kakao } from './icons';

type SocialIconButtonProps = {
  // 0: 이메일 | 1: 카카오 | 2: 애플
  type?: '0' | '1' | '2';
  onClick?: () => void;
  size?: number;
};

const SocialIconButton = ({ type, onClick }: SocialIconButtonProps) => {
  const style: Record<'1' | '0' | '2', string> = {
    0: 'bg-transparent text-text-strong !border-line-neutral font-semibold',
    1: 'bg-yellow-300 text-yellow-950 font-semibold',
    2: 'bg-black text-white font-regular',
  };

  return (
    <button
      className={`flex h-[48px] w-full items-center justify-center gap-2 rounded-lg !border text-label-l [border-style:solid] ${type ? style[type] : ''}`}
      onClick={onClick}
    >
      {type === '1' && (
        <>
          <Kakao size={24} />
          카카오로 시작하기
        </>
      )}
      {type === '0' && (
        <>
          <Email size={24} />
          이메일로 시작하기
        </>
      )}
      {type === '2' && (
        <>
          <Apple size={24} />
          Apple로 시작하기
        </>
      )}
    </button>
  );
};

export default SocialIconButton;

'use client';

import { Kakao, Email } from './icons';

type SocialIconButtonProps = {
  type?: 'kakao' | 'email';
  onClick?: () => void;
  size?: number;
};

const SocialIconButton = ({ type, onClick }: SocialIconButtonProps) => {
  const style: Record<'kakao' | 'email', string> = {
    kakao: 'bg-yellow-300 text-yellow-950',
    email: 'bg-transparent text-black !border-black',
  };

  return (
    <button
      className={`flex h-[48px] w-full items-center justify-center gap-2 rounded-lg !border [border-style:solid] ${type ? style[type] : ''} font-semibold`}
      onClick={onClick}
    >
      {type === 'kakao' && (
        <>
          <Kakao size={24} />
          카카오로 시작하기
        </>
      )}
      {type === 'email' && (
        <>
          <Email size={24} />
          이메일로 시작하기
        </>
      )}
    </button>
  );
};

export default SocialIconButton;

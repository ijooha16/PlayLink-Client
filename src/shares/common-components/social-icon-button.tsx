'use client';

import { MailIcon } from 'lucide-react';
import Image from 'next/image';

type SocialIconButtonProps = {
  src: string;
  alt: string;
  type?: 'kakao' | 'email';
  onClick?: () => void;
  size?: number;
};

const SocialIconButton = ({ alt, type, onClick }: SocialIconButtonProps) => {
  const style: Record<'kakao' | 'email', string> = {
    kakao: 'bg-yellow-300 text-yellow-950',
    email: 'bg-transparent text-black !border-black',
  };

  return (
    <button
      className={`flex h-14 w-full items-center justify-center gap-2 rounded-lg !border [border-style:solid] ${type ? style[type] : ''} font-semibold`}
      onClick={onClick}
    >
      {type === 'kakao' && (
        <>
          <Image
            src='/images/social/kakao-talk.png'
            alt={alt}
            width={24}
            height={24}
          />
          카카오로 시작하기
        </>
      )}
      {type === 'email' && (
        <>
          <MailIcon size={24} />
          이메일로 시작하기
        </>
      )}
    </button>
  );
};

export default SocialIconButton;

'use client';

import Image from 'next/image';

type SocialIconButtonProps = {
  src: string;
  alt: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
  size?: number;
};

const SocialIconButton = ({
  src,
  alt,
  type,
  onClick,
  size = 48,
}: SocialIconButtonProps) => {
  return (
    <button
      // onClick={소셜로그인 넣기}
      className='flex items-center justify-center rounded-full border border-gray-200 shadow-md transition-shadow focus:shadow-lg'
      style={{ width: size, height: size }}
      onClick={onClick}
      type={type}
    >
      <Image src={src} alt={alt} width={size * 0.6} height={size * 0.6} />
    </button>
  );
};

export default SocialIconButton;
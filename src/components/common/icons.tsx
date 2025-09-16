import React from 'react';

// SVG 파일들을 컴포넌트로 import
import EyeIcon from '../../../public/images/play-icons/eye.svg';
import EyeOffIcon from '../../../public/images/play-icons/eye-off.svg';
import ChevronBackIcon from '../../../public/images/play-icons/chevron-back.svg';
import KakaoIcon from '../../../public/images/social/Ic_kakao.svg';
import EmailIcon from '../../../public/images/social/Ic_mail.svg';

interface IconProps {
  size?: number;
  className?: string;
  width?: number;
  height?: number;
}

/**
 * 아이콘 공통 컴포넌트
 * @param size - 아이콘 크기 (기본값: 24)
 * @param className - 추가 CSS 클래스
 * @param width - 아이콘 너비 (size와 동일하게 설정됨)
 * @param height - 아이콘 높이 (size와 동일하게 설정됨)
 */
export const Eye: React.FC<IconProps> = ({ 
  size = 24, 
  className = '',
  width,
  height
}) => (
  <EyeIcon 
    width={width || size} 
    height={height || size} 
    className={className}
  />
);

export const EyeOff: React.FC<IconProps> = ({ 
  size = 24, 
  className = '',
  width,
  height
}) => (
  <EyeOffIcon 
    width={width || size} 
    height={height || size} 
    className={className}
  />
);

export const ChevronBack: React.FC<IconProps> = ({ 
  size = 20, 
  className = '',
  width,
  height
}) => (
  <ChevronBackIcon 
    width={width || size} 
    height={height || size} 
    className={className}
  />
);

export const ChevronLeft = ChevronBack;

export const Kakao: React.FC<IconProps> = ({ 
  size = 24, 
  className = '',
  width,
  height
}) => (
  <KakaoIcon 
    width={width || size} 
    height={height || size} 
    className={className}
  />
);

export const Email: React.FC<IconProps> = ({ 
  size = 24, 
  className = '',
  width,
  height
}) => (
  <EmailIcon 
    width={width || size} 
    height={height || size} 
    className={className}
  />
);
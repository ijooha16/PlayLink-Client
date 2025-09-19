import React from 'react';

// SVG 파일들을 컴포넌트로 import
import CancelIcon from '../../../public/images/play-icons/ic_cancel.svg';
import ChevronBackIcon from '../../../public/images/play-icons/ic_chevron_left.svg';
import ChevronRightIcon from '../../../public/images/play-icons/ic_chevron_right.svg';
import CircleIcon from '../../../public/images/play-icons/ic_circle.svg';
import EditIcon from '../../../public/images/play-icons/ic_edit.svg';
import EmailRoundIcon from '../../../public/images/play-icons/ic_email.svg';
import EyeIcon from '../../../public/images/play-icons/ic_eye.svg';
import EyeOffIcon from '../../../public/images/play-icons/ic_eye_off.svg';
import SearchIcon from '../../../public/images/play-icons/ic_search.svg';
import SearchNoneIcon from '../../../public/images/play-icons/ic_search_none.svg';
import LocationIcon from '../../../public/images/play-icons/ic_sm_location.svg';
import SparklesIcon from '../../../public/images/play-icons/ic_spark.svg';
import WelcomeIcon from '../../../public/images/play-icons/ic_welcome.svg';
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

export const Cancel: React.FC<IconProps> = ({
  size = 24,
  className = '',
  width,
  height
}) => (
  <CancelIcon width={width || size} height={height || size} className={className} />
);

export const ChevronRight: React.FC<IconProps> = ({
  size = 24,
  className = '',
  width,
  height
}) => (
  <ChevronRightIcon width={width || size} height={height || size} className={className} />
);

export const Welcome: React.FC<IconProps> = ({
  className = '',
  width,
  height
}) => (
  <WelcomeIcon width={width || 24} height={height || 24} className={className} />
);

export const Sparkles: React.FC<IconProps> = ({   
  size = 24,
  className = '',
  width,
  height
}) => (
  <SparklesIcon width={width || size} height={height || size} className={className} />
);

export const Circle: React.FC<IconProps> = ({
  size = 24,
  className = '',
  width,
  height
}) => (
  <CircleIcon width={width || size} height={height || size} className={className} />
);

export const Edit: React.FC<IconProps> = ({
  size = 24,
  className = '',
  width,
  height
}) => (
  <EditIcon width={width || size} height={height || size} className={className} />
);

export const Location: React.FC<IconProps> = ({
  size = 12,
  className = '',
  width,
  height
}) => (
  <LocationIcon width={width || size} height={height || size} className={className} />
);

export const Search: React.FC<IconProps> = ({
  size = 24,
  className = '',
  width,
  height
}) => (
  <SearchIcon width={width || size} height={height || size} className={className} />
);
  
export const SearchNone: React.FC<IconProps> = ({
  size = 72,
  className = '',
  width,
  height
}) => (
  <SearchNoneIcon width={width || size} height={height || size} className={className} />
);

export const EmailRound: React.FC<IconProps> = ({
  size = 20,
  className = '',
  width,
  height
}) => (
  <EmailRoundIcon width={width || size} height={height || size} className={className} />
);

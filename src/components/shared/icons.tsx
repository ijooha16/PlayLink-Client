import React from 'react';

// SVG 파일들을 컴포넌트로 import
import CancelIcon from '../../../public/images/play-icons/ic_cancel.svg';
import ChevronBackIcon from '../../../public/images/play-icons/ic_chevron_left.svg';
import ChevronRightIcon from '../../../public/images/play-icons/ic_chevron_right.svg';
import EditIcon from '../../../public/images/play-icons/ic_edit.svg';
import EmailRoundIcon from '../../../public/images/play-icons/ic_email.svg';
import EyeIcon from '../../../public/images/play-icons/ic_eye.svg';
import EyeOffIcon from '../../../public/images/play-icons/ic_eye_off.svg';
import SearchIcon from '../../../public/images/play-icons/ic_search.svg';
import SearchNoneIcon from '../../../public/images/play-icons/ic_search_none.svg';
import LocationIcon from '../../../public/images/play-icons/ic_sm_location.svg';
import KakaoIcon from '../../../public/images/social/Ic_kakao.svg';
import EmailIcon from '../../../public/images/social/Ic_mail.svg';

import CircleIcon1 from '../../../public/images/play-icons/welcome/ic_circle_01.svg';
import CircleIcon2 from '../../../public/images/play-icons/welcome/ic_circle_02.svg';
import SparklesIcon1 from '../../../public/images/play-icons/welcome/ic_spark_01.svg';
import SparklesIcon2 from '../../../public/images/play-icons/welcome/ic_spark_02.svg';
import WelcomeIcon from '../../../public/images/play-icons/welcome/ic_welcome.svg';

interface IconProps {
  size?: number;
  className?: string;
  width?: number;
  height?: number;
}

function createIcon(
  IconComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>,
  defaultSize: number = 24
) {
  const WrappedIcon: React.FC<IconProps> = ({
    size = defaultSize,
    className = '',
    width,
    height
  }) => (
    <IconComponent
      width={width || size}
      height={height || size}
      className={className}
    />
  );
  return WrappedIcon;
}

export const Eye = createIcon(EyeIcon);
export const EyeOff = createIcon(EyeOffIcon);
export const ChevronBack = createIcon(ChevronBackIcon, 20);
export const ChevronLeft = ChevronBack;
export const Kakao = createIcon(KakaoIcon);
export const Email = createIcon(EmailIcon);
export const Cancel = createIcon(CancelIcon);
export const ChevronRight = createIcon(ChevronRightIcon);

export const Welcome = createIcon(WelcomeIcon);
export const Sparkle1 = createIcon(SparklesIcon1);
export const Sparkle2 = createIcon(SparklesIcon2);
export const Circle1 = createIcon(CircleIcon1);
export const Circle2 = createIcon(CircleIcon2);

export const Edit = createIcon(EditIcon);
export const Location = createIcon(LocationIcon, 12);
export const Search = createIcon(SearchIcon);
export const SearchNone = createIcon(SearchNoneIcon, 72);
export const EmailRound = createIcon(EmailRoundIcon, 20);
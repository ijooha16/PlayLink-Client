import React from 'react';

// SVG 파일들을 컴포넌트로 import
import CancelIcon from '../../../public/images/play-icons/ic_cancel.svg';
import CheckIcon from '../../../public/images/play-icons/ic_check.svg';
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
  originalWidth: number = 24,
  originalHeight: number = 24
) {
  const WrappedIcon: React.FC<IconProps> = ({
    size = 24,
    className = '',
    width,
    height
  }) => {
    // 원본 아이콘의 비율 계산
    const aspectRatio = originalWidth / originalHeight;

    let finalWidth: number;
    let finalHeight: number;

    if (width && height) {
      // 둘 다 지정된 경우 그대로 사용
      finalWidth = width;
      finalHeight = height;
    } else if (width) {
      // width만 지정된 경우 비율에 맞춰 height 계산
      finalWidth = width;
      finalHeight = width / aspectRatio;
    } else if (height) {
      // height만 지정된 경우 비율에 맞춰 width 계산
      finalWidth = height * aspectRatio;
      finalHeight = height;
    } else {
      // size만 지정된 경우: 더 큰 쪽을 기준으로 비율 유지
      if (aspectRatio >= 1) {
        // 가로가 더 긴 경우 (width를 size로)
        finalWidth = size;
        finalHeight = size / aspectRatio;
      } else {
        // 세로가 더 긴 경우 (height를 size로)
        finalWidth = size * aspectRatio;
        finalHeight = size;
      }
    }

    return (
      <div
        style={{
          width: finalWidth,
          height: finalHeight,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
        className={className}
      >
        <IconComponent
          width="100%"
          height="100%"
          viewBox={`0 0 ${originalWidth} ${originalHeight}`}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            display: 'block',
            overflow: 'visible'
          }}
          preserveAspectRatio="xMidYMid meet"
        />
      </div>
    );
  };
  return WrappedIcon;
}

export const Eye = createIcon(EyeIcon, 24, 24);
export const EyeOff = createIcon(EyeOffIcon, 24, 24);
export const ChevronBack = createIcon(ChevronBackIcon, 20, 20);
export const ChevronLeft = ChevronBack;
export const Kakao = createIcon(KakaoIcon, 24, 24);
export const Email = createIcon(EmailIcon, 24, 24);
export const Cancel = createIcon(CancelIcon, 25, 24);
export const ChevronRight = createIcon(ChevronRightIcon, 24, 24);

export const Welcome = createIcon(WelcomeIcon, 335, 146);
export const Sparkle1 = createIcon(SparklesIcon1, 24, 24);
export const Sparkle2 = createIcon(SparklesIcon2, 24, 24);
export const Circle1 = createIcon(CircleIcon1, 24, 24);
export const Circle2 = createIcon(CircleIcon2, 24, 24);

export const Edit = createIcon(EditIcon, 24, 24);
export const Location = createIcon(LocationIcon, 17, 16);
export const Search = createIcon(SearchIcon, 20, 20);
export const SearchNone = createIcon(SearchNoneIcon, 120, 120);
export const EmailRound = createIcon(EmailRoundIcon, 20, 20);
export const Check = createIcon(CheckIcon, 24, 24);
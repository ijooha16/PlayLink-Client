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
import AddUser from '../../../public/images/play-icons/ic_add-user.svg'
import Error from '../../../public/images/play-icons/icon=Error.svg';
import Success from '../../../public/images/play-icons/icon=Information.svg';



interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  width?: number;
  height?: number;
  className?: string;
}

function createIcon(
  IconComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>,
  originalWidth = 24,
  originalHeight = 24
) {
  const WrappedIcon: React.FC<IconProps> = ({
    size,
    width,
    height,
    className,
    ...props
  }) => {
    const aspectRatio = originalWidth / originalHeight;

    let finalWidth = width ?? size ?? originalWidth;
    let finalHeight = height ?? size ?? originalHeight;

    if (size && !width && !height) {
      if (aspectRatio >= 1) {
        finalWidth = size;
        finalHeight = size / aspectRatio;
      } else {
        finalWidth = size * aspectRatio;
        finalHeight = size;
      }
    }

    return (
      <IconComponent
        width={finalWidth}
        height={finalHeight}
        viewBox={`0 0 ${originalWidth} ${originalHeight}`}
        className={className}
        preserveAspectRatio='xMidYMid meet'
        {...props}
      />
    );
  };
  return WrappedIcon;
}

export const Eye = createIcon(EyeIcon, 24, 24);
export const EyeOff = createIcon(EyeOffIcon, 24, 24);

export const ChevronBack = createIcon(ChevronBackIcon, 20, 20);
export const ChevronLeft = ChevronBack;
export const ChevronRight = createIcon(ChevronRightIcon, 24, 24);

export const Kakao = createIcon(KakaoIcon, 24, 24);
export const Email = createIcon(EmailIcon, 24, 24);
export const Cancel = createIcon(CancelIcon, 25, 24);

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

export const AddUserIcon = createIcon(AddUser, 152, 152);
export const ErrorIcon = createIcon(Error, 24, 24);
export const SuccessIcon = createIcon(Success, 24, 24);
/**
 * Icon Components with Dynamic Styling
 *
 * All icons support dynamic stroke and fill colors via className:
 *
 * @example
 * // Dynamic stroke color
 * <Check className="text-primary-800" />
 *
 * @example
 * // Dynamic stroke width
 * <Check className="[&_path]:stroke-[2.5]" />
 *
 * @example
 * // Combined styling
 * <Check className="text-gray-400 [&_path]:stroke-[2.5]" />
 *
 * Note: SVG icons use stroke="currentColor" to inherit text color
 */

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

import ProfileIcon from '../../../public/images/play-icons/ic_profile.svg';

import AddUser from '../../../public/images/play-icons/ic_add_user.svg';
import BubbleChatIcon from '../../../public/images/play-icons/ic_buble_chat.svg';
import CalendarIcon from '../../../public/images/play-icons/ic_calendar.svg';
import CircleIcon from '../../../public/images/play-icons/ic_circle.svg';
import Error from '../../../public/images/play-icons/ic_error.svg';
import Success from '../../../public/images/play-icons/ic_info.svg';
import LocationLargeIcon from '../../../public/images/play-icons/ic_location.svg';
import SortIcon from '../../../public/images/play-icons/ic_sort.svg';
import SparkIcon from '../../../public/images/play-icons/ic_spark.svg';
import UserLoveIcon from '../../../public/images/play-icons/ic_user_love.svg';
import UserMultiIcon from '../../../public/images/play-icons/ic_user_multi.svg';
import CircleIcon1 from '../../../public/images/play-icons/welcome/ic_circle_01.svg';
import CircleIcon2 from '../../../public/images/play-icons/welcome/ic_circle_02.svg';
import SparklesIcon1 from '../../../public/images/play-icons/welcome/ic_spark_01.svg';
import SparklesIcon2 from '../../../public/images/play-icons/welcome/ic_spark_02.svg';
import WelcomeIcon from '../../../public/images/play-icons/welcome/ic_welcome.svg';

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
export const Sparkle1 = createIcon(SparklesIcon1, 335, 146);
export const Sparkle2 = createIcon(SparklesIcon2, 335, 146);
export const Circle1 = createIcon(CircleIcon1, 335, 146);
export const Circle2 = createIcon(CircleIcon2, 335, 146);

export const Edit = createIcon(EditIcon, 24, 24);
export const Location = createIcon(LocationIcon, 17, 16);
export const Search = createIcon(SearchIcon, 20, 20);
export const SearchNone = createIcon(SearchNoneIcon, 120, 120);
export const EmailRound = createIcon(EmailRoundIcon, 20, 20);
export const Check = createIcon(CheckIcon, 24, 24);

export const AddUserIcon = createIcon(AddUser, 152, 152);
export const ErrorIcon = createIcon(Error, 24, 24);
export const SuccessIcon = createIcon(Success, 24, 24);
export const Profile = createIcon(ProfileIcon, 100, 100);

export const BubbleChat = createIcon(BubbleChatIcon, 24, 24);
export const Calendar = createIcon(CalendarIcon, 24, 24);
export const Circle = createIcon(CircleIcon, 24, 24);
export const LocationLarge = createIcon(LocationLargeIcon, 24, 24);
export const Sort = createIcon(SortIcon, 24, 24);
export const Spark = createIcon(SparkIcon, 24, 24);
export const UserLove = createIcon(UserLoveIcon, 24, 24);
export const UserMulti = createIcon(UserMultiIcon, 24, 24);

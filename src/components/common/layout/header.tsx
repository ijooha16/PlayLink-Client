'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { ChevronLeft } from '@/components/common/icons';
import { PATHS } from '@/constant/paths';

type BackBtnMode = boolean | 'home';

type HeaderProps = {
  title?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  backbtn?: BackBtnMode;
  onBack?: () => void;
  transparent?: boolean;
  blur?: boolean;
  border?: boolean;
  shadow?: boolean;
  safeAreaTop?: boolean;
  elevateOnScroll?: boolean;
  heightClassName?: string;
  className?: string;
  ariaLabel?: string;
  leftOverflow?: 'nowrap-scroll' | 'wrap' | 'truncate';
};

type PlaceholderProps = {
  heightClassName?: string;
  safeAreaTop?: boolean;
};

type HeaderComponent = React.FC<HeaderProps> & {
  Placeholder: React.FC<PlaceholderProps>;
};

const BaseHeight = 'h-14';

const Header: HeaderComponent = (({
  title,
  left,
  right,
  backbtn = false,
  onBack,
  transparent = false,
  blur = false,
  border = false,
  shadow = false,
  safeAreaTop = false,
  elevateOnScroll = false,
  heightClassName = BaseHeight,
  className,
  ariaLabel = 'page header',
  leftOverflow = 'nowrap-scroll',
}: HeaderProps) => {
  const router = useRouter();
  const [elevated, setElevated] = React.useState(false);

  // 스크롤 시 elevation 적용
  React.useEffect(() => {
    if (!elevateOnScroll) return;
    const onScroll = () => setElevated(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [elevateOnScroll]);

  const handleBack = React.useCallback(() => {
    if (onBack) return onBack();
    if (backbtn === 'home') router.replace(PATHS.HOME);
    else router.back();
  }, [onBack, backbtn, router]);

  const leftNode = React.useMemo(() => {
    if (left !== undefined) return left;
    if (!backbtn) return <span className='w-9' />;
    return (
      <button
        type='button'
        aria-label='go back'
        onClick={handleBack}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleBack();
        }}
        className='text-icon-strong inline-flex h-9 w-9 items-center justify-center'
      >
        <ChevronLeft />
      </button>
    );
  }, [left, backbtn, handleBack]);

  const rightNode = right ?? <span className='w-9' />;

  // 왼쪽 영역 오버플로 스타일 (타이틀이 없을 때만 적용 의미가 있음)
  const leftOverflowClass =
    leftOverflow === 'nowrap-scroll'
      ? 'whitespace-nowrap overflow-x-auto scrollbar-none'
      : leftOverflow === 'wrap'
        ? 'whitespace-normal break-words'
        : 'min-w-0 truncate';

  const hasTitle = Boolean(title);

  return (
    <>
      <header
        aria-label={ariaLabel}
        className={twMerge(
          'fixed left-1/2 top-0 z-50 w-full max-w-[640px] -translate-x-1/2',
          transparent ? 'bg-transparent text-white' : 'bg-white text-gray-900',
          blur && 'backdrop-blur',
          (border && !transparent) || elevated
            ? 'border-black/10 border-b'
            : 'border-b border-transparent',
          (shadow || elevated) && !transparent ? 'shadow-sm' : '',
          safeAreaTop ? 'pt-[env(safe-area-inset-top)]' : '',
          className
        )}
        role='banner'
      >
        <div
          className={twMerge(
            hasTitle
              ? 'relative flex items-center px-4'
              : 'grid grid-cols-[1fr_auto] items-center gap-2 px-4', // 타이틀 없으면 좌/우만
            heightClassName
          )}
        >
          {/* 왼쪽 영역 */}
          <div
            className={twMerge(
              'flex min-w-0 items-center',
              !hasTitle && leftOverflowClass
            )}
          >
            {leftNode}
          </div>

          {/* 타이틀 */}
          {hasTitle && (
            <div className='pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
              <h1 className='text-title-03 max-w-[70vw] truncate font-semibold'>
                {title}
              </h1>
            </div>
          )}

          {/* 오른쪽 영역 */}
          <div className={twMerge('ml-auto flex items-center')}>
            {rightNode}
          </div>
        </div>
      </header>

      {/* 고정 헤더 아래 컨텐츠 가림 방지용 placeholder */}
      <Header.Placeholder
        heightClassName={heightClassName}
        safeAreaTop={safeAreaTop}
      />
    </>
  );
}) as HeaderComponent;

Header.Placeholder = ({
  heightClassName = BaseHeight,
  safeAreaTop = false,
}: PlaceholderProps) => (
  <div
    aria-hidden
    className={twMerge(
      'w-full',
      heightClassName,
      safeAreaTop ? 'pt-[env(safe-area-inset-top)]' : ''
    )}
  />
);

export default Header;

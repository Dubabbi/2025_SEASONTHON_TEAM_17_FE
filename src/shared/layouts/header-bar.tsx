import BellIcon from '@assets/icons/alarm.svg?react';
import ArrowIcon from '@assets/icons/arrow.svg?react';
import LogoIcon from '@assets/icons/logo.svg?react';
import { useNavigate } from 'react-router-dom';

export type HeaderVariant = 'home' | 'title';

export interface HeaderProps {
  variant?: HeaderVariant; // 'home' | 'title'
  title?: string; // variant='title'일 때 표시
  backgroundColorClass?: string;
  showDivider?: boolean;
  onBellClick?: () => void; // home 우측 버튼
  onBack?: () => void; // title 좌측 back
  className?: string;
}

export default function Header({
  variant = 'title',
  title = '',
  backgroundColorClass = 'bg-white',
  showDivider = true,
  onBellClick,
  onBack,
  className = '',
}: HeaderProps) {
  const nav = useNavigate();
  const handleBack = () => (onBack ? onBack() : nav(-1));

  return (
    <header
      className={[
        'sticky top-0 z-[var(--z-header)] px-[2.4rem] py-[1.8rem]',
        backgroundColorClass,
        showDivider ? 'border-gray-200 border-b' : '',
        className,
      ].join(' ')}
    >
      <div className="grid grid-cols-[2.8rem_1fr_2.8rem] items-center">
        <div className="h-[2.8rem] w-[2.8rem]">
          {variant === 'title' && (
            <button
              type="button"
              onClick={handleBack}
              aria-label="뒤로가기"
              className="grid h-[2.8rem] w-[2.8rem] place-items-center"
            >
              <ArrowIcon className="h-[2.8rem] w-[2.8rem] rotate-180 text-gray-600" />
            </button>
          )}
        </div>

        <div className="flex-row-center">
          {variant === 'home' ? (
            <LogoIcon className="h-[2.8rem] w-[2.8rem] text-primary-500" />
          ) : (
            <h1 className={['heading2-600 text-gray-900', title ? '' : 'invisible'].join(' ')}>
              {title}
            </h1>
          )}
        </div>

        <div className="flex h-[2.8rem] w-[2.8rem] items-center justify-end">
          {variant === 'home' ? (
            <button
              type="button"
              aria-label="알림"
              onClick={onBellClick}
              className="grid place-items-center"
            >
              <BellIcon className="h-[2.8rem] w-[2.8rem] text-primary-500" />
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

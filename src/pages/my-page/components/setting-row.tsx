import ArrowIcon from '@assets/icons/arrow.svg?react';
import { cn } from '@libs/cn';
import type { ElementType, ReactNode } from 'react';

type SettingRowProps = {
  label: string;
  onClick?: () => void;
  right?: ReactNode;
  showIcon?: boolean;
  subText?: string;
  className?: string;
  ariaLabel?: string;
  divider?: 'inset' | 'full' | 'none';
  as?: 'button' | 'div' | 'a';
  href?: string;
  labelStyle?: string;
};

export default function SettingRow({
  label,
  onClick,
  right,
  showIcon,
  subText,
  className,
  ariaLabel,
  labelStyle,
  as,
  href,
}: SettingRowProps) {
  const arrow = showIcon ?? showIcon ?? false;
  const clickable = !!onClick || arrow || as === 'a';
  const Wrapper: ElementType = as ?? (clickable ? 'button' : 'div');

  return (
    <div className={cn('relative bg-transparent', className)}>
      <Wrapper
        {...(Wrapper === 'a' ? { href } : {})}
        {...(Wrapper === 'button' ? { type: 'button' } : {})}
        onClick={onClick}
        aria-label={ariaLabel ?? label}
        className={cn(
          'relative flex w-full items-center justify-between py-[2rem] text-left',
          clickable && 'active:opacity-80',
        )}
      >
        <span className={cn('heading2-600 text-gray-900', labelStyle)}>{label}</span>

        <div className="flex cursor-pointer items-center gap-[0.8rem]">
          {subText && <span className="body2-600 text-gray-500">{subText}</span>}
          {right}
          {arrow && <ArrowIcon aria-hidden className="size-[2rem] text-gray-500" />}
        </div>
      </Wrapper>
    </div>
  );
}

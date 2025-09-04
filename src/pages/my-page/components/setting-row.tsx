import ArrowIcon from '@assets/icons/arrow.svg?react';
import { cn } from '@libs/cn';
import type { ReactNode } from 'react';

type SettingRowProps = {
  label: string;
  onClick?: () => void;
  right?: ReactNode;
  showIcon?: boolean;
  subText?: string;
  className?: string;
  ariaLabel?: string;
  divider?: 'inset' | 'full' | 'none';
  labelStyle?: string;
  clickTarget?: 'label' | 'right';
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
  clickTarget = 'right',
}: SettingRowProps) {
  const arrow = !!showIcon;
  const isLabelClickable = clickTarget === 'label' && !!onClick;
  const isRightClickable = clickTarget === 'right' && !!onClick;

  return (
    <div className={cn('relative bg-transparent', className)}>
      <div className={cn('relative flex w-full items-center justify-between py-[2rem] text-left')}>
        {isLabelClickable ? (
          <button
            type="button"
            onClick={onClick}
            aria-label={ariaLabel ?? label}
            className={cn(
              'heading2-600 text-gray-900',
              labelStyle,
              'cursor-pointer hover:opacity-80',
            )}
          >
            {label}
          </button>
        ) : (
          <span className={cn('heading2-600 text-gray-900', labelStyle)}>{label}</span>
        )}

        <div className="flex items-center gap-[0.8rem]">
          {subText && <span className="body2-600 text-gray-500">{subText}</span>}

          {isRightClickable ? (
            <button
              type="button"
              onClick={onClick}
              aria-label={ariaLabel ?? label}
              className="flex cursor-pointer items-center gap-[0.8rem] hover:opacity-80"
            >
              {right}
              {arrow && <ArrowIcon aria-hidden className="size-[2rem] text-gray-500" />}
            </button>
          ) : (
            <div className="flex items-center gap-[0.8rem]">
              {right}
              {arrow && <ArrowIcon aria-hidden className="size-[2rem] text-gray-500" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

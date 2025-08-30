import LogoIcon from '@assets/icons/logo.svg?react';
import { cn } from '@libs/cn';
import type * as React from 'react';

type HighlightColor = 'primary' | 'gray';

interface IntroProps {
  /** 위쪽 문장 (기본: 디자인 예시) */
  title?: string;
  /** 가운데 강조 텍스트 (기본: 마음:ON) */
  highlight?: string;
  /** 강조 텍스트 색상 (기본: primary-800, 옵션: gray-800) */
  highlightColor?: HighlightColor;
  icon?: React.ReactNode;
  iconClassName?: string;
  className?: string;
}

export default function Intro({
  title = '혼자가 아닌, 안전하고 따뜻하게',
  highlight = '마음:ON',
  highlightColor = 'primary',
  icon,
  iconClassName,
  className,
}: IntroProps) {
  return (
    <div className={cn('flex-col-center gap-[2.5rem]', className)}>
      <div className="flex-col-center gap-[0.5rem]">
        <p className="sub-heading2 text-gray-800">{title}</p>
        <p
          className={cn(
            'sub-heading2',
            highlightColor === 'primary' ? 'text-primary-800' : 'text-gray-800',
          )}
        >
          {highlight}
        </p>
      </div>

      <div className={cn('h-[12rem] w-[12rem]', iconClassName)}>
        {icon ?? <LogoIcon className="h-full w-full" aria-hidden />}
      </div>
    </div>
  );
}

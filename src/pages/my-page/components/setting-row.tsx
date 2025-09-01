import ArrowIcon from '@assets/icons/arrow.svg?react';
import Button from '@components/button/button';
import { cn } from '@libs/cn';
import type { ReactNode, SVGProps } from 'react';

type SettingRowProps = {
  label: string;
  onClick?: () => void;
  right?: ReactNode;
  showChevron?: boolean;
  subText?: string;
  className?: string;
  ariaLabel?: string;
  // (선택) 다른 아이콘으로 바꾸고 싶을 때 주입
  ChevronComponent?: React.ComponentType<SVGProps<SVGSVGElement>>;
};

export default function SettingRow({
  label,
  onClick,
  right,
  showChevron,
  subText,
  className,
  ChevronComponent = ArrowIcon,
}: SettingRowProps) {
  const clickable = !!onClick || showChevron;

  return (
    <Button
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : -1}
      onClick={onClick}
      onKeyDown={(e) => {
        if (clickable && (e.key === 'Enter' || e.key === ' ')) onClick?.();
      }}
      className={cn(
        'flex h-[5.6rem] items-center justify-between border-gray-200 border-b bg-transparent px-[2.4rem]',
        clickable && 'active:opacity-80',
        className,
      )}
    >
      <span className="body2-600 text-gray-900">{label}</span>

      <div className="flex items-center gap-[0.8rem]">
        {subText && <span className="body2-500 text-gray-500">{subText}</span>}
        {right}
        {showChevron && <ChevronComponent className="size-[1.8rem] shrink-0 text-gray-400" />}
      </div>
    </Button>
  );
}

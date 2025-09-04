import Button from '@components/button/button';
import { cn } from '@libs/cn';
import type { ReactNode } from 'react';

export type SegmentedTabItem = { value: string; label: ReactNode };

type Props = {
  items: SegmentedTabItem[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
  itemClassName?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  ariaLabel?: string;
};

export default function SegmentedTabs({
  items,
  value,
  onChange,
  className,
  itemClassName = ' w-[11.5rem]',
  activeClassName,
  inactiveClassName,
  ariaLabel = '탭 목록',
}: Props) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn('flex items-center gap-[2.4rem]', className)}
    >
      {items.map(({ value: v, label }) => {
        const active = v === value;
        return (
          <Button
            key={v}
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(v)}
            className={cn(
              'body2-500 rounded-[20px] py-[1.6rem]',
              active ? 'bg-primary-600 text-gray-50' : 'bg-transparent text-gray-900 opacity-60',
              itemClassName,
              active ? activeClassName : inactiveClassName,
            )}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
}

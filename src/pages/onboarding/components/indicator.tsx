import { cn } from '@libs/cn';
import { useMemo } from 'react';

export type IndicatorProps = {
  total: number;
  index: number;
  onSelect?: (i: number) => void;
  className?: string;
};

const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);

export default function Indicator({ total, index, onSelect, className }: IndicatorProps) {
  const keys = useMemo(() => Array.from({ length: total }, () => uid()), [total]);

  return (
    <div
      className={cn('flex items-center gap-2', className)}
      role="tablist"
      aria-label="온보딩 단계"
    >
      {keys.map((key, i) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={i === index}
          aria-label={`${i + 1}/${total}`}
          onClick={() => onSelect?.(i)}
          className={cn(
            'h-[8px] rounded-full transition-all duration-200 ease-out',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300',
            i === index ? 'w-[20px] bg-primary-600' : 'w-[8px] bg-gray-300',
          )}
        />
      ))}
    </div>
  );
}

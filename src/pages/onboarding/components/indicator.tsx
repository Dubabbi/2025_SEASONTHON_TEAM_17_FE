import { cn } from '@libs/cn';
import { useMemo } from 'react';

type Props = {
  total: number;
  index: number;
  className?: string;
};

const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);

export default function Indicator({ total, index, className }: Props) {
  const dotKeys = useMemo(() => Array.from({ length: total }, () => uid()), [total]);

  return (
    <div
      className={cn('flex items-center gap-2', className)}
      role="tablist"
      aria-label="온보딩 단계"
    >
      {dotKeys.map((key, i) => (
        <span
          key={key}
          aria-hidden
          className={cn(
            'inline-block h-[8px] rounded-full transition-all',
            i === index ? 'w-[20px] bg-primary-600' : 'w-[8px] bg-gray-300',
          )}
        />
      ))}
    </div>
  );
}

import type { EmotionItem } from '@apis/emotions/emotion-queries';
import { cn } from '@libs/cn';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  items: EmotionItem[];
  className?: string;
  active?: 'curr' | 'prev';
};

export default function EmotionBarChart({ items, className, active = 'prev' }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const max = useMemo(() => Math.max(1, ...items.flatMap((i) => [i.prev, i.curr])), [items]);

  return (
    <div className={cn('w-full flex-col gap-[3rem]', className)}>
      <div className="flex-row gap-[1.2rem] px-[0.4rem]">
        <LegendDot
          className={active === 'prev' ? 'bg-primary-600' : 'bg-primary-200/35'}
          label="지난 주"
        />
        <LegendDot
          className={active === 'curr' ? 'bg-primary-600' : 'bg-primary-200/35'}
          label="이번 주"
        />
      </div>

      <div className="scrollbar-hide overflow-x-auto">
        <div role="img" className="flex h-[25rem] flex-nowrap items-end gap-[1.3rem] px-[0.4rem]">
          {items.map((it) => (
            <BarSingle
              key={it.label}
              label={it.label}
              value={active === 'curr' ? it.curr : it.prev}
              max={max}
              ready={ready}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <div className="flex-row-center gap-[0.6rem]">
      <span className={cn('block h-[1rem] w-[1rem] rounded-full', className)} />
      <span className="detail text-gray-700">{label}</span>
    </div>
  );
}

function BarSingle({
  label,
  value,
  max,
  ready,
}: {
  label: string;
  value: number;
  max: number;
  ready: boolean;
}) {
  const h = Math.round((value / max) * 200);

  return (
    <div className="flex-col-center flex-shrink-0 gap-[0.8rem]">
      <div className="relative h-[20rem] w-[2.6rem] rounded-[8px] bg-primary-200/35">
        <div
          className={cn(
            'absolute right-0 bottom-0 left-0 rounded-[8px] transition-[height] duration-700 ease-out',
            'bg-gradient-to-t from-primary-600 to-primary-400',
          )}
          style={{ height: ready ? `${h}px` : 0 }}
          aria-hidden
        />
        <span className="detail -top-[2.2rem] -translate-x-1/2 pointer-events-none absolute left-1/2 whitespace-nowrap text-primary-600">
          {value}회
        </span>
      </div>
      <div className="detail whitespace-nowrap text-gray-700">{label}</div>
    </div>
  );
}

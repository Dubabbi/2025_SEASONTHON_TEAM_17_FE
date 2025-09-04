import { cn } from '@libs/cn';
import { useEffect, useMemo, useState } from 'react';

type Item = { label: string; prev: number; curr: number };

type Props = {
  items: Item[];
  className?: string;
};

export default function EmotionBarChart({ items, className }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const max = useMemo(() => Math.max(1, ...items.flatMap((i) => [i.prev, i.curr])), [items]);

  return (
    <div className={cn('w-full flex-col gap-[3rem]', className)}>
      <div className="flex-row gap-[1.2rem] px-[0.4rem]">
        <LegendDot className="bg-primary-200" label="지난 주" />
        <LegendDot className="bg-primary-600" label="이번 주" />
      </div>

      <div
        role="img"
        aria-label="감정별 지난 주/이번 주 기록 수 막대 차트"
        className="grid h-[22rem] grid-cols-5 items-end gap-[1.2rem]"
      >
        {items.map((it) => (
          <BarGroup
            key={it.label}
            label={it.label}
            prev={it.prev}
            curr={it.curr}
            max={max}
            ready={ready}
          />
        ))}
      </div>
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <div className="flex-row items-center gap-[0.6rem]">
      <span className={cn('block h-[1rem] w-[1rem] rounded-full', className)} />
      <span className="detail text-gray-700">{label}</span>
    </div>
  );
}

function BarGroup({
  label,
  prev,
  curr,
  max,
  ready,
}: {
  label: string;
  prev: number;
  curr: number;
  max: number;
  ready: boolean;
}) {
  return (
    <div className="flex-col-items-center gap-[0.8rem]">
      <div className="flex-row items-end gap-[0.8rem]">
        <Bar value={prev} max={max} color="bg-primary-200" ready={ready} />
        <Bar value={curr} max={max} color="bg-primary-600" ready={ready} />
      </div>
      <div className="detail text-gray-700">{label}</div>
    </div>
  );
}

function Bar({
  value,
  max,
  color,
  ready,
}: {
  value: number;
  max: number;
  color: string;
  ready: boolean;
}) {
  const h = Math.round((value / max) * 200);
  return (
    <div className="relative h-[20rem] w-[2.6rem] rounded-[8px] bg-gray-200">
      <div
        className={cn(
          'absolute right-0 bottom-0 left-0 rounded-[8px] transition-[height] duration-700 ease-out',
          color,
        )}
        style={{ height: ready ? `${h}px` : 0 }}
        aria-hidden
      />
      <span className="detail -top-[2.2rem] -translate-x-1/2 pointer-events-none absolute left-1/2 whitespace-nowrap text-primary-600">
        {value}회
      </span>
    </div>
  );
}

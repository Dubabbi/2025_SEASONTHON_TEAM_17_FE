import ArrowIcon from '@assets/icons/calendar-arrow.svg?react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useMemo, useState } from 'react';

type Variant = 'flat' | 'card';

type CalendarProps = {
  value?: Date;
  onChange?: (d: Date) => void;
  marked?: string[]; // yyyy-MM-dd 리스트
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  accent?: string; // 포인트 컬러
  onMonthChange?: (view: Date) => void;
  variant?: Variant; // ← NEW: "flat"이면 이미지1 스타일
  showTodayHint?: boolean; // 오늘 점선/표식 (기본 false)
};

const fmt = (d: Date) => format(d, 'yyyy-MM-dd');

export default function Calendar({
  value,
  onChange,
  marked = [],
  weekStartsOn = 0,
  className = 'rounded-[20px] py-[1.2rem] outline outline-gray-200',
  accent = '#FF2D77',
  onMonthChange,
  variant = 'flat',
  showTodayHint = false,
}: CalendarProps) {
  const [view, setView] = useState<Date>(() => value ?? new Date());
  useEffect(() => {
    if (value) setView(value);
  }, [value]);

  const markSet = useMemo(() => new Set(marked), [marked]);
  const monthLabel = useMemo(() => format(view, 'yyyy년 M월', { locale: ko }), [view]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(view), { weekStartsOn });
    const end = endOfWeek(endOfMonth(view), { weekStartsOn });
    return eachDayOfInterval({ start, end });
  }, [view, weekStartsOn]);

  const weeks = useMemo(() => {
    const out: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) out.push(days.slice(i, i + 7));
    return out;
  }, [days]);

  const selected = value ?? null;
  const go = (n: number) =>
    setView((v) => {
      const nv = addMonths(v, n);
      onMonthChange?.(nv);
      return nv;
    });
  const goToday = () => {
    const t = new Date();
    onChange?.(t);
    setView(t);
    onMonthChange?.(t);
  };

  const cellSize = 'px-[1.4rem] pt-[0.4rem] pb-[2.7rem]';
  const ringRadius = 'rounded-[4px]';

  return (
    <section className={className} style={{ ['--accent' as any]: accent }} aria-label="달력">
      <header className="mb-[0.6rem] flex-row-between px-[1.8rem] py-[1.2rem]">
        <div className="flex items-center justify-center gap-[0.8rem]">
          <button
            onClick={() => go(-1)}
            className="grid place-items-center rounded-lg text-gray-700 hover:bg-black/5"
            aria-label="이전 달"
            type="button"
          >
            <ArrowIcon className="h-[2.4rem] w-[2.4rem]" />
          </button>

          <div className="font-semibold text-[1.6rem] tracking-[-0.2px]">{monthLabel}</div>

          <button
            onClick={() => go(1)}
            className="grid place-items-center rounded-lg text-gray-700 hover:bg-black/5"
            aria-label="다음 달"
            type="button"
          >
            <ArrowIcon className="h-[2.4rem] w-[2.4rem] rotate-180" />
          </button>
        </div>

        <button
          onClick={goToday}
          className="rounded-lg px-2 py-1 text-[1.3rem] text-gray-600 hover:bg-black/5"
          type="button"
        >
          오늘
        </button>
      </header>

      {/* 요일 헤더 */}
      <div className="sub-body-700 grid grid-cols-7 px-[1.5rem] pb-[0.55rem] text-center">
        {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
          <div
            key={d}
            className={
              i === 0 ? 'text-[var(--accent)]' : i === 6 ? 'text-[#2955FF]' : 'text-gray-700'
            }
          >
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-y-2 px-4 pb-4">
        {weeks.flatMap((week) =>
          week.map((day) => {
            const dayKey = day.getTime(); // 또는: const dayKey = format(day, 'yyyy-MM-dd');

            const outside = !isSameMonth(day, view);
            const selectedDay = selected && isSameDay(day, selected);
            const hasMark = markSet.has(fmt(day));

            return (
              <div key={dayKey} className="flex justify-center">
                <button
                  type="button"
                  onClick={() => onChange?.(day)}
                  aria-pressed={!!selectedDay}
                  className={[
                    'relative isolate grid place-items-center outline-none transition',
                    cellSize,
                    ringRadius,
                    variant === 'card' ? 'bg-white shadow-sm' : 'bg-transparent',
                    'focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40',
                  ].join(' ')}
                >
                  {selectedDay && (
                    <span
                      className={[
                        'pointer-events-none absolute inset-0 border-2',
                        ringRadius,
                        'border-[var(--accent)]',
                      ].join(' ')}
                      aria-hidden
                    />
                  )}

                  {!selectedDay && variant === 'flat' && (
                    <span
                      className={[
                        'pointer-events-none absolute inset-0 opacity-0 transition-opacity',
                        ringRadius,
                        'border border-[var(--accent)]/25 hover:opacity-100',
                      ].join(' ')}
                      aria-hidden
                    />
                  )}

                  {/* 날짜 숫자 */}
                  <span
                    className={[
                      'relative z-10 select-none font-semibold text-[1.8rem]',
                      outside ? 'text-gray-300' : 'text-gray-900',
                    ].join(' ')}
                  >
                    {format(day, 'd')}
                  </span>

                  {/* 오늘 표식은 기본 비활성 (이미지1 느낌) */}
                  {showTodayHint && !selectedDay && (
                    <span
                      className="-bottom-1 -translate-x-1/2 pointer-events-none absolute left-1/2 z-10 h-1 w-8 rounded-full border border-[var(--accent)]/45 border-dashed"
                      aria-hidden
                    />
                  )}

                  {/* 체크 뱃지 (하단 중앙) */}
                  {hasMark && (
                    <span className="-translate-x-1/2 absolute bottom-1.5 left-1/2 z-10 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                      <CheckIcon />
                    </span>
                  )}
                </button>
              </div>
            );
          }),
        )}
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M3 6.2 4.9 8 9 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

import ArrowIcon from '@assets/icons/calendar-arrow.svg?react';
import CheckIcon from '@assets/icons/check.svg?react';
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
  marked?: string[]; // yyyy-MM-dd
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  onMonthChange?: (view: Date) => void;
  variant?: Variant;
  showTodayHint?: boolean;
};

const fmt = (d: Date) => format(d, 'yyyy-MM-dd');

export default function Calendar({
  value,
  onChange,
  marked = [],
  weekStartsOn = 0,
  className = 'rounded-[20px] py-[1.2rem] outline outline-gray-200',
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

  return (
    <section className={className} aria-label="달력">
      <header className="mb-[0.6rem] flex-row-between px-[1.8rem] py-[1.2rem]">
        <div className="flex items-center justify-center gap-[0.8rem]">
          <button
            onClick={() => go(-1)}
            className="grid place-items-center rounded-lg text-gray-700 hover:bg-black/5"
            aria-label="이전 달"
            type="button"
          >
            <ArrowIcon className="h-[2.4rem] w-[2.4rem] cursor-pointer" />
          </button>

          <div className="font-semibold text-[1.6rem] tracking-[-0.2px]">{monthLabel}</div>

          <button
            onClick={() => go(1)}
            className="grid place-items-center rounded-lg text-gray-700 hover:bg-black/5"
            aria-label="다음 달"
            type="button"
          >
            <ArrowIcon className="h-[2.4rem] w-[2.4rem] rotate-180 cursor-pointer" />
          </button>
        </div>

        <button
          onClick={goToday}
          className="sub-body-700 cursor-pointer rounded-[4px] px-[0.8rem] py-[0.55rem] text-gray-600 hover:bg-gray-600/5"
          type="button"
        >
          오늘
        </button>
      </header>

      {/* 요일 헤더 */}
      <div className="sub-body-700 grid grid-cols-7 px-[1.9rem] pb-[0.55rem] text-center">
        {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
          <div
            key={d}
            className={
              i === 0 ? 'text-error-default' : i === 6 ? 'text-success-default' : 'text-gray-800'
            }
          >
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 px-[1.9rem]">
        {weeks.flatMap((week) =>
          week.map((day) => {
            const dayKey = day.getTime();

            const outside = !isSameMonth(day, view);
            const selectedDay = selected && isSameDay(day, selected);
            const hasMark = markSet.has(fmt(day));
            const dow = day.getDay(); // 0:일 ~ 6:토
            const colorClass = outside
              ? 'text-gray-300'
              : dow === 0
                ? 'text-error-default'
                : dow === 6
                  ? 'text-success-default'
                  : 'text-gray-900';

            return (
              <div key={dayKey} className="flex justify-center">
                <button
                  type="button"
                  onClick={() => onChange?.(day)}
                  aria-pressed={!!selectedDay}
                  className={[
                    'relative isolate grid cursor-pointer place-items-center outline-none transition',
                    cellSize,
                    variant === 'card' ? 'bg-gray-50 shadow-sm' : 'bg-transparent',
                    'focus-visible:ring-2 focus-visible:ring-primary-400',
                  ].join(' ')}
                >
                  {selectedDay && (
                    <span
                      className={[
                        'pointer-events-none absolute',
                        '-translate-x-1/2 bottom-[0rem] left-1/2',
                        'h-[5.2rem] w-[4.4rem] rounded-[5px]',
                        'border-2 border-primary-400',
                      ].join(' ')}
                      aria-hidden
                    />
                  )}

                  {/* 날짜 숫자 */}
                  <span className={['body2-600 relative z-10 select-none', colorClass].join(' ')}>
                    {format(day, 'd')}
                  </span>

                  {/* 오늘 표식은 기본 비활성 */}
                  {showTodayHint && !selectedDay && (
                    <span
                      className="-bottom-1 -translate-x-1/2 pointer-events-none absolute left-1/2 z-10 h-1 w-8 rounded-full border border-primary-800 border-dashed"
                      aria-hidden
                    />
                  )}

                  {/* 체크 뱃지 */}
                  {hasMark && (
                    <span className="-translate-x-1/2 absolute bottom-[0.7rem] left-1/2 z-10 flex h-[1.6rem] w-[1.6rem] items-center justify-center rounded-full text-white">
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

import { emotionQueries } from '@apis/emotions/emotion-queries';
import TipInfo from '@components/tipinfo';
import { cn } from '@libs/cn';
import SegmentedTabs from '@pages/friends/components/segmented-tabs';
import EmotionBarChart from '@pages/main/components/emotion-bar-chart';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

export default function EmotionStatsSection({ className }: { className?: string }) {
  const [tab, setTab] = useState<'curr' | 'prev'>('curr');

  const q = useQuery({ ...emotionQueries.report() });
  const items = q.data ?? [];

  const topDeltas = useMemo(
    () =>
      [...items]
        .map((i) => ({ label: i.label, delta: i.curr - i.prev, prev: i.prev }))
        .sort((a, b) => b.delta - a.delta)
        .slice(0, 3),
    [items],
  );

  return (
    <section className={cn('flex-col gap-[1.6rem] px-[2rem] pt-[2.4rem]', className)}>
      <div className="flex-col gap-[0.4rem]">
        <h2 className="heading1-700 text-gray-900">나의 주간 감정 분석</h2>
        <p className="body2-500 text-gray-500">
          일주일간 AI와 친구들이 분석해준 나의 주간 감정을 확인해 보세요.
        </p>
      </div>

      <SegmentedTabs
        items={[
          { value: 'curr', label: '이번 주' },
          { value: 'prev', label: '지난 주' },
        ]}
        value={tab}
        onChange={(v) => setTab(v as 'curr' | 'prev')}
        className="w-full"
        itemClassName="w-full"
      />

      <EmotionBarChart items={items} active={tab} />

      {items.length > 0 &&
        topDeltas.map((d) => (
          <TipInfo
            key={d.label}
            title={
              <span className="body1-600">
                <span className="text-primary-600">{d.label}</span>이 지난 주보다{' '}
                <span className="text-primary-600">{d.delta}회</span> 더 늘어났어요
              </span>
            }
            text={`지난 주 ${d.prev}회`}
            className="py-[2rem]"
          />
        ))}

      {q.isLoading && (
        <TipInfo title="불러오는 중" text="잠시만 기다려 주세요" className="py-[2rem]" />
      )}
      {q.isError && (
        <TipInfo title="불러올 수 없어요" text="다시 시도해 주세요" className="py-[2rem]" />
      )}
    </section>
  );
}

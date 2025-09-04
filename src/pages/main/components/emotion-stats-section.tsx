import TipInfo from '@components/tipinfo';
import { cn } from '@libs/cn';
import SegmentedTabs from '@pages/friends/components/segmented-tabs';
import { useMemo, useState } from 'react';
import EmotionBarChart from './emotion-bar-chart';

type Item = { label: string; prev: number; curr: number };

const SELF_DATA: Item[] = [
  { label: '기쁨', prev: 12, curr: 30 },
  { label: '슬픔', prev: 12, curr: 24 },
  { label: '피곤', prev: 12, curr: 30 },
  { label: '놀람', prev: 12, curr: 24 },
  { label: '설렘', prev: 12, curr: 30 },
];

const FRIEND_DATA: Item[] = [
  { label: '기쁨', prev: 10, curr: 22 },
  { label: '슬픔', prev: 14, curr: 18 },
  { label: '피곤', prev: 11, curr: 20 },
  { label: '놀람', prev: 9, curr: 16 },
  { label: '설렘', prev: 8, curr: 19 },
];

export default function EmotionStatsSection({ className }: { className?: string }) {
  const [tab, setTab] = useState<'self' | 'friend'>('self');

  const items = tab === 'self' ? SELF_DATA : FRIEND_DATA;

  const topDeltas = useMemo(() => {
    return [...items]
      .map((i) => ({ label: i.label, delta: i.curr - i.prev, prev: i.prev }))
      .sort((a, b) => b.delta - a.delta)
      .slice(0, 3);
  }, [items]);

  return (
    <section className={cn('flex-col gap-[1.6rem] px-[2rem] pt-[2.4rem]', className)}>
      <div className="flex-col gap-[0.4rem]">
        <h2 className="heading1-700 text-gray-900">나의 감정 일기 분석</h2>
        <p className="body2-500 text-gray-500">
          일주일간 작성한 나의 감정 일기 분석을 뇌 구조로 확인할 수 있어요
        </p>
      </div>

      <SegmentedTabs
        items={[
          { value: 'self', label: '내가 생각한 내 감정' },
          { value: 'friend', label: '친구가 생각한 내 감정' },
        ]}
        value={tab}
        onChange={(v) => setTab(v as 'self' | 'friend')}
        className="w-full pt-[0.4rem]"
        itemClassName="w-full"
      />

      <EmotionBarChart items={items} />

      {topDeltas.map((d) => (
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
    </section>
  );
}

import NotiBg from '@assets/images/noti-bg.png';
import EmotionCard from '@components/card/emotion-card';
import TipInfo from '@components/tipinfo';
import { useState } from 'react';
import HeroSection from '../main/components/hero-section';

export default function HomePage() {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(
    2,
    '0',
  )}.${String(today.getDate()).padStart(2, '0')}`;

  const [selectedChips, setSelectedChips] = useState<string[]>([]);

  return (
    <div className="h-dvh flex-col pb-[15rem]" style={{ backgroundImage: `url(${NotiBg})` }}>
      <HeroSection username="지훈" />

      <section className="flex-col px-[2rem] pt-[2rem]">
        <TipInfo title="최근 감정 일기 기록" text={formattedDate} className="py-[2rem]" />

        <div className="py-[2rem]">
          <div className="rounded-[20px] bg-gray-50">
            <EmotionCard
              selected={selectedChips}
              onChange={setSelectedChips}
              onClickCheck={() => {}}
              onClickClose={() => setSelectedChips([])}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

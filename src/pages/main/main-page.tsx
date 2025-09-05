import EmotionCard from '@components/card/emotion-card';
import TipInfo from '@components/tipinfo';
import EmotionStatsSection from '@pages/main/components/emotion-stats-section';
import HeroSection from '@pages/main/components/hero-section';
import { useState } from 'react';

export default function MainPage() {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(
    today.getDate(),
  ).padStart(2, '0')}`;

  const [selectedChips, setSelectedChips] = useState<string[]>([]);

  return (
    <div className="min-h-dvh flex-col bg-gradient-bgd2 pb-[15rem]">
      <HeroSection username="지훈" />
      <section className="flex-col px-[2rem] pt-[2rem]">
        <TipInfo title="최근 감정 일기 기록" text={formattedDate} className="py-[2rem]" />

        <div className="py-[2rem]">
          <EmotionCard
            selected={selectedChips}
            onChange={setSelectedChips}
            onClickCheck={() => {}}
            onClickClose={() => setSelectedChips([])}
          />
        </div>
      </section>

      <EmotionStatsSection className="pb-[2rem]" />
    </div>
  );
}

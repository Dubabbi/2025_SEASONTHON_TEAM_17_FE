import NotiBg from '@assets/images/noti-bg.png';
import EmotionCard from '@components/card/emotion-card';
import TipInfo from '@components/tipinfo';
import { useState } from 'react';
import HeroSection from './components/hero-section';

export default function HomePage() {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(
    2,
    '0',
  )}.${String(today.getDate()).padStart(2, '0')}`;

  const [selectedChips, setSelectedChips] = useState<string[]>([]);

  return (
    <div className="min-h-screen flex-col" style={{ backgroundImage: `url(${NotiBg})` }}>
      <HeroSection username="지훈" />

      <section className="mx-[2.0rem] mt-[2rem] flex-col">
        <TipInfo title="최근 감정 일기 기록" text={formattedDate} className="py-[2rem]" />

        <div className="py-[2rem]">
          <div className="bg-white">
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

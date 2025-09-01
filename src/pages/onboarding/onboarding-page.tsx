import Img1 from '@assets/images/onboarding1.png';
import Img2 from '@assets/images/onboarding2.png';
import Img3 from '@assets/images/onboarding3.png';
import Indicator from '@pages/onboarding/components/indicator';
import Step1 from '@pages/onboarding/components/step1';
import Step2 from '@pages/onboarding/components/step2';
import Step3 from '@pages/onboarding/components/step3';
import { type UIEvent, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OnboardingPage() {
  const nav = useNavigate();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  const slides = useMemo(
    () => [
      { id: 'onb-1', src: Img1 },
      { id: 'onb-2', src: Img2 },
      { id: 'onb-3', src: Img3 },
    ],
    [],
  );

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const page = Math.round(el.scrollLeft / el.clientWidth);
    if (page !== idx) setIdx(page);
  };

  const goStart = () => nav('/login');
  const goLogin = () => nav('/login');

  return (
    <div className="fixed inset-0 bg-gray-50">
      <div className="absolute inset-x-0 top-0">
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className={[
            'mx-auto w-full',
            'h-[38rem]',
            'overflow-x-auto overflow-y-hidden',
            'snap-x snap-mandatory',
            'scrollbar-hide',
            'touch-pan-x select-none overscroll-x-contain',
          ].join(' ')}
        >
          <div className="flex h-full w-full">
            {slides.map(({ id, src }) => (
              <div key={id} className="shrink-0 grow-0 basis-full snap-start">
                <img
                  src={src}
                  alt=""
                  draggable={false}
                  className="block h-full w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20">
        <div
          className={[
            'pointer-events-auto mx-auto w-full max-w-[43rem]',
            'bg-gray-50',
            'h-full px-[3.6rem] pt-[1.6rem]',
            'rounded-t-[2rem] shadow-[0_-8px_24px_rgba(0,0,0,0.08)]',
          ].join(' ')}
        >
          <div className="flex justify-center py-[2rem]">
            <Indicator total={slides.length} index={idx} />
          </div>

          {idx === 0 && <Step1 onStart={goStart} onLogin={goLogin} />}
          {idx === 1 && <Step2 onStart={goStart} onLogin={goLogin} />}
          {idx === 2 && <Step3 onStart={goStart} onLogin={goLogin} />}
        </div>
      </div>
    </div>
  );
}

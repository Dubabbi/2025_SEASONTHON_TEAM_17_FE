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
    <div
      className={[
        'fixed inset-0',
        'mx-auto h-dvh w-full max-w-[43rem]',
        'relative overflow-hidden',
        'bg-cover bg-no-repeat',
      ].join(' ')}
    >
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className={[
          'h-full w-full',
          'overflow-x-auto overflow-y-hidden',
          'snap-x snap-mandatory',
          'scrollbar-hide',
        ].join(' ')}
      >
        <div className="flex h-full w-full">
          {slides.map(({ id, src }) => (
            <div key={id} className="shrink-0 grow-0 basis-full snap-center">
              <img src={src} alt="" draggable={false} className="block h-auto w-full" />
            </div>
          ))}
        </div>
      </div>

      <div
        className={[
          'absolute inset-x-0 bottom-0 z-10',
          'bg-gray-50',
          'max-h-[35rem] px-[3.6rem] pt-[1.6rem]',
        ].join(' ')}
      >
        <div className="mb-[1.6rem] flex justify-center">
          <Indicator total={slides.length} index={idx} />
        </div>

        {idx === 0 && <Step1 onStart={goStart} onLogin={goLogin} />}
        {idx === 1 && <Step2 onStart={goStart} onLogin={goLogin} />}
        {idx === 2 && <Step3 onStart={goStart} onLogin={goLogin} />}
      </div>
    </div>
  );
}

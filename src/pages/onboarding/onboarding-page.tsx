import Img1 from '@assets/images/onboarding1.png';
import Img2 from '@assets/images/onboarding2.png';
import Img3 from '@assets/images/onboarding3.png';
import { cn } from '@libs/cn';
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

  const animRef = useRef<number | null>(null);
  const suppressScrollRef = useRef(false);

  const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

  const smoothScrollTo = (left: number, duration = 280) => {
    const el = scrollerRef.current;
    if (!el) return;

    const prevSnap = el.style.scrollSnapType;
    el.style.scrollSnapType = 'none';

    const start = el.scrollLeft;
    const delta = left - start;
    const startTime = performance.now();
    suppressScrollRef.current = true;

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      el.scrollLeft = start + delta * easeInOut(t);
      if (t < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        el.scrollLeft = left;
        el.style.scrollSnapType = prevSnap;
        suppressScrollRef.current = false;
        animRef.current = null;
        const page = Math.round(el.scrollLeft / el.clientWidth);
        if (page !== idx) setIdx(page);
      }
    };

    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(step);
  };

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    if (suppressScrollRef.current) return;
    const el = e.currentTarget;
    const page = Math.round(el.scrollLeft / el.clientWidth);
    if (page !== idx) setIdx(page);
  };

  const stepTo = (target: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const total = slides.length;
    const clampedTarget = Math.max(0, Math.min(total - 1, target));
    const delta = clampedTarget - idx;

    const next = delta === 0 ? idx : idx + Math.sign(delta);
    const left = next * el.clientWidth;
    smoothScrollTo(left);
  };

  const goStart = () => nav('/login');
  const goLogin = () => nav('/login');

  return (
    <div className={cn('fixed inset-0 bg-gray-50')}>
      <div className={cn('absolute inset-x-0 top-0')}>
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className={cn(
            'mx-auto w-full max-w-[43rem]',
            'h-[38rem]',
            'snap-x snap-mandatory overflow-x-auto overflow-y-hidden',
            'scrollbar-hide touch-pan-x select-none overscroll-x-contain',
          )}
        >
          <div className={cn('flex h-full w-full')}>
            {slides.map(({ id, src }) => (
              <div key={id} className={cn('shrink-0 grow-0 basis-full snap-start')}>
                <img
                  src={src}
                  alt=""
                  draggable={false}
                  className={cn('block h-full w-full object-contain')}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={cn('pointer-events-none fixed inset-x-0 bottom-0 z-20')}>
        <div
          className={cn(
            'pointer-events-auto mx-auto w-full max-w-[43rem]',
            'bg-gray-50',
            'px-[3.6rem] pt-[1.6rem]',
            'pb-[max(1.6rem,env(safe-area-inset-bottom))]',
            'rounded-t-[2rem] shadow-md',
          )}
        >
          <div className={cn('flex justify-center py-[2rem]')}>
            <Indicator total={slides.length} index={idx} onSelect={stepTo} />
          </div>

          {idx === 0 && <Step1 onStart={goStart} onLogin={goLogin} />}
          {idx === 1 && <Step2 onStart={goStart} onLogin={goLogin} />}
          {idx === 2 && <Step3 onStart={goStart} onLogin={goLogin} />}
        </div>
      </div>
    </div>
  );
}

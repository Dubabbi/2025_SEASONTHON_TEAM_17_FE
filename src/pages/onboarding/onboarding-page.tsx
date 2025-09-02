import { cn } from '@libs/cn';
import Indicator from '@pages/onboarding/components/indicator';
import Step1 from '@pages/onboarding/components/step1';
import Step2 from '@pages/onboarding/components/step2';
import Step3 from '@pages/onboarding/components/step3';
import { ONBOARDING_SLIDES } from '@pages/onboarding/constants/slides';
import useOnboardingPager from '@pages/onboarding/hooks/use-onboarding-pager';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OnboardingPage() {
  const nav = useNavigate();
  const slides = useMemo(() => [...ONBOARDING_SLIDES], []);
  const { scrollerRef, idx, onScroll, onPointerDown, jumpTo } = useOnboardingPager({
    total: slides.length,
    duration: 280,
  });

  const goStart = () => nav('/login');
  const goLogin = () => nav('/login');

  return (
    <div className={cn('fixed inset-0 bg-gray-50')}>
      <div className={cn('absolute inset-x-0 top-0')}>
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          onPointerDown={onPointerDown}
          className={cn(
            'mx-auto w-full max-w-[43rem]',
            'h-full',
            'snap-x snap-mandatory overflow-x-auto overflow-y-hidden',
            'scrollbar-hide touch-pan-x select-none overscroll-x-contain',
            'transform-gpu [-webkit-overflow-scrolling:touch]',
            'cursor-default',
          )}
        >
          <div className={cn('flex h-full w-full')}>
            {slides.map(({ id, src }) => (
              <div key={id} className={cn('shrink-0 grow-0 basis-full snap-start snap-always')}>
                <img
                  src={src as string}
                  alt=""
                  draggable={false}
                  className={cn('block h-full w-full object-cover object-top')}
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
            'shadow-md',
          )}
        >
          <div className={cn('flex justify-center py-[2rem]')}>
            <Indicator total={slides.length} index={idx} onSelect={jumpTo} />
          </div>

          {idx === 0 && <Step1 onStart={goStart} onLogin={goLogin} />}
          {idx === 1 && <Step2 onStart={goStart} onLogin={goLogin} />}
          {idx === 2 && <Step3 onStart={goStart} onLogin={goLogin} />}
        </div>
      </div>
    </div>
  );
}

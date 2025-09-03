import LogoIcon from '@assets/icons/logo.svg?react';
import Intro from '@components/intro';
import { cn } from '@libs/cn';
import { useEffect, useState } from 'react';

const PHASE0_MS = 900;
const PHASE1_MS = 900;
const ICON_FADE_MS = 800;

type SplashProps = {
  onComplete?: () => void;
};

export default function Splash({ onComplete }: SplashProps) {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const [iconVisible, setIconVisible] = useState(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase(1), PHASE0_MS);
    const t2 = window.setTimeout(() => setPhase(2), PHASE0_MS + PHASE1_MS);
    const t3 = window.setTimeout(() => onComplete?.(), PHASE0_MS + PHASE1_MS + ICON_FADE_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  useEffect(() => {
    if (phase === 2) {
      setIconVisible(false);
      const raf = requestAnimationFrame(() => setIconVisible(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [phase]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-[var(--z-splash)]',
        'mx-auto grid h-full w-full max-w-[43rem] place-items-center',
        'bg-gray-50 px-[2.4rem]',
      )}
    >
      {phase === 0 && (
        <Intro
          key="phase-0"
          highlightColor="gray"
          icon={<span aria-hidden className="block h-full w-full" />}
          iconClassName="h-[12rem] w-[12rem]"
        />
      )}

      {phase === 1 && (
        <Intro
          key="phase-1"
          highlightColor="primary"
          icon={<span aria-hidden className="block h-full w-full" />}
          iconClassName="h-[12rem] w-[12rem]"
        />
      )}

      {phase === 2 && (
        <Intro
          key="phase-2"
          highlightColor="primary"
          icon={
            <LogoIcon
              aria-hidden
              className={cn(
                'h-full w-full transform transition-[opacity,transform] duration-500 ease-in',
                iconVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
                'motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none',
              )}
            />
          }
          iconClassName="h-[12rem] w-[12rem]"
        />
      )}
    </div>
  );
}

import { type UIEvent, useCallback, useEffect, useRef, useState } from 'react';

type UseOnboardingPagerOptions = {
  total: number;
  duration?: number;
};

export default function useOnboardingPager({ total, duration = 280 }: UseOnboardingPagerOptions) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  // 애니메이션/가드 상태
  const animRef = useRef<number | null>(null);
  const suppressScrollRef = useRef(false);

  const easeInOut = useCallback(
    (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2),
    [],
  );

  const smoothScrollTo = useCallback(
    (left: number) => {
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
          setIdx((prev) => (prev === page ? prev : page));
        }
      };

      if (animRef.current) cancelAnimationFrame(animRef.current);
      animRef.current = requestAnimationFrame(step);
    },
    [duration, easeInOut],
  );

  const onScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
    if (suppressScrollRef.current) return;
    const el = e.currentTarget;
    const page = Math.round(el.scrollLeft / el.clientWidth);
    setIdx((prev) => (prev === page ? prev : page));
  }, []);

  const stepTo = useCallback(
    (target: number) => {
      const el = scrollerRef.current;
      if (!el) return;

      const clampedTarget = Math.max(0, Math.min(total - 1, target));
      setIdx((current) => {
        const delta = clampedTarget - current;
        const next = delta === 0 ? current : current + Math.sign(delta);
        smoothScrollTo(next * el.clientWidth);
        return current;
      });
    },
    [smoothScrollTo, total],
  );

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return {
    scrollerRef,
    idx,
    setIdx,
    onScroll,
    stepTo,
  };
}

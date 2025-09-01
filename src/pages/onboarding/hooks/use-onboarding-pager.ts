import { type UIEvent, useCallback, useEffect, useRef, useState } from 'react';

type UseOnboardingPagerOptions = {
  total: number;
  duration?: number;
};

export default function useOnboardingPager({ total, duration = 280 }: UseOnboardingPagerOptions) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  const animRef = useRef<number | null>(null);
  const suppressScrollRef = useRef(false);

  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartLeftRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const prevSnapRef = useRef<string | null>(null);

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

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== 'mouse') return;
      const el = scrollerRef.current;
      if (!el) return;

      if (animRef.current) cancelAnimationFrame(animRef.current);

      draggingRef.current = true;
      dragStartXRef.current = e.clientX;
      dragStartLeftRef.current = el.scrollLeft;
      lastXRef.current = e.clientX;
      lastTimeRef.current = performance.now();
      velocityRef.current = 0;
      prevSnapRef.current = el.style.scrollSnapType;
      el.style.scrollSnapType = 'none';
      suppressScrollRef.current = true;

      try {
        el.setPointerCapture(e.pointerId);
      } catch {}

      const handleMove = (ev: PointerEvent) => {
        if (!draggingRef.current) return;
        if (!scrollerRef.current) return;
        const now = performance.now();
        const dx = ev.clientX - dragStartXRef.current;
        scrollerRef.current.scrollLeft = dragStartLeftRef.current - dx;
        const dt = now - lastTimeRef.current;
        if (dt > 0) velocityRef.current = (ev.clientX - lastXRef.current) / dt;
        lastXRef.current = ev.clientX;
        lastTimeRef.current = now;
      };

      const endDrag = (ev: PointerEvent) => {
        if (!draggingRef.current) return;
        draggingRef.current = false;
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', endDrag);
        window.removeEventListener('pointercancel', endDrag);

        if (!scrollerRef.current) return;
        try {
          scrollerRef.current.releasePointerCapture((ev as PointerEvent).pointerId);
        } catch {}
        const el2 = scrollerRef.current;
        el2.style.scrollSnapType = prevSnapRef.current ?? '';
        suppressScrollRef.current = false;

        const width = el2.clientWidth;
        const raw = el2.scrollLeft / width;
        const dragDelta = (dragStartLeftRef.current - el2.scrollLeft) / width;
        const threshold = 0.15;
        let target = Math.round(raw);

        if (dragDelta <= -threshold || velocityRef.current < -0.5) {
          target = Math.ceil(raw);
        } else if (dragDelta >= threshold || velocityRef.current > 0.5) {
          target = Math.floor(raw);
        }

        target = Math.max(0, Math.min(total - 1, target));
        smoothScrollTo(target * width);
      };

      window.addEventListener('pointermove', handleMove, { passive: true });
      window.addEventListener('pointerup', endDrag, { passive: true });
      window.addEventListener('pointercancel', endDrag, { passive: true });
    },
    [total, smoothScrollTo],
  );

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener('pointermove', () => {});
      window.removeEventListener('pointerup', () => {});
      window.removeEventListener('pointercancel', () => {});
    };
  }, []);

  return {
    scrollerRef,
    idx,
    setIdx,
    onScroll,
    stepTo,
    onPointerDown,
  };
}

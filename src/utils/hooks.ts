import { useCallback, useEffect, useRef, useState } from 'react';

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function useReveal(active = true) {
  useEffect(() => {
    if (!active) return;
    const elements = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!elements.length) return;
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      elements.forEach((el) => el.classList.add('in'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px' },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [active]);
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);
  return reduced;
}

export function useTilt(maxDeg = 7) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reduced || !ref.current || e.pointerType === 'touch') return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      ref.current.style.setProperty('--rx', `${(0.5 - y) * maxDeg * 2}deg`);
      ref.current.style.setProperty('--ry', `${(x - 0.5) * maxDeg * 2}deg`);
      ref.current.style.setProperty('--mx', `${x * 100}%`);
      ref.current.style.setProperty('--my', `${y * 100}%`);
    },
    [maxDeg, reduced],
  );

  const onPointerLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.setProperty('--rx', '0deg');
      ref.current.style.setProperty('--ry', '0deg');
    }
  }, []);

  return { ref, onPointerMove, onPointerLeave };
}

export function useMagnet(strength = 10) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLAnchorElement>) => {
      if (reduced || !ref.current || e.pointerType === 'touch') return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      ref.current.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
    },
    [strength, reduced],
  );

  const onPointerLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = 'translate3d(0,0,0)';
    }
  }, []);

  return { ref, onPointerMove, onPointerLeave };
}

export function useCounter(target: number, decimals = 0, duration = 1300) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      setValue(target);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || started.current) return;
        started.current = true;
        const t0 = performance.now();
        const step = (now: number) => {
          const p = Math.min((now - t0) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(Number((target * eased).toFixed(decimals)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        observer.disconnect();
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, decimals, duration, reduced]);

  return { ref, value };
}

export function useParallax(factor = 0.05, max = 40) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
        const shift = Math.max(-max, Math.min(max, -offset * factor));
        el.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      cancelAnimationFrame(raf);
    };
  }, [factor, max, reduced]);

  return ref;
}

export function scrollToEl(el: Element | null, block: ScrollLogicalPosition = 'start') {
  if (!el) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block });
}

export function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

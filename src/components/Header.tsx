import React, { useEffect, useRef, useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import {
  FIVERR_URL,
  HERO_STATS,
  HERO_STUDY_IMAGE,
  MARQUEE_ITEMS,
  NAV_LINKS,
} from '../data/portfolio';
import { cn, scrollToEl, useParallax, useReducedMotion, useScrolled, useTilt } from '../utils/hooks';
import { ActionBtn, BrandLogo, Icon, LiveBadge, Reveal, ThemeToggle } from './Icons';

export function Header({
  theme,
  onToggleTheme,
}: {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState('');
  const [scrollPct, setScrollPct] = useState(0);
  const scrolled = useScrolled(30);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const openBtnRef = useRef<HTMLButtonElement>(null);
  const { user, authReady, authBusy, signInWithGoogle, signOutUser } = useFirebase();

  useEffect(() => {
    const sections = ['work', 'services', 'about', 'skills', 'contact']
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-38% 0px -55% 0px', threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setScrollPct(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    closeBtnRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        openBtnRef.current?.focus();
      }
      if (e.key !== 'Tab') return;
      const focusables = menuRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const list = Array.from(focusables) as HTMLElement[];
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.body.classList.add('no-scroll');
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('no-scroll');
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Account';

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="h-px w-full bg-line/60">
          <div
            className="h-px bg-gradient-to-r from-gold via-lav to-violet transition-[width] duration-150"
            style={{ width: `${scrollPct}%` }}
          />
        </div>
        <div
          className={cn(
            'transition-all duration-500',
            scrolled
              ? 'border-b border-line bg-[var(--nav-glass)] backdrop-blur-xl'
              : 'border-b border-transparent bg-transparent',
          )}
        >
          <div className="container-x flex h-[70px] items-center justify-between gap-4 md:h-[80px]">
            <BrandLogo />
            <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={activeId === link.href.slice(1) ? 'true' : undefined}
                  className={cn(
                    'link-underline relative rounded-full px-3.5 py-2 text-[0.78rem] font-medium tracking-wide transition-colors',
                    activeId === link.href.slice(1) ? 'text-ink' : 'text-muted hover:text-ink',
                  )}
                  data-active={activeId === link.href.slice(1)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2.5">
              {authReady && (
                <button
                  type="button"
                  disabled={authBusy}
                  onClick={() => {
                    if (user) {
                      void signOutUser();
                    } else {
                      void signInWithGoogle();
                    }
                  }}
                  title={user ? `Signed in as ${user.email} — click to sign out` : 'Sign in with Google'}
                  className="hidden h-10 items-center gap-2 rounded-full border border-line bg-surface px-3.5 text-[0.7rem] font-medium text-ink transition-colors hover:border-gold/60 hover:text-gold disabled:opacity-50 sm:inline-flex"
                >
                  <Icon name="user" className="size-3.5 text-gold" />
                  <span className="max-w-[7rem] truncate">
                    {user ? `${firstName} · Out` : 'Sign in'}
                  </span>
                </button>
              )}
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
              <a
                href={FIVERR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold hidden !px-5 !py-3 !text-[0.66rem] sm:inline-flex"
              >
                <span>Let's work</span>
                <Icon name="arrow" className="size-3.5" />
              </a>
              <button
                ref={openBtnRef}
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                className="grid size-10 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-gold/60 lg:hidden"
              >
                <span className="flex w-4 flex-col gap-[5px]">
                  <span className="h-px w-full bg-current" />
                  <span className="h-px w-full bg-current" />
                  <span className="h-px w-2/3 bg-current" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={cn(
          'fixed inset-0 z-[60] flex flex-col bg-bg transition-[opacity,visibility] duration-500 lg:hidden',
          menuOpen ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="orb absolute -right-20 top-10 size-72 bg-violet/20" />
          <div className="orb absolute -left-24 bottom-10 size-72 bg-gold/10" />
          <div className="dot-grid absolute inset-0 text-line-strong opacity-40" />
        </div>
        <div className="container-x relative flex h-[70px] shrink-0 items-center justify-between">
          <BrandLogo />
          <div className="flex items-center gap-2.5">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openBtnRef.current?.focus();
              }}
              aria-label="Close menu"
              className="grid size-10 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-gold hover:text-gold"
            >
              <Icon name="close" className="size-4" />
            </button>
          </div>
        </div>
        <div className="container-x relative flex flex-1 flex-col overflow-y-auto pb-8 pt-2">
          <div className="m-auto flex w-full flex-col justify-center py-2">
            <p className="label mb-6">Navigate</p>
            <nav aria-label="Mobile primary" className="flex flex-col">
              {NAV_LINKS.map((link, idx) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setMenuOpen(false);
                    const target = link.href;
                    window.setTimeout(() => {
                      scrollToEl(document.querySelector(target), 'start');
                      history.replaceState(null, '', target);
                    }, 80);
                  }}
                  className="group flex items-baseline justify-between border-b border-line py-3.5"
                  style={{
                    animation: menuOpen
                      ? `fade-up .6s cubic-bezier(.2,.7,.2,1) ${120 + idx * 55}ms both`
                      : undefined,
                  }}
                >
                  <span className="flex items-baseline gap-3">
                    <span className="size-1.5 rounded-full bg-gold/60 transition-colors group-hover:bg-gold" />
                    <span className="text-[2rem] font-medium tracking-[-0.035em] transition-colors group-hover:text-gold">
                      {link.label}
                    </span>
                  </span>
                  <Icon
                    name="arrow"
                    className="size-5 -rotate-45 text-muted transition-all group-hover:rotate-0 group-hover:text-gold"
                  />
                </a>
              ))}
            </nav>
            <div className="mt-8 space-y-5">
              <LiveBadge />
              {authReady && (
                <button
                  type="button"
                  disabled={authBusy}
                  onClick={() => {
                    if (user) {
                      void signOutUser();
                    } else {
                      void signInWithGoogle();
                    }
                  }}
                  className="btn btn-ghost w-full"
                >
                  <Icon name="user" className="size-4 text-gold" />
                  <span>{user ? `Signed in (${firstName}) — Sign out` : 'Sign in with Google'}</span>
                </button>
              )}
              <a
                href={FIVERR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold w-full"
              >
                Hire me on Fiverr
                <Icon name="arrow" className="size-4" />
              </a>
              <div className="flex items-center justify-between">
                <span className="label">Colombo, Sri Lanka</span>
                <span className="label">GMT +5:30</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [exiting, setExiting] = useState(false);
  const reduced = useReducedMotion();
  const doneRef = useRef(false);

  useEffect(() => {
    const duration = reduced ? 220 : 950;
    const t0 = performance.now();
    let raf = 0;
    const timers: number[] = [];

    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 2.2);
      setPct(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else if (!doneRef.current) {
        doneRef.current = true;
        timers.push(window.setTimeout(() => setExiting(true), 140));
        timers.push(window.setTimeout(onDone, reduced ? 200 : 640));
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [onDone, reduced]);

  return (
    <>
      <span className="sr-only" role="status">
        Loading portfolio
      </span>
      <div
        className={`fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-bg px-5 py-6 md:px-10 md:py-8 ${
          exiting ? 'loader-exit' : ''
        }`}
        aria-hidden="true"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 size-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line opacity-70"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line opacity-50"
        />
        <div
          aria-hidden="true"
          className="orb absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 bg-violet/20"
        />
        <div className="relative flex items-center justify-between">
          <span className="label">Sahadh Fawmy</span>
          <span className="label">Colombo · LK</span>
        </div>
        <div className="relative mx-auto flex w-full max-w-xl flex-col items-center text-center">
          <div className="grid size-16 place-items-center rounded-2xl border border-gold/40 bg-[linear-gradient(145deg,rgba(214,182,139,0.2),rgba(155,131,245,0.12))]">
            <span className="font-display text-3xl italic text-gold-soft">SF</span>
          </div>
          <p className="label mt-6">Preparing the studio</p>
          <p className="mt-3 font-display text-[clamp(1.7rem,4vw,2.6rem)] italic leading-tight text-ink">
            Design is in the details.
          </p>
          <div className="mt-9 h-px w-full overflow-hidden bg-line">
            <div
              className="loader-line h-px transition-[width] duration-150 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-3 flex w-full items-center justify-between">
            <span className="label !text-[0.55rem]">Loading assets</span>
            <span className="font-mono text-[0.7rem] text-gold tabular-nums">
              {String(pct).padStart(3, '0')}
            </span>
          </div>
        </div>
        <div className="relative flex items-center justify-between">
          <span className="label !text-[0.55rem]">Graphic designer · Digital creator</span>
          <span className="label !text-[0.55rem]">Portfolio 2026</span>
        </div>
      </div>
    </>
  );
}

function SpinningSeal() {
  return (
    <div className="glass absolute -right-3 top-[13%] z-30 grid size-[5.4rem] place-items-center rounded-full shadow-2xl sm:-right-6 sm:size-24">
      <svg viewBox="0 0 120 120" className="spin-slow absolute inset-0 size-full p-2" aria-hidden="true">
        <defs>
          <path id="seal-circle" d="M60,60 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0" />
        </defs>
        <text className="fill-gold font-mono text-[8px] uppercase" style={{ letterSpacing: '2.6px' }}>
          <textPath href="#seal-circle">Graphic design · Digital creation ·</textPath>
        </text>
      </svg>
      <Icon name="spark" className="size-5 text-gold" />
    </div>
  );
}

function HeroVisualCard() {
  const tilt = useTilt(9);
  const parallaxRef = useParallax(0.032, 26);

  return (
    <div className="relative mx-auto w-full max-w-[480px] lg:max-w-none">
      <div ref={parallaxRef}>
        <div
          ref={tilt.ref}
          onPointerMove={tilt.onPointerMove}
          onPointerLeave={tilt.onPointerLeave}
          className="tilt relative mx-auto aspect-[4/5] w-full max-w-[440px] [perspective:1200px] sm:max-w-[470px]"
        >
          <div aria-hidden="true" className="absolute inset-0">
            <div className="orb absolute right-[-12%] top-[-6%] size-64 bg-violet/25" />
            <div className="orb absolute bottom-[-8%] left-[-14%] size-56 bg-gold/15" />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-[3.5%] translate-x-3 translate-y-3 rounded-[30px] border border-gold/25 sm:translate-x-4 sm:translate-y-4"
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="orbit-x aspect-square w-[112%] rounded-full border border-gold/20">
              <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_18px_4px_rgba(214,182,139,0.4)]" />
            </div>
            <div className="absolute aspect-square w-[92%] rounded-full border border-line-strong/60" />
          </div>
          <div className="absolute inset-[7%] overflow-hidden rounded-[26px] border border-line-strong bg-[#08080d] shadow-[0_50px_120px_-40px_rgba(0,0,0,0.95)] [transform:translateZ(30px)]">
            <img
              src={HERO_STUDY_IMAGE}
              alt="Abstract 3D art direction study: obsidian ribbon, metallic gold torus and lavender glass"
              className="size-full object-cover"
              loading="eager"
              decoding="async"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,10,0.55)_0%,transparent_32%,transparent_58%,rgba(6,6,10,0.9)_100%)]"
            />
            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-5">
              <span className="rounded-full border border-white/15 bg-black/30 px-2.5 py-1 font-mono text-[0.52rem] uppercase tracking-[0.18em] text-white/70 backdrop-blur-sm">
                Art direction
              </span>
              <span className="font-mono text-[0.52rem] uppercase tracking-[0.18em] text-white/50">
                SF — 001
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="font-mono text-[0.5rem] uppercase tracking-[0.2em] text-white/50">
                    Visual study
                  </p>
                  <p className="mt-1 font-display text-xl italic leading-none text-white sm:text-2xl">
                    Form, light &amp; depth
                  </p>
                </div>
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="size-4 rounded-full border border-white/20 bg-[#d6b68b]" />
                  <span className="size-4 rounded-full border border-white/20 bg-[#9b83f5]" />
                  <span className="size-4 rounded-full border border-white/20 bg-[#f0dfc4]" />
                  <span className="size-4 rounded-full border border-white/20 bg-[#12121c]" />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -left-2 top-[9%] z-30 [transform:translateZ(70px)] sm:-left-6">
            <div className="glass floaty rounded-2xl px-3.5 py-3 shadow-2xl">
              <p className="font-mono text-[0.5rem] uppercase tracking-[0.2em] text-muted">Currently</p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="live-dot size-1.5 rounded-full bg-[#86d9a5]" />
                <p className="text-[0.76rem] font-medium leading-none">Open for freelance</p>
              </div>
            </div>
          </div>
          <SpinningSeal />
          <div className="absolute -bottom-3 -left-1 z-30 [transform:translateZ(85px)] sm:-left-7">
            <div className="glass floaty-slow rounded-2xl p-3.5 shadow-2xl">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-[0.5rem] uppercase tracking-[0.2em] text-muted">Toolkit</p>
                <Icon name="layers" className="size-3.5 text-gold" />
              </div>
              <div className="mt-2 flex gap-1.5">
                {['Ps', 'Ai', 'HTML'].map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-line-strong bg-[#0b0b13] px-2 py-1 font-mono text-[0.58rem] tracking-wide text-[#e6e2da]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute -right-1 bottom-[16%] z-20 hidden [transform:translateZ(55px)] sm:block">
            <div className="floaty grid size-16 place-items-center rounded-2xl border border-[#d6b68b]/35 bg-[linear-gradient(150deg,#191426,#0a0a10)] shadow-[0_24px_50px_-20px_rgba(0,0,0,0.9)] [animation-delay:-2s]">
              <span className="font-display text-2xl italic text-[#e4cba6]">SF</span>
            </div>
          </div>
          <div className="glass absolute -right-2 top-[62%] z-20 hidden rounded-xl px-3 py-2 shadow-xl [transform:translateZ(45px)] md:block">
            <p className="font-mono text-[0.46rem] uppercase tracking-[0.18em] text-muted">Based in</p>
            <p className="mt-1 text-[0.68rem] font-medium">Colombo · 06°55′N</p>
          </div>
        </div>
        <div className="mt-7 flex items-center justify-between px-1">
          <span className="label !text-[0.52rem]">Fig. 01 — Visual direction study</span>
          <span className="hidden items-center gap-2 text-muted [@media(hover:hover)_and_(pointer:fine)]:flex">
            <Icon name="cursor" className="size-3.5 text-gold" />
            <span className="label !text-[0.52rem]">Move to explore</span>
          </span>
        </div>
      </div>
    </div>
  );
}

const HERO_DOTS = [
  { l: '8%', t: '22%', s: 3, c: 'bg-gold', d: 0 },
  { l: '18%', t: '68%', s: 2, c: 'bg-lav', d: -1.8 },
  { l: '37%', t: '14%', s: 2, c: 'bg-gold', d: -3.4 },
  { l: '46%', t: '82%', s: 3, c: 'bg-violet', d: -2.2 },
  { l: '62%', t: '9%', s: 2, c: 'bg-lav', d: -4.1 },
  { l: '72%', t: '48%', s: 2, c: 'bg-gold', d: -0.9 },
  { l: '84%', t: '26%', s: 3, c: 'bg-violet', d: -2.7 },
  { l: '92%', t: '72%', s: 2, c: 'bg-gold', d: -1.2 },
  { l: '28%', t: '42%', s: 2, c: 'bg-lav', d: -3.9 },
  { l: '56%', t: '62%', s: 2, c: 'bg-gold', d: -0.4 },
];

export function Hero() {
  return (
    <section id="top" className="relative z-[1] overflow-hidden pt-[104px] md:pt-[120px]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="dot-grid absolute inset-x-0 top-0 h-[70%] text-line-strong opacity-25 [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]" />
        <div className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-line-strong via-transparent to-transparent lg:block" />
        {HERO_DOTS.map((dot, idx) => (
          <span
            key={idx}
            className={`floaty-slow absolute rounded-full ${dot.c} opacity-40`}
            style={{
              left: dot.l,
              top: dot.t,
              width: dot.s,
              height: dot.s,
              animationDelay: `${dot.d}s`,
            }}
          />
        ))}
      </div>
      <div className="container-x relative flex min-h-[calc(100svh-104px)] flex-col justify-center pb-10 pt-8 md:pb-14">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="relative lg:col-span-7 lg:pr-4">
            <Reveal className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <LiveBadge />
              <span className="hidden h-3 w-px bg-line-strong sm:block" />
              <span className="label flex items-center gap-2 !text-[0.56rem]">
                <Icon name="compass" className="size-3 text-gold" />
                Colombo, Sri Lanka · Working worldwide
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 md:mt-8">
                <span className="sr-only">Sahadh Fawmy — Graphic Designer and Digital Creator. </span>
                <span aria-hidden="true" className="display-name block text-ink">
                  SAHADH
                </span>
                <span aria-hidden="true" className="display-serif gold-text block pr-2">
                  FAWMY
                </span>
              </h1>
            </Reveal>
            <Reveal delay={150} className="mt-5 flex items-center gap-3">
              <span className="h-px w-8 bg-gold/70" />
              <p className="label !text-[0.58rem] !text-ink/85 sm:!text-[0.65rem]">
                Graphic Designer <span className="text-gold">&amp;</span> Digital Creator
              </p>
            </Reveal>
            <Reveal delay={210}>
              <p className="mt-6 max-w-[24ch] font-display text-[clamp(1.55rem,3.2vw,2.35rem)] leading-[1.12] tracking-[-0.01em] text-ink">
                Turning creative ideas into <em className="text-gold-soft">powerful</em> visual
                experiences.
              </p>
            </Reveal>
            <Reveal delay={270}>
              <p className="mt-5 max-w-[50ch] text-[0.92rem] leading-relaxed text-muted sm:text-[0.97rem]">
                I'm Sahadh Fawmy, a Graphic Designer and Digital Creator passionate about creating
                meaningful visual identities, professional designs, and engaging digital
                experiences.
              </p>
            </Reveal>
            <Reveal delay={330} className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <ActionBtn href="#work" variant="gold" icon="arrow">
                Explore my work
              </ActionBtn>
              <ActionBtn href={FIVERR_URL} variant="ghost" external icon="fiverr">
                Hire me on Fiverr
              </ActionBtn>
            </Reveal>
            <Reveal delay={390} className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
              <a
                href={FIVERR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline group inline-flex items-center gap-2 text-[0.78rem] text-muted transition-colors hover:text-ink"
              >
                <span className="grid size-6 place-items-center rounded-full border border-line text-gold">
                  <Icon name="fiverr" className="size-3" />
                </span>
                View my Fiverr profile
                <Icon
                  name="arrow"
                  className="size-3 transition-transform group-hover:translate-x-0.5"
                />
              </a>
              <span className="text-[0.72rem] text-muted/70">International freelance · 3.5+ years</span>
            </Reveal>
          </div>
          <Reveal delay={220} className="lg:col-span-5">
            <HeroVisualCard />
          </Reveal>
        </div>
        <Reveal delay={440} className="mt-12 md:mt-16">
          <div className="flex flex-col gap-6 border-t border-line pt-6 md:flex-row md:items-center md:justify-between md:gap-10">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 sm:gap-x-10">
              {HERO_STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block text-[1.4rem] font-medium leading-none tracking-[-0.03em] text-ink">
                      {stat.value}
                    </span>
                    <span className="mt-1.5 block font-mono text-[0.53rem] uppercase tracking-[0.16em] text-muted">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
            <a
              href="#about"
              className="group hidden items-center gap-3 self-end text-muted transition-colors hover:text-ink md:flex"
              aria-label="Scroll to about section"
            >
              <span className="label !text-[0.52rem]">Scroll to discover</span>
              <span className="grid size-10 place-items-center rounded-full border border-line transition-colors group-hover:border-gold">
                <Icon
                  name="arrow"
                  className="size-4 rotate-90 text-gold transition-transform group-hover:translate-y-0.5"
                />
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Marquee({ reverse = false }: { reverse?: boolean }) {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div
      className="marquee group relative overflow-hidden border-y border-line bg-[color-mix(in_srgb,var(--panel)_45%,transparent)] py-4 backdrop-blur-sm md:py-5"
      aria-label="Design capabilities"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--bg)] to-transparent md:w-28"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--bg)] to-transparent md:w-28"
      />
      <div
        className={`marquee-track ${reverse ? 'marquee-reverse' : ''}`}
        style={{ '--speed': '46s' } as React.CSSProperties}
      >
        {doubled.map((item, idx) => (
          <span
            key={`${item}-${idx}`}
            className="flex shrink-0 items-center gap-5 pr-5 md:gap-8 md:pr-8"
            aria-hidden={idx >= MARQUEE_ITEMS.length}
          >
            <span className="whitespace-nowrap font-display text-lg italic tracking-wide text-ink/85 md:text-xl">
              {item}
            </span>
            <span className="text-[0.55rem] text-gold" aria-hidden="true">
              ✳
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

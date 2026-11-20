import React from 'react';
import { FIVERR_URL } from '../data/portfolio';
import { cn, useMagnet } from '../utils/hooks';

const ICON_PATHS: Record<string, React.ReactNode> = {
  mark: (
    <>
      <path d="M4 18 9.5 5.5 15 18" />
      <path d="M6.4 13.4h6.2" />
      <circle cx="18" cy="8" r="2.6" />
      <path d="M18 10.6V18" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3 9.5h18" />
      <path d="M7 14h4M7 16.2h2.5" />
      <circle cx="16.5" cy="14.2" r="1.6" />
    </>
  ),
  poster: (
    <>
      <rect x="4.5" y="3" width="15" height="18" rx="1.6" />
      <path d="M8 7.5h8M8 10.5h5" />
      <path d="m8 17 3-4 2 2.4 1.6-2L18 17" />
    </>
  ),
  banner: (
    <>
      <path d="M3 9.5h4l8-4.5v14L7 14.5H3z" />
      <path d="M18.5 8.5a5 5 0 0 1 0 7" />
      <path d="M7 14.5V19h2.4v-3.1" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.4" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.4" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.4" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.4" />
    </>
  ),
  play: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="3" />
      <path d="m10.4 9.4 5 2.6-5 2.6z" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.2A2.2 2.2 0 0 1 6.2 3H20v16.4H6.2A2.2 2.2 0 0 0 4 21.6z" />
      <path d="M20 17.4H6.2A2.2 2.2 0 0 0 4 19.6" />
      <path d="M8.5 7.2h7" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.4" />
      <circle cx="8.6" cy="9.4" r="1.7" />
      <path d="m4.5 17.5 4.8-4.6 3.4 3.2 3-2.8 3.8 4.2" />
    </>
  ),
  film: (
    <>
      <rect x="2.8" y="5" width="18.4" height="14" rx="2.2" />
      <path d="M7.4 5v14M16.6 5v14M2.8 9.6h4.6M2.8 14.4h4.6M16.6 9.6h4.6M16.6 14.4h4.6" />
    </>
  ),
  document: (
    <>
      <path d="M6 2.8h7.6L19 8.2v13H6z" />
      <path d="M13.4 2.8v5.6H19" />
      <path d="M9 12h6M9 15h6M9 18h3.6" />
    </>
  ),
  cv: (
    <>
      <rect x="3.4" y="3" width="17.2" height="18" rx="2" />
      <circle cx="9.2" cy="9.4" r="2.4" />
      <path d="M5.6 16.4c.6-2 2-3 3.6-3s3 1 3.6 3" />
      <path d="M15 8.5h3M15 11.5h3" />
    </>
  ),
  code: (
    <>
      <path d="m8.4 8-4 4 4 4M15.6 8l4 4-4 4" />
      <path d="m13.4 5.5-2.8 13" />
    </>
  ),
  spreadsheet: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9.5h18M3 14.5h18M9.5 4v16" />
    </>
  ),
  ledger: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 7.5h8M8 11.5h5M8 15.5h8M15.5 11.5h.5" />
    </>
  ),
  spark: <path d="M12 2.8 13.9 9l5.3 3-5.3 3L12 21.2 10.1 15 4.8 12l5.3-3z" />,
  chat: (
    <>
      <path d="M20.5 12.2c0 4-3.8 7.2-8.5 7.2-1 0-2-.15-2.9-.42L4 21l1.4-3.7A6.6 6.6 0 0 1 3.5 12.2c0-4 3.8-7.2 8.5-7.2s8.5 3.2 8.5 7.2Z" />
      <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.3 2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.8 20 6v6.1c0 4.4-3.2 7.6-8 9.1-4.8-1.5-8-4.7-8-9.1V6z" />
      <path d="m8.4 12 2.5 2.5 4.7-4.9" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.2 12h17.6" />
      <path d="M12 3c2.6 2.5 4 5.6 4 9s-1.4 6.5-4 9c-2.6-2.5-4-5.6-4-9s1.4-6.5 4-9Z" />
    </>
  ),
  tag: (
    <>
      <path d="M20.4 12.6 12.6 20.4a2 2 0 0 1-2.8 0L3.6 14.2a2 2 0 0 1-.6-1.4V4.6A2 2 0 0 1 5 2.6h8.2c.5 0 1 .2 1.4.6l5.8 5.8a2.4 2.4 0 0 1 0 3.6Z" />
      <circle cx="8" cy="7.6" r="1.3" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowUp: <path d="M12 19V5M6 11l6-6 6 6" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.6v2M12 19.4v2M2.6 12h2M19.4 12h2M5.4 5.4l1.4 1.4M17.2 17.2l1.4 1.4M18.6 5.4l-1.4 1.4M6.8 17.2l-1.4 1.4" />
    </>
  ),
  moon: <path d="M20.4 14.4A8.6 8.6 0 0 1 9.6 3.6 8.6 8.6 0 1 0 20.4 14.4Z" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  fiverr: (
    <path d="M4 8.4h9.2V7.1c0-1.5.9-2.4 2.4-2.4H19v3.7h-2.6c-.5 0-.7.2-.7.7v.6H19v3.6h-3.3V20H11.6v-6.7H4z" />
  ),
  mail: (
    <>
      <rect x="2.8" y="5" width="18.4" height="14" rx="2.2" />
      <path d="m3.6 6.4 8.4 6.4 8.4-6.4" />
    </>
  ),
  phone: (
    <path d="M8.2 3.2 9.9 8 7.6 9.7a13.4 13.4 0 0 0 6.7 6.7L16 14.1l4.8 1.7v3.4a2 2 0 0 1-2.2 2A17.6 17.6 0 0 1 2.8 5.4a2 2 0 0 1 2-2.2z" />
  ),
  check: <path d="m4.5 12.5 5 5 10-11" />,
  copy: (
    <>
      <rect x="8.5" y="8.5" width="12" height="12" rx="2" />
      <path d="M15.5 8.5v-3a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5z" />
      <path d="m3.5 12.5 8.5 4.7 8.5-4.7M3.5 16.8l8.5 4.7 8.5-4.7" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.8 8.2-2 5.6-5.6 2 2-5.6z" />
    </>
  ),
  cursor: <path d="m5 3 14 8.4-6.1 1.5L10 19z" />,
  ruler: (
    <>
      <rect x="2.8" y="7.4" width="18.4" height="9.2" rx="1.8" transform="rotate(-12 12 12)" />
      <path d="M7.5 9.6v2M11 9v2M14.5 8.4v2M18 7.8v2" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  user: (
    <>
      <circle cx="12" cy="8.2" r="3.6" />
      <path d="M5 19.6c1.2-3.4 3.8-5.2 7-5.2s5.8 1.8 7 5.2" />
    </>
  ),
};

export function Icon({
  name,
  className,
  ...rest
}: { name: string } & React.SVGProps<SVGSVGElement>) {
  const path = ICON_PATHS[name] ?? ICON_PATHS.spark;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      {path}
    </svg>
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      data-reveal=""
      className={className}
      style={{ '--delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#top" className="group flex items-center gap-3" aria-label="Sahadh Fawmy — back to top">
      <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-[13px] border border-gold/40 bg-[linear-gradient(145deg,rgba(214,182,139,0.22),rgba(155,131,245,0.12))]">
        <span className="font-display text-[1.15rem] italic leading-none text-gold-soft">SF</span>
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[0.8rem] font-semibold tracking-[0.16em] text-ink">
            SAHADH FAWMY
          </span>
          <span className="label mt-1 !text-[0.5rem] !tracking-[0.2em]">Designer · Creator</span>
        </span>
      )}
    </a>
  );
}

export function SectionHeader({
  index,
  eyebrow,
  title,
  intro,
  className,
  aside,
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  className?: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className={cn('flex flex-col gap-7', className)}>
      <Reveal className="flex items-center gap-4">
        <span className="label !text-gold">{index}</span>
        <span className="h-px w-10 bg-gold/50" />
        <span className="label">{eyebrow}</span>
      </Reveal>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <Reveal delay={80}>
          <h2 className="max-w-[18ch] text-balance text-[clamp(2.1rem,4.6vw,3.9rem)] font-medium leading-[1.03] tracking-[-0.035em]">
            {title}
          </h2>
        </Reveal>
        {(intro || aside) && (
          <Reveal delay={160} className="max-w-md lg:pb-2">
            {intro && <p className="text-[0.95rem] leading-relaxed text-muted">{intro}</p>}
            {aside}
          </Reveal>
        )}
      </div>
    </div>
  );
}

export function ActionBtn({
  href,
  children,
  variant = 'gold',
  className,
  external = false,
  icon = 'arrow',
  ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'gold' | 'ghost';
  className?: string;
  external?: boolean;
  icon?: string;
  ariaLabel?: string;
}) {
  const magnet = useMagnet(variant === 'gold' ? 9 : 6);
  return (
    <a
      ref={magnet.ref}
      href={href}
      aria-label={ariaLabel}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      onPointerMove={magnet.onPointerMove}
      onPointerLeave={magnet.onPointerLeave}
      className={cn('btn group', variant === 'gold' ? 'btn-gold' : 'btn-ghost', className)}
    >
      <span>{children}</span>
      {icon && (
        <Icon
          name={icon}
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      )}
    </a>
  );
}

export function FiverrBtn({
  className,
  label = 'Hire me on Fiverr',
}: {
  className?: string;
  label?: string;
}) {
  return (
    <ActionBtn href={FIVERR_URL} external className={className} icon="arrow">
      {label}
    </ActionBtn>
  );
}

export function LiveBadge({ className }: { className?: string }) {
  return (
    <div className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="relative grid size-2 place-items-center">
        <span className="live-dot absolute size-2 rounded-full bg-[#86d9a5]" />
        <span className="size-1.5 rounded-full bg-[#86d9a5]" />
      </span>
      <span className="label !text-[0.58rem] !text-ink/80">Available for freelance</span>
    </div>
  );
}

export function TagPill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function CornerMarks({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0', className)}>
      <span className="absolute left-4 top-4 size-3 border-l border-t border-line-strong" />
      <span className="absolute right-4 top-4 size-3 border-r border-t border-line-strong" />
      <span className="absolute bottom-4 left-4 size-3 border-b border-l border-line-strong" />
      <span className="absolute bottom-4 right-4 size-3 border-b border-r border-line-strong" />
    </div>
  );
}

export function ThemeToggle({
  theme,
  onToggle,
  className,
}: {
  theme: 'dark' | 'light';
  onToggle: () => void;
  className?: string;
}) {
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className={cn(
        'group relative grid size-10 place-items-center overflow-hidden rounded-full border border-line bg-surface text-ink transition-colors hover:border-gold/60 hover:text-gold',
        className,
      )}
    >
      <Icon
        name={theme === 'dark' ? 'sun' : 'moon'}
        className="size-[17px] transition-transform duration-500 group-hover:rotate-45"
      />
    </button>
  );
}

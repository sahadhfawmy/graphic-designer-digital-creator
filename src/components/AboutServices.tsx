import React from 'react';
import { ADDITIONAL_SERVICES, SERVICES, type ServiceItem } from '../data/portfolio';
import { useCounter, useTilt } from '../utils/hooks';
import { CornerMarks, FiverrBtn, Icon, LiveBadge, Reveal, SectionHeader, TagPill } from './Icons';

function StatCounter({
  value,
  decimals = 0,
  suffix = '',
  label,
  sub,
  icon,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
  sub: string;
  icon: string;
}) {
  const { ref, value: current } = useCounter(value, decimals);
  return (
    <div className="group relative border-t border-line pt-5 transition-colors hover:border-gold/50">
      <div className="flex items-start justify-between">
        <p className="text-[clamp(1.8rem,3.4vw,2.4rem)] font-medium leading-none tracking-[-0.04em] text-ink">
          <span ref={ref} className="tabular-nums">
            {decimals ? current.toFixed(decimals) : current}
          </span>
          <span className="text-gold">{suffix}</span>
        </p>
        <Icon name={icon} className="size-4 text-muted transition-colors group-hover:text-gold" />
      </div>
      <p className="mt-3 text-[0.82rem] font-medium leading-tight text-ink">{label}</p>
      <p className="mt-1 font-mono text-[0.52rem] uppercase tracking-[0.14em] text-muted">{sub}</p>
    </div>
  );
}

function CreativeProfileCard() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-4 rounded-[2.2rem] bg-[radial-gradient(60%_60%_at_30%_20%,rgba(155,131,245,0.18),transparent_70%),radial-gradient(50%_50%_at_90%_90%,rgba(214,182,139,0.14),transparent_70%)] blur-xl"
      />
      <div className="premium-card relative overflow-hidden p-6 sm:p-8">
        <CornerMarks />
        <div
          className="dot-grid pointer-events-none absolute inset-0 text-line-strong opacity-30"
          aria-hidden="true"
        />
        <div className="relative flex items-center justify-between">
          <span className="label !text-[0.52rem] !text-gold">Creative profile</span>
          <span className="font-mono text-[0.52rem] uppercase tracking-[0.16em] text-muted">
            No. 001
          </span>
        </div>
        <div className="relative mt-8 grid grid-cols-[1fr_auto] items-start gap-4">
          <div>
            <h3 className="text-[1.65rem] font-medium uppercase leading-[0.95] tracking-[-0.03em]">
              Sahadh
              <br />
              <span className="font-display text-[2.3rem] italic normal-case tracking-normal text-gold-soft">
                Fawmy
              </span>
            </h3>
            <p className="mt-4 max-w-[22ch] text-[0.78rem] leading-relaxed text-muted">
              Graphic designer &amp; digital creator building visual identities with clarity and
              character.
            </p>
          </div>
          <div className="relative grid size-[4.6rem] shrink-0 place-items-center rounded-full border border-gold/30 bg-[linear-gradient(150deg,rgba(214,182,139,0.16),rgba(155,131,245,0.14))] sm:size-20">
            <span
              className="spin-slow absolute inset-1 rounded-full border border-dashed border-gold/25"
              aria-hidden="true"
            />
            <span className="font-display text-[2.1rem] italic leading-none text-gold-soft">
              SF
            </span>
          </div>
        </div>
        <div className="relative mt-8 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-line pt-5">
          <div>
            <p className="font-mono text-[0.48rem] uppercase tracking-[0.18em] text-muted">
              Based in
            </p>
            <p className="mt-1.5 text-[0.76rem] font-medium">Colombo, Sri Lanka</p>
          </div>
          <div>
            <p className="font-mono text-[0.48rem] uppercase tracking-[0.18em] text-muted">
              Experience
            </p>
            <p className="mt-1.5 text-[0.76rem] font-medium">3.5+ years</p>
          </div>
          <div>
            <p className="font-mono text-[0.48rem] uppercase tracking-[0.18em] text-muted">
              Languages
            </p>
            <p className="mt-1.5 text-[0.76rem] font-medium">English · Arabic · Tamil</p>
          </div>
          <div>
            <p className="font-mono text-[0.48rem] uppercase tracking-[0.18em] text-muted">Status</p>
            <p className="mt-1.5 flex items-center gap-1.5 text-[0.76rem] font-medium">
              <span className="size-1.5 rounded-full bg-[#86d9a5]" /> Available
            </p>
          </div>
        </div>
        <div className="relative mt-6 flex items-end justify-between gap-3 border-t border-line pt-5">
          <div>
            <p className="font-display text-xl italic leading-none text-ink">Sahadh Fawmy</p>
            <p className="mt-1 font-mono text-[0.46rem] uppercase tracking-[0.18em] text-muted">
              Signature · Graphic design
            </p>
          </div>
          <div className="flex items-end gap-[2px]" aria-hidden="true">
            {[3, 6, 4, 8, 5, 7, 3, 6, 4, 5, 8, 4, 6, 3, 7, 5].map((h, i) => (
              <span key={i} className="w-[2px] bg-ink/50" style={{ height: `${h * 2.2}px` }} />
            ))}
          </div>
        </div>
      </div>
      <div className="glass floaty-slow absolute -bottom-5 -right-2 z-20 hidden rounded-2xl px-4 py-3 shadow-2xl sm:block">
        <p className="font-mono text-[0.48rem] uppercase tracking-[0.2em] text-muted">Focus</p>
        <p className="mt-1 text-[0.8rem] font-medium leading-none">Identity · Print · Digital</p>
      </div>
    </div>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="section-pad">
      <div className="container-x">
        <SectionHeader
          index="01"
          eyebrow="About the designer"
          title={
            <>
              A design eye with a <span className="serif-accent text-gold">strategist's</span> care.
            </>
          }
          intro="Design is more than making things look good. It is about making the message land — clearly, beautifully, and for the right audience."
        />
        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="mx-auto max-w-md lg:sticky lg:top-28 lg:mx-0 lg:max-w-none">
              <CreativeProfileCard />
              <div className="mt-12 flex flex-wrap items-center gap-2">
                <TagPill>Identity</TagPill>
                <TagPill>Editorial</TagPill>
                <TagPill>Multilingual</TagPill>
                <TagPill>Digital</TagPill>
              </div>
            </div>
          </Reveal>
          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-[clamp(1.05rem,1.55vw,1.3rem)] leading-[1.65] text-ink">
                <span className="float-left mr-3 mt-1 font-display text-[3.4rem] leading-[0.78] text-gold">
                  H
                </span>
                ello! I'm Sahadh Fawmy, a Graphic Designer and Digital Creator from Colombo, Sri
                Lanka, with over <strong className="font-medium">3.5 years of experience</strong> in
                graphic design, photo editing, digital content creation, and document preparation.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <p className="mt-6 text-[0.95rem] leading-relaxed text-muted">
                I help businesses, brands, and individuals transform their ideas into professional
                and visually engaging designs. Whether it is a new identity, a campaign, a
                publication or a single post, the goal is the same: work that feels considered and
                communicates at a glance.
              </p>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">
                My approach combines creativity, attention to detail, modern design principles, and
                clear communication to deliver quality work. I work in English, Arabic and Tamil,
                which lets me shape visual systems that travel confidently across languages and
                markets.
              </p>
            </Reveal>
            <div className="mt-11 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 sm:gap-x-5">
              <Reveal delay={40}>
                <StatCounter
                  value={3.5}
                  decimals={1}
                  suffix="+"
                  label="Years of experience"
                  sub="Hands-on practice"
                  icon="clock"
                />
              </Reveal>
              <Reveal delay={100}>
                <StatCounter
                  value={12}
                  label="Creative services"
                  sub="One designer"
                  icon="spark"
                />
              </Reveal>
              <Reveal delay={160}>
                <StatCounter
                  value={3}
                  label="Working languages"
                  sub="Arabic · English · Tamil"
                  icon="globe"
                />
              </Reveal>
              <Reveal delay={220}>
                <div className="group relative border-t border-line pt-5 transition-colors hover:border-gold/50">
                  <div className="flex items-start justify-between">
                    <p className="text-[clamp(1.5rem,3vw,2.1rem)] font-medium leading-none tracking-[-0.04em] text-ink">
                      Worldwide
                    </p>
                    <Icon
                      name="compass"
                      className="size-4 text-muted transition-colors group-hover:text-gold"
                    />
                  </div>
                  <p className="mt-3 text-[0.82rem] font-medium leading-tight text-ink">
                    International freelance
                  </p>
                  <p className="mt-1 font-mono text-[0.52rem] uppercase tracking-[0.14em] text-muted">
                    Colombo → remote
                  </p>
                </div>
              </Reveal>
            </div>
            <div className="mt-12 grid gap-3 sm:grid-cols-3">
              {[
                {
                  t: 'Creative approach',
                  d: 'Original direction, never a copied template.',
                  i: 'spark',
                },
                {
                  t: 'Client-focused',
                  d: 'Your audience and goal lead every decision.',
                  i: 'shield',
                },
                {
                  t: 'International',
                  d: 'Remote-friendly across time zones.',
                  i: 'globe',
                },
              ].map((pillar, idx) => (
                <Reveal key={pillar.t} delay={idx * 70}>
                  <div className="group h-full rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-gold/40">
                    <Icon name={pillar.i} className="size-4 text-gold" />
                    <p className="mt-3 text-[0.82rem] font-medium">{pillar.t}</p>
                    <p className="mt-1.5 text-[0.74rem] leading-relaxed text-muted">{pillar.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={120}>
              <figure className="mt-12 border-l border-gold/40 pl-5">
                <blockquote className="font-display text-[clamp(1.25rem,2.2vw,1.6rem)] italic leading-snug text-ink/90">
                  “Good design does not decorate a message. It clarifies it.”
                </blockquote>
                <figcaption className="mt-2.5 font-mono text-[0.52rem] uppercase tracking-[0.18em] text-muted">
                  My working philosophy
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
  onSelect,
}: {
  service: ServiceItem;
  index: number;
  onSelect: (title: string) => void;
}) {
  const tilt = useTilt(3.5);
  return (
    <div
      ref={tilt.ref}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      className={`tilt group relative h-full overflow-hidden rounded-2xl border border-line bg-[color-mix(in_srgb,var(--panel)_68%,transparent)] p-5 transition-colors duration-500 hover:border-gold/45 focus-within:border-gold/45 sm:p-6 ${service.items ? 'flex flex-col' : ''}`}
    >
      <div
        aria-hidden="true"
        className="spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full border border-line opacity-0 transition-all duration-700 group-hover:scale-125 group-hover:opacity-100"
      />
      <div className="relative flex items-start justify-between">
        <span className="grid size-11 place-items-center rounded-xl border border-line bg-surface text-gold transition-colors duration-500 group-hover:border-gold/40 group-hover:bg-gold/10">
          <Icon name={service.icon} className="size-5" />
        </span>
        <span className="font-mono text-[0.58rem] tracking-[0.16em] text-muted/60">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <h3 className="relative mt-5 text-[1.02rem] font-medium leading-snug tracking-[-0.015em] text-ink">
        {service.title}
      </h3>
      {service.image && (
        <div className="image-frame relative mt-4 aspect-[16/10] w-full rounded-xl border border-line">
          <img
            src={service.image}
            alt={service.imageAlt || service.title}
            className="size-full object-cover"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
      <p className="relative mt-2.5 text-[0.8rem] leading-relaxed text-muted">
        {service.description}
      </p>
      {service.items && service.items.length > 0 && (
        <ul className="relative mt-4 grid gap-x-4 gap-y-1.5 border-t border-line pt-4 sm:grid-cols-2">
          {service.items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-[0.76rem] leading-snug text-ink/85"
            >
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-gold" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="relative mt-5 flex flex-wrap items-center gap-1.5 pt-1">
        {service.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-line px-2 py-0.5 font-mono text-[0.5rem] uppercase tracking-[0.12em] text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className={service.items ? 'relative mt-auto pt-5' : 'relative mt-5'}>
        <button
          type="button"
          onClick={() => onSelect(service.title)}
          className="flex w-full items-center justify-between border-t border-line pt-3.5 text-left text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted transition-colors hover:text-gold"
        >
          <span>Start a project</span>
          <span className="grid size-7 place-items-center rounded-full border border-line transition-all duration-300 group-hover:border-gold/50 group-hover:text-gold">
            <Icon
              name="arrow"
              className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </span>
        </button>
      </div>
    </div>
  );
}

export function ServicesSection({
  onSelectService,
}: {
  onSelectService: (title: string) => void;
}) {
  return (
    <section id="services" className="section-pad relative">
      <div className="container-x">
        <SectionHeader
          index="02"
          eyebrow="Services"
          title={
            <>
              Everything your brand needs,{' '}
              <span className="serif-accent text-gold">designed with intent.</span>
            </>
          }
          intro="Twelve focused services across identity, print and digital. Choose one, or combine them into a complete visual system for your brand."
          aside={
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <LiveBadge />
              <span className="label !text-[0.52rem]">Remote · Worldwide</span>
            </div>
          }
        />
        <div className="mt-12 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {SERVICES.map((service, idx) => (
            <Reveal key={service.id} delay={(idx % 3) * 70} className="h-full">
              <ServiceCard service={service} index={idx} onSelect={onSelectService} />
            </Reveal>
          ))}
        </div>
        <div className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-2 sm:gap-4">
          {ADDITIONAL_SERVICES.map((service, idx) => (
            <Reveal key={service.id} delay={idx * 70} className="h-full">
              <ServiceCard
                service={service}
                index={SERVICES.length + idx}
                onSelect={onSelectService}
              />
            </Reveal>
          ))}
        </div>
        <Reveal delay={80} className="mt-12">
          <div className="relative overflow-hidden rounded-2xl border border-line bg-[linear-gradient(120deg,color-mix(in_srgb,var(--panel)_75%,transparent),color-mix(in_srgb,var(--violet)_8%,transparent))] p-6 sm:p-8">
            <div aria-hidden="true" className="orb absolute -right-10 -top-16 size-52 bg-violet/20" />
            <div aria-hidden="true" className="orb absolute -bottom-16 left-1/4 size-40 bg-gold/10" />
            <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <p className="label !text-gold">Tailored, not templated</p>
                <p className="mt-2 max-w-2xl font-display text-[clamp(1.35rem,2.4vw,1.9rem)] italic leading-snug text-ink">
                  Not sure which service you need? Describe the idea — I'll recommend the right
                  format.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <FiverrBtn label="Discuss on Fiverr" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

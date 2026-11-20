import React, { useState } from 'react';
import {
  CAPABILITY_GROUPS,
  LANGUAGES,
  PROCESS_STEPS,
  TOOLKIT,
  WHY_REASONS,
} from '../data/portfolio';
import { cn } from '../utils/hooks';
import { FiverrBtn, Icon, LiveBadge, Reveal, SectionHeader } from './Icons';

export function SkillsSection() {
  return (
    <section id="skills" className="section-pad relative overflow-hidden">
      <div
        aria-hidden="true"
        className="orb pointer-events-none absolute -right-32 top-24 size-96 bg-violet/10"
      />
      <div className="container-x relative">
        <SectionHeader
          index="04"
          eyebrow="Capabilities"
          title={
            <>
              A toolkit built for <span className="serif-accent text-gold">visual</span> problems.
            </>
          }
          intro="The disciplines I practise every week — from the first sketch of a mark to the final export, across three scripts."
          aside={
            <p className="mt-4 flex items-start gap-2 rounded-xl border border-line bg-surface p-3 text-[0.72rem] leading-relaxed text-muted">
              <Icon name="shield" className="mt-0.5 size-3.5 shrink-0 text-gold" />
              No certifications or proficiency scores are claimed here. These are the areas I
              actively work in.
            </p>
          }
        />
        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="space-y-8">
              {CAPABILITY_GROUPS.map((group, gIdx) => (
                <Reveal key={group.id} delay={gIdx * 80}>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[0.55rem] tracking-[0.16em] text-gold">
                      {String(gIdx + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted">
                      {group.label}
                    </h3>
                    <span className="h-px flex-1 bg-line" />
                    <span className="font-mono text-[0.52rem] text-muted/60">
                      {String(group.items.length).padStart(2, '0')}
                    </span>
                  </div>
                  <ul className="mt-2">
                    {group.items.map((item) => (
                      <li key={item}>
                        <div className="group relative flex items-center justify-between gap-4 border-b border-line py-3.5 transition-colors">
                          <span
                            aria-hidden="true"
                            className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-gold via-gold/50 to-transparent transition-transform duration-700 group-hover:scale-x-100"
                          />
                          <span className="flex items-center gap-3">
                            <span className="size-1 rounded-full bg-muted/50 transition-colors duration-300 group-hover:bg-gold" />
                            <span className="text-[0.95rem] text-ink/90 transition-colors group-hover:text-ink sm:text-[1rem]">
                              {item}
                            </span>
                          </span>
                          <span className="flex shrink-0 items-center gap-2">
                            <span className="hidden font-mono text-[0.5rem] uppercase tracking-[0.14em] text-muted/0 transition-colors duration-300 group-hover:text-muted/80 sm:block">
                              Practice area
                            </span>
                            <Icon
                              name="arrow"
                              className="size-3.5 -rotate-45 text-muted/40 transition-all duration-300 group-hover:rotate-0 group-hover:text-gold"
                            />
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
            <Reveal delay={120}>
              <div className="mt-8 flex items-center gap-3 rounded-xl border border-gold/20 bg-gold/[0.05] px-4 py-3">
                <Icon name="spark" className="size-4 shrink-0 text-gold" />
                <p className="text-[0.76rem] leading-relaxed text-muted">
                  <span className="text-ink">3.5+ years</span> of hands-on practice — the real
                  measure is the work, not a badge.
                </p>
              </div>
            </Reveal>
          </div>
          <div className="space-y-4 lg:col-span-5">
            <Reveal>
              <div className="premium-card relative p-5 sm:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="label !text-gold">Multilingual by design</p>
                    <p className="mt-2 max-w-[28ch] font-display text-[1.5rem] italic leading-tight text-ink">
                      One visual language, three scripts.
                    </p>
                  </div>
                  <span className="grid size-9 place-items-center rounded-full border border-line text-gold">
                    <Icon name="globe" className="size-4" />
                  </span>
                </div>
                <div className="mt-6 grid grid-cols-3 divide-x divide-line overflow-hidden rounded-xl border border-line bg-bg/30">
                  {LANGUAGES.map((lang) => (
                    <div
                      key={lang.label}
                      className="group px-2 py-5 text-center transition-colors hover:bg-surface"
                    >
                      <span
                        lang={lang.lang}
                        className="block text-[2rem] leading-none text-gold-soft transition-transform duration-500 group-hover:-translate-y-0.5 sm:text-[2.4rem]"
                      >
                        {lang.glyph}
                      </span>
                      <span
                        lang={lang.lang}
                        className="mt-3 block text-[0.72rem] font-medium text-ink"
                      >
                        {lang.label}
                      </span>
                      <span className="mt-1 block font-mono text-[0.45rem] uppercase tracking-[0.1em] text-muted">
                        {lang.note}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[0.76rem] leading-relaxed text-muted">
                  Layouts that respect direction, line height and letterform — not translations
                  forced into a Latin grid.
                </p>
              </div>
            </Reveal>
            <Reveal delay={90}>
              <div className="premium-card p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <p className="label">Working toolkit</p>
                  <Icon name="layers" className="size-4 text-gold" />
                </div>
                <ul className="mt-4 space-y-1">
                  {TOOLKIT.map((tool) => (
                    <li
                      key={tool.name}
                      className="group flex items-center gap-3 rounded-lg border border-transparent px-2 py-2.5 transition-colors hover:border-line hover:bg-surface"
                    >
                      <span className="grid size-8 shrink-0 place-items-center rounded-md border border-line bg-bg/40 font-mono text-[0.58rem] text-gold">
                        {tool.short}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.8rem] font-medium text-ink">
                          {tool.name}
                        </span>
                        <span className="block truncate font-mono text-[0.46rem] uppercase tracking-[0.12em] text-muted">
                          {tool.area}
                        </span>
                      </span>
                      <Icon
                        name="check"
                        className="size-3.5 text-muted/40 transition-colors group-hover:text-gold"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="relative overflow-hidden rounded-2xl border border-gold/25 bg-[linear-gradient(140deg,rgba(214,182,139,0.16),rgba(155,131,245,0.1))] p-5 sm:p-6">
                <div
                  className="dot-grid pointer-events-none absolute inset-0 text-gold/40 opacity-20"
                  aria-hidden="true"
                />
                <p className="relative font-display text-[1.4rem] italic leading-tight text-ink">
                  Need a second pair of eyes on a brief?
                </p>
                <p className="relative mt-2 text-[0.78rem] leading-relaxed text-muted">
                  Send it over with no obligation. I'll tell you honestly what it needs.
                </p>
                <FiverrBtn
                  label="Ask a question"
                  className="relative mt-4 !px-5 !py-3 !text-[0.62rem]"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReasonAccordion({
  reason,
  isOpen,
  onToggle,
  index,
}: {
  reason: (typeof WHY_REASONS)[number];
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <Reveal delay={index * 45}>
      <div
        className={cn(
          'group relative overflow-hidden border-b border-line transition-colors',
          isOpen ? 'bg-surface' : 'hover:bg-surface/60',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-y-0 left-0 w-px bg-gold transition-opacity duration-500',
            isOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-60',
          )}
        />
        <h3>
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-controls={`reason-panel-${reason.n}`}
            id={`reason-button-${reason.n}`}
            className="flex w-full items-center gap-4 px-3 py-5 text-left sm:gap-5 sm:px-5"
          >
            <span className="font-mono text-[0.58rem] tracking-[0.16em] text-gold/80">
              {reason.n}
            </span>
            <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-bg/40 text-muted transition-colors group-hover:text-gold">
              <Icon name={reason.icon} className="size-4" />
            </span>
            <span className="flex-1 text-[0.98rem] font-medium tracking-[-0.01em] text-ink sm:text-[1.05rem]">
              {reason.title}
            </span>
            <span
              aria-hidden="true"
              className={cn(
                'grid size-7 shrink-0 place-items-center rounded-full border transition-all duration-300',
                isOpen
                  ? 'rotate-45 border-gold/60 text-gold'
                  : 'border-line text-muted group-hover:border-gold/40 group-hover:text-gold',
              )}
            >
              <Icon name="plus" className="size-3.5" />
            </span>
          </button>
        </h3>
        <div
          id={`reason-panel-${reason.n}`}
          role="region"
          aria-labelledby={`reason-button-${reason.n}`}
          className={cn(
            'grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.2,.7,.2,1)]',
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
        >
          <div className="overflow-hidden">
            <p className="max-w-xl pb-5 pl-[4.4rem] pr-10 text-[0.82rem] leading-relaxed text-muted sm:pl-[5.1rem]">
              {reason.body}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function WhySection() {
  const [openKey, setOpenKey] = useState<string | null>('01');
  return (
    <section className="relative border-y border-line bg-[color-mix(in_srgb,var(--panel)_45%,transparent)]">
      <div className="section-pad container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal className="flex items-center gap-4">
                <span className="label !text-gold">05</span>
                <span className="h-px w-10 bg-gold/50" />
                <span className="label">Why work with me</span>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="mt-6 text-balance text-[clamp(2.1rem,4.4vw,3.6rem)] font-medium leading-[1.03] tracking-[-0.035em]">
                  A reliable partner, not just a{' '}
                  <span className="serif-accent text-gold">file.</span>
                </h2>
              </Reveal>
              <Reveal delay={140}>
                <p className="mt-5 max-w-sm text-[0.92rem] leading-relaxed text-muted">
                  Design projects go better when communication is clear, deadlines are respected and
                  the details are handled. That is the standard I work to on every brief.
                </p>
              </Reveal>
              <Reveal delay={200}>
                <div className="premium-card mt-8 max-w-sm p-5">
                  <div className="flex items-start justify-between">
                    <p className="label !text-gold">The short version</p>
                    <span className="font-display text-2xl italic leading-none text-gold/70">
                      07
                    </span>
                  </div>
                  <ul className="mt-4 space-y-2.5">
                    {[
                      { i: 'compass', t: 'Colombo based, working worldwide' },
                      { i: 'globe', t: 'English, Arabic & Tamil layouts' },
                      { i: 'clock', t: 'Milestones agreed before we start' },
                      { i: 'chat', t: 'Plain-language updates throughout' },
                    ].map((item) => (
                      <li
                        key={item.t}
                        className="flex items-center gap-2.5 text-[0.8rem] text-ink/90"
                      >
                        <Icon name={item.i} className="size-3.5 shrink-0 text-gold" />
                        {item.t}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                    <LiveBadge />
                  </div>
                  <FiverrBtn
                    label="Start a conversation"
                    className="mt-4 w-full !py-3 !text-[0.62rem]"
                  />
                </div>
              </Reveal>
            </div>
          </div>
          <div className="lg:col-span-7">
            <Reveal>
              <p className="mb-3 flex items-center justify-between border-b border-line pb-3">
                <span className="label">Seven reasons</span>
                <span className="label !text-[0.5rem]">Tap to expand</span>
              </p>
            </Reveal>
            <div>
              {WHY_REASONS.map((reason, idx) => (
                <ReasonAccordion
                  key={reason.n}
                  reason={reason}
                  index={idx}
                  isOpen={openKey === reason.n}
                  onToggle={() => setOpenKey(openKey === reason.n ? null : reason.n)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-line pt-12 md:mt-24">
          <Reveal className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="label !text-gold">How we'll work</p>
              <h3 className="mt-2 font-display text-[clamp(1.7rem,3vw,2.3rem)] italic text-ink">
                A simple, four-step process.
              </h3>
            </div>
            <p className="max-w-xs text-[0.76rem] leading-relaxed text-muted">
              No mystery, no endless revisions loop. Just a clear route from idea to final files.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, idx) => (
              <Reveal key={step.n} delay={idx * 70} className="h-full">
                <div className="group relative h-full bg-[color-mix(in_srgb,var(--panel)_92%,transparent)] p-5 transition-colors hover:bg-panel sm:p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[0.62rem] tracking-[0.16em] text-gold">
                      {step.n}
                    </span>
                    <span className="size-1.5 rounded-full bg-line-strong transition-colors group-hover:bg-gold" />
                  </div>
                  <p className="mt-7 text-[1rem] font-medium">{step.title}</p>
                  <p className="mt-2 text-[0.78rem] leading-relaxed text-muted">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

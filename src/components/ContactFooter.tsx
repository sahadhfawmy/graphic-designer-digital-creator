import React, { useEffect, useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import {
  ADDITIONAL_SERVICES,
  DIRECT_CHANNELS,
  FIVERR_URL,
  NAV_LINKS,
  SERVICES,
  SOCIAL_PROFILES,
} from '../data/portfolio';
import { BLUEPRINT_LIMITS, BriefStatus, validateBriefField } from '../lib/validation';
import { cn, scrollToEl } from '../utils/hooks';
import { BrandLogo, Icon, LiveBadge, Reveal, ThemeToggle } from './Icons';

const INITIAL_BRIEF = {
  name: '',
  email: '',
  service: '',
  budget: "Let's discuss",
  message: '',
};

const SERVICE_OPTIONS = [
  ...SERVICES.map((s) => s.title),
  ...ADDITIONAL_SERVICES.map((s) => s.title),
  'Something else',
];

function FieldError({ id, children }: { id: string; children?: string }) {
  return children ? (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-[0.7rem] text-danger" role="alert">
      <Icon name="close" className="size-3" />
      {children}
    </p>
  ) : null;
}

export function ContactSection({
  interest,
}: {
  interest: { title: string; id: number };
}) {
  const {
    user,
    authReady,
    authBusy,
    authError,
    isAdmin,
    briefs,
    signInWithGoogle,
    submitBrief,
    updateBriefStatus,
    deleteBrief,
  } = useFirebase();

  const [form, setForm] = useState(INITIAL_BRIEF);
  const [errors, setErrors] = useState<Partial<Record<'name' | 'email' | 'service' | 'message', string>>>({});
  const [stage, setStage] = useState<'idle' | 'prepared' | 'saved'>('idle');
  const [prefilled, setPrefilled] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (interest.title) {
      setForm((prev) => ({ ...prev, service: interest.title }));
      setPrefilled(true);
      setStage('idle');
    }
  }, [interest]);

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      name: prev.name || user.displayName || '',
      email: prev.email || user.email || '',
    }));
  }, [user]);

  function validateAll(data: typeof INITIAL_BRIEF) {
    const next: Partial<Record<'name' | 'email' | 'service' | 'message', string>> = {};
    (['name', 'email', 'service', 'message'] as const).forEach((field) => {
      const msg = validateBriefField(field, data[field]);
      if (msg) next[field] = msg;
    });
    return next;
  }

  function updateField(field: keyof typeof INITIAL_BRIEF, val: string) {
    setForm((prev) => ({ ...prev, [field]: val }));
    if (field !== 'budget' && errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateBriefField(field, val) }));
    }
    if (copyState !== 'idle') setCopyState('idle');
    if (submitError) setSubmitError(null);
  }

  function onBlurField(field: 'name' | 'email' | 'service' | 'message') {
    const msg = validateBriefField(field, form[field]);
    setErrors((prev) => ({ ...prev, [field]: msg }));
  }

  async function saveToFirebase() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitBrief(form);
      setStage('saved');
      window.setTimeout(() => {
        scrollToEl(document.getElementById('brief-result'), 'center');
      }, 80);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Unable to save brief.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validateAll(form);
    setErrors(nextErrors);
    const firstErr = Object.keys(nextErrors)[0];
    if (firstErr) {
      document.getElementById(`brief-${firstErr}`)?.focus();
      return;
    }

    if (user) {
      await saveToFirebase();
    } else {
      setStage('prepared');
      window.setTimeout(() => {
        scrollToEl(document.getElementById('brief-result'), 'center');
      }, 80);
    }
  }

  async function handleSignInAndSave() {
    const signedUser = await signInWithGoogle();
    if (signedUser) {
      await saveToFirebase();
    }
  }

  const formattedBrief = `Project brief — Sahadh Fawmy\nName: ${form.name}\nEmail: ${form.email}\nService: ${form.service}\nBudget: ${form.budget}\nDetails: ${form.message}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(formattedBrief);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  }

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <section id="contact" className="section-pad relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="orb absolute -left-24 top-10 size-80 bg-gold/10" />
        <div className="orb absolute -right-24 bottom-0 size-96 bg-violet/15" />
        <div className="dot-grid absolute inset-x-0 bottom-0 h-64 text-line-strong opacity-20 [mask-image:linear-gradient(to_top,black,transparent)]" />
      </div>
      <div className="container-x relative">
        <Reveal className="flex items-center gap-4">
          <span className="label !text-gold">06</span>
          <span className="h-px w-10 bg-gold/50" />
          <span className="label">Contact &amp; hire</span>
        </Reveal>
        <div className="mt-7 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Reveal delay={60}>
              <h2 className="text-balance text-[clamp(2.3rem,5.6vw,4.6rem)] font-medium leading-[0.98] tracking-[-0.045em]">
                Let's create something{' '}
                <span className="serif-accent gold-text">amazing</span> together.
              </h2>
            </Reveal>
            <Reveal delay={130}>
              <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-muted">
                Have a project in mind? Let's turn your ideas into creative and professional visual
                experiences.
              </p>
            </Reveal>
          </div>
          <Reveal delay={190} className="lg:col-span-4 lg:justify-self-end">
            <div className="flex flex-col items-start gap-3 lg:items-end">
              <LiveBadge />
              <a
                href={FIVERR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold group"
              >
                Hire me on Fiverr
                <Icon
                  name="arrow"
                  className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
              <p className="font-mono text-[0.5rem] uppercase tracking-[0.16em] text-muted">
                Replies via Fiverr · Colombo GMT+5:30
              </p>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-3 lg:col-span-5">
            <Reveal>
              <p className="label mb-2">Direct channels</p>
            </Reveal>
            {DIRECT_CHANNELS.map((channel, idx) => (
              <Reveal key={channel.label} delay={idx * 70}>
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'group flex items-center gap-4 rounded-2xl border p-4 transition-all duration-300',
                    channel.label === 'Fiverr'
                      ? 'border-gold/35 bg-[linear-gradient(120deg,rgba(214,182,139,0.13),rgba(155,131,245,0.07))] hover:border-gold/60'
                      : 'border-line bg-surface hover:border-line-strong',
                  )}
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-bg/40 text-gold">
                    <Icon name={channel.icon} className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-[0.9rem] font-medium text-ink">{channel.label}</span>
                      <span className="rounded-full border border-line px-1.5 py-0.5 font-mono text-[0.42rem] uppercase tracking-[0.12em] text-muted">
                        {channel.note}
                      </span>
                    </span>
                    <span className="mt-1 block truncate text-[0.78rem] text-muted">
                      {channel.value}
                    </span>
                  </span>
                  <Icon
                    name="arrow"
                    className="size-4 shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
                  />
                </a>
              </Reveal>
            ))}
            <Reveal delay={210}>
              <p className="mt-6 flex items-start gap-2 text-[0.7rem] leading-relaxed text-muted/80">
                <Icon name="shield" className="mt-0.5 size-3.5 shrink-0 text-gold" />
                Email, phone and social handles are not published here to avoid fake or broken
                links. Ask for them through Fiverr and you'll receive the correct details directly.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-6">
                <p className="label mb-2.5 !text-[0.52rem]">Social profiles</p>
                <div className="grid grid-cols-2 gap-2">
                  {SOCIAL_PROFILES.map((soc) => (
                    <span
                      key={soc.label}
                      aria-label={`${soc.label} profile — coming soon`}
                      className="flex items-center justify-between rounded-lg border border-line bg-surface px-3 py-2.5"
                    >
                      <span className="text-[0.78rem] text-ink/80">{soc.label}</span>
                      <span className="font-mono text-[0.42rem] uppercase tracking-[0.1em] text-muted/60">
                        {soc.handle}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120} className="lg:col-span-7">
            <div className="premium-card p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="label !text-gold">Project brief</p>
                  <h3 className="mt-2 text-[1.3rem] font-medium tracking-[-0.02em]">
                    Tell me about the idea.
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {authReady && !user && (
                    <button
                      type="button"
                      disabled={authBusy}
                      onClick={() => void signInWithGoogle()}
                      className="rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-[0.54rem] uppercase tracking-[0.14em] text-ink transition-colors hover:border-gold hover:text-gold disabled:opacity-50"
                    >
                      {authBusy ? 'Signing in...' : 'Sign in with Google'}
                    </button>
                  )}
                  {user && (
                    <span className="rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-[0.52rem] uppercase tracking-[0.12em] text-gold">
                      {isAdmin ? 'Studio Admin' : 'Synced · Google'}
                    </span>
                  )}
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-gold">
                    <Icon name="chat" className="size-4" />
                  </span>
                </div>
              </div>

              {authError && (
                <p className="mt-3 text-[0.72rem] text-danger" role="alert">
                  {authError}
                </p>
              )}

              {stage === 'prepared' || stage === 'saved' ? (
                <div id="brief-result" className="fade-up mt-6" aria-live="polite">
                  <div className="flex items-start gap-3 rounded-xl border border-gold/30 bg-gold/[0.07] p-4">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gold text-[#16120b]">
                      <Icon name="check" className="size-4" />
                    </span>
                    <div>
                      <p className="text-[0.9rem] font-medium text-ink">
                        {stage === 'saved'
                          ? `Your brief is saved & synced, ${form.name.split(' ')[0]}.`
                          : `Your brief is ready, ${form.name.split(' ')[0]}.`}
                      </p>
                      <p className="mt-1 text-[0.78rem] leading-relaxed text-muted">
                        {stage === 'saved'
                          ? 'Your brief is stored securely in Firebase with real-time status tracking below. You can also copy it or open Fiverr directly.'
                          : "Sign in with Google to save and track your brief in real time, or copy your brief and send it through Fiverr — the preferred channel."}
                      </p>
                    </div>
                  </div>
                  <dl className="mt-4 space-y-2 rounded-xl border border-line bg-bg/30 p-4 font-mono text-[0.7rem]">
                    {[
                      ['Name', form.name],
                      ['Email', form.email],
                      ['Service', form.service],
                      ['Budget', form.budget],
                    ].map(([label, val]) => (
                      <div key={label} className="flex gap-3">
                        <dt className="w-16 shrink-0 uppercase tracking-[0.1em] text-muted">
                          {label}
                        </dt>
                        <dd className="min-w-0 flex-1 break-words text-ink/90">{val}</dd>
                      </div>
                    ))}
                    <div className="flex gap-3 border-t border-line pt-2">
                      <dt className="w-16 shrink-0 uppercase tracking-[0.1em] text-muted">Brief</dt>
                      <dd className="min-w-0 flex-1 whitespace-pre-wrap break-words text-ink/90">
                        {form.message}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                    {stage === 'prepared' && !user && (
                      <button
                        type="button"
                        disabled={authBusy || submitting}
                        onClick={() => void handleSignInAndSave()}
                        className="btn btn-gold flex-1 !py-3 !text-[0.62rem]"
                      >
                        <Icon name="user" className="size-3.5" />
                        {submitting ? 'Saving...' : 'Sign in & save brief'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="btn btn-ghost flex-1 !py-3 !text-[0.62rem]"
                    >
                      <Icon name={copyState === 'copied' ? 'check' : 'copy'} className="size-3.5" />
                      {copyState === 'copied' ? 'Copied to clipboard' : 'Copy brief'}
                    </button>
                    <a
                      href={FIVERR_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'btn flex-1 !py-3 !text-[0.62rem]',
                        stage === 'saved' || user ? 'btn-gold' : 'btn-ghost',
                      )}
                    >
                      Open Fiverr to send
                      <Icon name="arrow" className="size-3.5" />
                    </a>
                  </div>
                  {copyState === 'failed' && (
                    <p className="mt-2 text-[0.7rem] text-danger" role="alert">
                      Clipboard access was blocked. Select the brief above and copy it manually.
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => setStage('idle')}
                    className="mt-3 inline-flex items-center gap-1.5 text-[0.7rem] uppercase tracking-[0.12em] text-muted transition-colors hover:text-gold"
                  >
                    <Icon name="arrow" className="size-3 rotate-180" />
                    {stage === 'saved' ? 'Submit another brief' : 'Edit the brief'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="mt-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="brief-name"
                        className="mb-1.5 flex items-center justify-between font-mono text-[0.52rem] uppercase tracking-[0.16em] text-muted"
                      >
                        Your name <span className="text-gold">*</span>
                      </label>
                      <input
                        id="brief-name"
                        name="name"
                        className="field"
                        placeholder="e.g. Alex Perera"
                        autoComplete="name"
                        maxLength={BLUEPRINT_LIMITS.brief.name.maxLength}
                        value={form.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        onBlur={() => onBlurField('name')}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'error-name' : undefined}
                        required
                      />
                      <FieldError id="error-name">{errors.name}</FieldError>
                    </div>
                    <div>
                      <label
                        htmlFor="brief-email"
                        className="mb-1.5 flex items-center justify-between font-mono text-[0.52rem] uppercase tracking-[0.16em] text-muted"
                      >
                        Email <span className="text-gold">*</span>
                      </label>
                      <input
                        id="brief-email"
                        name="email"
                        type="email"
                        inputMode="email"
                        className="field"
                        placeholder="you@company.com"
                        autoComplete="email"
                        maxLength={BLUEPRINT_LIMITS.brief.email.maxLength}
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        onBlur={() => onBlurField('email')}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'error-email' : undefined}
                        required
                      />
                      <FieldError id="error-email">{errors.email}</FieldError>
                    </div>
                    <div>
                      <label
                        htmlFor="brief-service"
                        className="mb-1.5 flex items-center justify-between font-mono text-[0.52rem] uppercase tracking-[0.16em] text-muted"
                      >
                        Service <span className="text-gold">*</span>
                      </label>
                      <select
                        id="brief-service"
                        name="service"
                        className="field"
                        value={form.service}
                        onChange={(e) => updateField('service', e.target.value)}
                        onBlur={() => onBlurField('service')}
                        aria-invalid={!!errors.service}
                        aria-describedby={errors.service ? 'error-service' : undefined}
                        required
                      >
                        <option value="">Select a service</option>
                        {SERVICE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <FieldError id="error-service">{errors.service}</FieldError>
                      {prefilled && form.service && (
                        <button
                          type="button"
                          onClick={() => {
                            setForm((prev) => ({ ...prev, service: '' }));
                            setPrefilled(false);
                          }}
                          className="mt-1.5 inline-flex items-center gap-1 font-mono text-[0.5rem] uppercase tracking-[0.12em] text-gold/80 hover:text-gold"
                        >
                          <Icon name="check" className="size-2.5" /> Pre-filled from services — clear
                        </button>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="brief-budget"
                        className="mb-1.5 flex items-center justify-between font-mono text-[0.52rem] uppercase tracking-[0.16em] text-muted"
                      >
                        Budget range
                      </label>
                      <select
                        id="brief-budget"
                        name="budget"
                        className="field"
                        value={form.budget}
                        onChange={(e) => updateField('budget', e.target.value)}
                      >
                        {BLUEPRINT_LIMITS.brief.budgets.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="brief-message"
                        className="mb-1.5 flex items-center justify-between font-mono text-[0.52rem] uppercase tracking-[0.16em] text-muted"
                      >
                        <span>
                          Project details <span className="text-gold">*</span>
                        </span>
                        <span
                          className={cn(
                            'tabular-nums',
                            form.message.length > 1900 ? 'text-danger' : 'text-muted/60',
                          )}
                        >
                          {form.message.length} / 2000
                        </span>
                      </label>
                      <textarea
                        id="brief-message"
                        name="message"
                        rows={5}
                        className="field resize-y"
                        placeholder="What are you creating, who is it for, and when do you need it? A few lines is enough."
                        value={form.message}
                        onChange={(e) => updateField('message', e.target.value.slice(0, 2000))}
                        onBlur={() => onBlurField('message')}
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? 'error-message' : undefined}
                        required
                      />
                      <FieldError id="error-message">{errors.message}</FieldError>
                    </div>
                  </div>
                  {submitError && (
                    <p className="mt-3 text-[0.72rem] text-danger" role="alert">
                      {submitError}
                    </p>
                  )}
                  <div className="mt-5 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <button type="submit" disabled={submitting} className="btn btn-gold group">
                      {submitting ? 'Saving brief...' : user ? 'Submit project brief' : 'Prepare my brief'}
                      <Icon
                        name="arrow"
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                      />
                    </button>
                    <p className="flex items-start gap-2 text-[0.66rem] leading-relaxed text-muted/80 sm:max-w-[16rem]">
                      <Icon name="shield" className="mt-0.5 size-3 shrink-0 text-gold" />
                      {user
                        ? 'Saved to Firebase with real-time status updates.'
                        : 'Sign in with Google to save & track in real time, or prepare locally.'}
                    </p>
                  </div>
                  <div className="sr-only" aria-live="polite">
                    {errorCount ? `Please review ${errorCount} highlighted field(s).` : ''}
                  </div>
                </form>
              )}

              {user && briefs.length > 0 && (
                <div className="mt-6 border-t border-line pt-5">
                  <div className="flex items-center justify-between">
                    <p className="label !text-gold">
                      {isAdmin ? 'Incoming briefs · Real-time' : 'Your saved briefs · Real-time'}
                    </p>
                    <span className="font-mono text-[0.52rem] text-muted">
                      {String(briefs.length).padStart(2, '0')} total
                    </span>
                  </div>
                  <ul className="mt-3 space-y-2.5">
                    {briefs.map((item) => {
                      const isTerminal = item.status === 'accepted' || item.status === 'archived';
                      return (
                        <li
                          key={item.id}
                          className="rounded-xl border border-line bg-bg/30 p-3.5 text-[0.76rem]"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-medium text-ink">
                              {item.service} · <span className="text-muted">{item.budget}</span>
                            </span>
                            <div className="flex items-center gap-2">
                              {isAdmin ? (
                                <select
                                  aria-label={`Status for ${item.name}`}
                                  value={item.status}
                                  onChange={(e) =>
                                    void updateBriefStatus(item.id, e.target.value as BriefStatus)
                                  }
                                  className="rounded-md border border-line bg-panel px-2 py-1 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-gold"
                                >
                                  {BLUEPRINT_LIMITS.brief.statuses.map((st) => (
                                    <option key={st} value={st}>
                                      {st}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[0.5rem] uppercase tracking-[0.12em] text-gold">
                                  {item.status}
                                </span>
                              )}
                              {(!isTerminal || isAdmin) && (
                                <button
                                  type="button"
                                  onClick={() => void deleteBrief(item.id)}
                                  aria-label="Delete brief"
                                  className="text-muted transition-colors hover:text-danger"
                                >
                                  <Icon name="close" className="size-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                          {isAdmin && (
                            <p className="mt-1 font-mono text-[0.55rem] text-muted">
                              {item.name} · {item.email}
                            </p>
                          )}
                          <p className="mt-1.5 line-clamp-2 text-[0.74rem] text-muted">
                            {item.message}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ColomboClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const formatNow = () => {
      try {
        return new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Colombo',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(new Date());
      } catch {
        return new Date().toLocaleTimeString();
      }
    };
    setTime(formatNow());
    const id = window.setInterval(() => setTime(formatNow()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-muted">
      <Icon name="clock" className="size-3 text-gold" />
      Colombo
      <span className="tabular-nums text-ink/80" aria-live="off">
        {time || '--:--:--'}
      </span>
    </span>
  );
}

export function Footer({
  theme,
  onToggleTheme,
}: {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}) {
  return (
    <footer className="relative z-10 border-t border-line">
      <div className="container-x pt-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <BrandLogo />
            <p className="mt-5 max-w-xs text-[0.84rem] leading-relaxed text-muted">
              Independent graphic designer and digital creator from Colombo, Sri Lanka — turning
              ideas into visual experiences that work.
            </p>
            <div className="mt-5">
              <LiveBadge />
            </div>
            <a
              href={FIVERR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-[0.72rem] font-medium transition-colors hover:border-gold"
            >
              <span className="grid size-6 place-items-center rounded-full border border-line text-gold">
                <Icon name="fiverr" className="size-3" />
              </span>
              fiverr.com/s/odWm2Lb
              <Icon
                name="arrow"
                className="size-3.5 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
          <nav aria-label="Footer navigation" className="md:col-span-2">
            <p className="label !text-gold">Explore</p>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="link-underline text-[0.82rem] text-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-3">
            <p className="label !text-gold">Services</p>
            <ul className="mt-4 space-y-2.5">
              {SERVICES.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <a
                    href="#services"
                    className="link-underline text-[0.82rem] text-muted transition-colors hover:text-ink"
                  >
                    {service.title.replace(' Design', '').replace(' & ', ' & ')}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#services"
                  className="inline-flex items-center gap-1.5 text-[0.78rem] text-gold transition-opacity hover:opacity-80"
                >
                  All twelve services
                  <Icon name="arrow" className="size-3" />
                </a>
              </li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="label !text-gold">Connect</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={FIVERR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.82rem] text-muted transition-colors hover:text-ink"
                >
                  Fiverr <span className="text-gold">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-[0.82rem] text-muted transition-colors hover:text-ink"
                >
                  Email — on request
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-[0.82rem] text-muted transition-colors hover:text-ink"
                >
                  WhatsApp — on request
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-[0.82rem] text-muted transition-colors hover:text-ink"
                >
                  Social — soon
                </a>
              </li>
            </ul>
          </div>
        </div>
        <a
          href="#top"
          aria-label="Back to top — Sahadh Fawmy"
          className="group mt-14 flex items-end justify-between gap-4 border-t border-line pt-8"
        >
          <span className="flex flex-wrap items-baseline gap-x-3 uppercase leading-[0.8] tracking-[-0.045em] sm:gap-x-5">
            <span className="text-[clamp(2.2rem,8vw,6.4rem)] font-medium text-ink/90 transition-colors group-hover:text-ink">
              Sahadh
            </span>
            <span className="font-display text-[clamp(2.4rem,8.6vw,6.8rem)] italic text-gold transition-opacity group-hover:opacity-80">
              Fawmy
            </span>
          </span>
          <span className="mb-2 hidden size-12 shrink-0 place-items-center rounded-full border border-line text-muted transition-all duration-300 group-hover:-translate-y-1 group-hover:border-gold group-hover:text-gold sm:grid">
            <Icon name="arrowUp" className="size-5" />
          </span>
        </a>
        <div className="mt-8 flex flex-col gap-4 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-muted">
              © {new Date().getFullYear()} Sahadh Fawmy · All rights reserved
            </p>
            <span className="hidden h-3 w-px bg-line-strong sm:block" />
            <p className="font-mono text-[0.53rem] uppercase tracking-[0.12em] text-muted/70">
              Concept visuals clearly labelled
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ColomboClock />
            <ThemeToggle theme={theme} onToggle={onToggleTheme} className="size-8" />
          </div>
        </div>
      </div>
    </footer>
  );
}

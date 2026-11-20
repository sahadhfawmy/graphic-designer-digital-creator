import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { FIVERR_URL, PROJECT_CATEGORIES } from '../data/portfolio';
import { BLUEPRINT_LIMITS, PortfolioProject, ProjectCategory } from '../lib/validation';
import { cn } from '../utils/hooks';
import { ActionBtn, FiverrBtn, Icon, Reveal, SectionHeader, TagPill } from './Icons';

function ProjectCard({
  project,
  index,
  onOpen,
  spanClass,
}: {
  project: PortfolioProject;
  index: number;
  onOpen: () => void;
  spanClass: string;
}) {
  return (
    <article
      className={cn(
        'group relative w-full overflow-hidden rounded-2xl border border-line bg-panel text-left transition-colors duration-500 hover:border-gold/50 focus-within:border-gold/50',
        'h-[330px] sm:h-[360px] lg:h-[380px]',
        spanClass,
      )}
      style={{ animation: `fade-up .65s cubic-bezier(.2,.7,.2,1) ${index * 55}ms both` }}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open project details: ${project.title} (${project.category}, concept study)`}
        className="absolute inset-0 z-20 size-full rounded-2xl"
      />
      <div aria-hidden="true" className="image-frame absolute inset-0">
        <img
          src={project.image}
          alt={`${project.title} — ${project.subtitle}. Illustrative concept visual.`}
          className="size-full object-cover"
          loading={index < 3 ? 'eager' : 'lazy'}
          decoding="async"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,10,0.5)_0%,rgba(6,6,10,0.02)_35%,rgba(6,6,10,0.82)_100%)] transition-opacity duration-500 group-hover:opacity-90"
        />
      </div>
      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
        <span className="rounded-full border border-white/15 bg-black/35 px-2.5 py-1 font-mono text-[0.52rem] uppercase tracking-[0.16em] text-white/80 backdrop-blur-md">
          {project.category}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="rounded-full border border-white/15 bg-black/35 px-2.5 py-1 font-mono text-[0.5rem] uppercase tracking-[0.16em] text-white/60 backdrop-blur-md">
            Concept
          </span>
          <span className="font-mono text-[0.55rem] tracking-[0.14em] text-white/55">
            {project.year}
          </span>
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-[0.52rem] uppercase tracking-[0.18em] text-gold-soft">
              {project.subtitle}
            </p>
            <h3 className="mt-1.5 truncate text-[1.15rem] font-medium tracking-[-0.02em] text-white sm:text-[1.3rem]">
              {project.title}
            </h3>
            <p className="mt-2 max-h-0 overflow-hidden text-[0.78rem] leading-relaxed text-white/65 opacity-0 transition-all duration-500 group-hover:max-h-16 group-hover:opacity-100 group-focus-within:max-h-16 group-focus-within:opacity-100">
              {project.blurb}
            </p>
          </div>
          <span
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-full border border-white/25 bg-white/5 text-white backdrop-blur-md transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-[#16120b] group-focus-within:border-gold group-focus-within:bg-gold group-focus-within:text-[#16120b]"
          >
            <Icon
              name="arrow"
              className="size-4 -rotate-45 transition-transform duration-500 group-hover:rotate-0 group-focus-within:rotate-0"
            />
          </span>
        </div>
        <span className="mt-4 block h-px w-full origin-left scale-x-0 bg-gradient-to-r from-gold to-transparent transition-transform duration-700 group-hover:scale-x-100 group-focus-within:scale-x-100" />
      </div>
    </article>
  );
}

function ProjectLightbox({
  project,
  position,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  project: PortfolioProject;
  position: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.classList.add('no-scroll');
    const prevActive = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
      if (e.key !== 'Tab' || !modalRef.current) return;
      const focusables = modalRef.current.querySelectorAll('a[href], button:not([disabled])');
      if (!focusables.length) return;
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

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('no-scroll');
      document.removeEventListener('keydown', onKeyDown);
      prevActive?.focus?.();
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-md sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="fade-up relative my-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-line-strong bg-panel shadow-2xl"
      >
        <div className="grid lg:grid-cols-[1.15fr_1fr]">
          <div className="relative bg-black">
            <div className="image-frame aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[540px]">
              <img
                src={project.image}
                alt={`${project.title} — ${project.subtitle}. Illustrative concept visual.`}
                className="size-full object-cover"
              />
            </div>
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
              <span className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 font-mono text-[0.52rem] uppercase tracking-[0.16em] text-white/80 backdrop-blur-md">
                {project.category}
              </span>
              <span className="rounded-full border border-gold/30 bg-black/40 px-2.5 py-1 font-mono text-[0.5rem] uppercase tracking-[0.16em] text-gold-soft backdrop-blur-md">
                Illustrative concept
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-white/60">
                {String(position).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-white/60">
                SF — Portfolio
              </span>
            </div>
          </div>
          <div className="relative flex flex-col p-5 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="label !text-[0.52rem] !text-gold">{project.subtitle}</p>
                <h3
                  id="lightbox-title"
                  className="mt-2 text-[1.6rem] font-medium leading-tight tracking-[-0.03em] sm:text-[1.85rem]"
                >
                  {project.title}
                </h3>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close project preview"
                className="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-gold hover:text-gold"
              >
                <Icon name="close" className="size-4" />
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <TagPill className="!text-gold-soft">{project.year}</TagPill>
              <TagPill>{project.category}</TagPill>
              <TagPill>Concept study</TagPill>
            </div>
            <p className="mt-5 text-[0.88rem] leading-relaxed text-muted">{project.description}</p>
            <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-line pt-5">
              <div>
                <dt className="font-mono text-[0.5rem] uppercase tracking-[0.18em] text-muted">
                  Deliverables
                </dt>
                <dd className="mt-2 space-y-1">
                  {project.deliverables.map((item) => (
                    <span key={item} className="block text-[0.78rem] leading-snug text-ink/90">
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[0.5rem] uppercase tracking-[0.18em] text-muted">
                  Tools &amp; skills
                </dt>
                <dd className="mt-2 space-y-1">
                  {project.tools.map((tool) => (
                    <span key={tool} className="block text-[0.78rem] leading-snug text-ink/90">
                      {tool}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
            <div className="mt-6 rounded-xl border border-gold/20 bg-gold/[0.06] p-3.5">
              <p className="font-mono text-[0.5rem] uppercase tracking-[0.16em] text-gold">
                Please note
              </p>
              <p className="mt-1.5 text-[0.74rem] leading-relaxed text-muted">
                This is a self-initiated design concept, not a delivered client project. Visuals are
                illustrative placeholders and will be replaced with real client work as it is
                released.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <a
                href={FIVERR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold flex-1 !px-4 !py-3 !text-[0.62rem]"
              >
                Request something similar
                <Icon name="arrow" className="size-3.5" />
              </a>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost !px-4 !py-3 !text-[0.62rem]"
              >
                All work
              </button>
            </div>
            <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-5">
              <button
                type="button"
                onClick={onPrev}
                className="group flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
              >
                <span className="grid size-8 place-items-center rounded-full border border-line transition-colors group-hover:border-gold">
                  <Icon name="arrow" className="size-3.5 rotate-180" />
                </span>
                Prev
              </button>
              <span className="label !text-[0.48rem]">Arrow keys to browse</span>
              <button
                type="button"
                onClick={onNext}
                className="group flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
              >
                Next
                <span className="grid size-8 place-items-center rounded-full border border-line transition-colors group-hover:border-gold">
                  <Icon name="arrow" className="size-3.5" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkSection() {
  const { projects, projectsLive, isAdmin, saveProject } = useFirebase();
  const [category, setCategory] = useState('All Work');
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState<ProjectCategory>('Logo & Branding');
  const [newBlurb, setNewBlurb] = useState('');
  const [editorError, setEditorError] = useState<string | null>(null);

  const visibleProjects = useMemo(
    () =>
      (category === 'All Work'
        ? projects
        : projects.filter((p) => p.category === category)
      ).filter((p) => p.published !== false || isAdmin),
    [projects, category, isAdmin],
  );

  const closeModal = useCallback(() => setActiveIdx(null), []);
  const prevModal = useCallback(
    () => setActiveIdx((i) => (i === null ? i : (i - 1 + visibleProjects.length) % visibleProjects.length)),
    [visibleProjects.length],
  );
  const nextModal = useCallback(
    () => setActiveIdx((i) => (i === null ? i : (i + 1) % visibleProjects.length)),
    [visibleProjects.length],
  );

  useEffect(() => {
    setActiveIdx(null);
  }, [category]);

  const getSpanClass = (project: PortfolioProject) => {
    if (category === 'All Work') {
      return project.span === 'wide' ? 'sm:col-span-2 lg:col-span-8' : 'lg:col-span-4';
    }
    if (visibleProjects.length === 1) return 'sm:col-span-2 lg:col-span-12';
    if (visibleProjects.length === 2) return 'sm:col-span-1 lg:col-span-6';
    return 'lg:col-span-4';
  };

  async function handleAdminCreate(e: React.FormEvent) {
    e.preventDefault();
    setEditorError(null);
    const title = newTitle.trim();
    const subtitle = newSubtitle.trim();
    const blurb = newBlurb.trim();
    if (title.length < 2 || subtitle.length < 2 || blurb.length < 5) {
      setEditorError('Please fill out title, subtitle, and blurb.');
      return;
    }
    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 48) || `study-${Date.now()}`;

    setSaving(true);
    try {
      await saveProject({
        id: `${slug}-${Date.now().toString(36)}`,
        title,
        subtitle,
        category: newCategory,
        year: String(new Date().getFullYear()),
        image: '/assets/portfolio/work-aurelian.jpg',
        blurb,
        description: `${blurb} Added via the live studio portfolio catalog.`,
        deliverables: ['Visual study', 'High-res export'],
        tools: ['Adobe Illustrator', 'Adobe Photoshop'],
        span: 'normal',
        sortOrder: projects.length,
        published: true,
      });
      setNewTitle('');
      setNewSubtitle('');
      setNewBlurb('');
      setEditorOpen(false);
    } catch (err) {
      setEditorError(err instanceof Error ? err.message : 'Unable to save project.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section id="work" className="section-pad relative">
      <div className="container-x">
        <SectionHeader
          index="03"
          eyebrow="Selected work"
          title={
            <>
              A selection of <span className="serif-accent text-gold">concept</span> work.
            </>
          }
          intro="Self-initiated studies across identity, print, social and digital — a clear look at how I think, compose and finish a piece."
          aside={
            <p className="mt-4 flex items-start gap-2 border-l border-gold/40 pl-3 text-[0.72rem] leading-relaxed text-muted">
              <Icon name="shield" className="mt-0.5 size-3.5 shrink-0 text-gold" />
              Every piece below is clearly labelled as a concept study. No client names, awards or
              results are invented here.
            </p>
          }
        />

        <Reveal delay={60} className="mt-10">
          <div className="flex flex-col gap-4 border-y border-line py-4 lg:flex-row lg:items-center lg:justify-between">
            <div
              className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="group"
              aria-label="Filter projects by category"
            >
              {PROJECT_CATEGORIES.map((cat) => {
                const count =
                  cat === 'All Work'
                    ? projects.length
                    : projects.filter((p) => p.category === cat).length;
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    aria-pressed={active}
                    className={cn(
                      'shrink-0 rounded-full border px-3.5 py-2 text-[0.7rem] tracking-[0.02em] transition-all duration-300',
                      active
                        ? 'filter-active'
                        : 'border-line text-muted hover:border-line-strong hover:text-ink',
                    )}
                  >
                    {cat}
                    <span
                      className={cn(
                        'ml-1.5 font-mono text-[0.55rem]',
                        active ? 'opacity-60' : 'text-muted/60',
                      )}
                    >
                      {String(count).padStart(2, '0')}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-gold" />
                <span className="label !text-[0.52rem]">
                  {String(visibleProjects.length).padStart(2, '0')} projects ·{' '}
                  {category === 'All Work' ? 'All categories' : category}
                  {projectsLive ? ' · Live' : ''}
                </span>
              </div>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setEditorOpen((v) => !v)}
                  className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-[0.52rem] uppercase tracking-[0.14em] text-gold transition-colors hover:border-gold"
                >
                  {editorOpen ? 'Close editor' : '+ Add study'}
                </button>
              )}
            </div>
          </div>
        </Reveal>

        {isAdmin && editorOpen && (
          <form
            onSubmit={handleAdminCreate}
            className="mt-5 rounded-2xl border border-line bg-panel p-5"
          >
            <p className="label !text-gold">Publish real-time study</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <input
                type="text"
                className="field"
                placeholder="Project title"
                value={newTitle}
                maxLength={BLUEPRINT_LIMITS.project.title.maxLength}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
              <input
                type="text"
                className="field"
                placeholder="Subtitle (e.g. Brand study)"
                value={newSubtitle}
                maxLength={BLUEPRINT_LIMITS.project.subtitle.maxLength}
                onChange={(e) => setNewSubtitle(e.target.value)}
                required
              />
              <select
                className="field"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as ProjectCategory)}
              >
                {BLUEPRINT_LIMITS.project.categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className="field sm:col-span-2"
                placeholder="Short blurb"
                value={newBlurb}
                maxLength={BLUEPRINT_LIMITS.project.blurb.maxLength}
                onChange={(e) => setNewBlurb(e.target.value)}
                required
              />
              <button type="submit" disabled={saving} className="btn btn-gold !py-3 !text-[0.65rem]">
                {saving ? 'Publishing...' : 'Publish to Firestore'}
              </button>
            </div>
            {editorError && <p className="mt-2 text-[0.72rem] text-danger">{editorError}</p>}
          </form>
        )}

        <div
          key={category}
          className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-12"
        >
          {visibleProjects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={idx}
              spanClass={getSpanClass(project)}
              onOpen={() => setActiveIdx(idx)}
            />
          ))}
          {category === 'All Work' && (
            <div
              className="relative flex h-[330px] flex-col justify-between overflow-hidden rounded-2xl border border-gold/25 bg-[linear-gradient(150deg,rgba(214,182,139,0.14),rgba(155,131,245,0.1))] p-5 sm:h-[360px] lg:col-span-4 lg:h-[380px]"
              style={{ animation: 'fade-up .65s cubic-bezier(.2,.7,.2,1) 480ms both' }}
            >
              <div
                className="dot-grid pointer-events-none absolute inset-0 text-gold/30 opacity-30"
                aria-hidden="true"
              />
              <div className="relative flex items-start justify-between">
                <span className="grid size-10 place-items-center rounded-xl border border-gold/30 bg-bg/20 text-gold">
                  <Icon name="plus" className="size-4" />
                </span>
                <span className="font-mono text-[0.52rem] uppercase tracking-[0.16em] text-muted">
                  Next
                </span>
              </div>
              <div className="relative">
                <p className="font-mono text-[0.52rem] uppercase tracking-[0.18em] text-gold">
                  Your project
                </p>
                <p className="mt-2 font-display text-[1.7rem] italic leading-[1.05] text-ink">
                  This space is waiting for your brand.
                </p>
                <ActionBtn
                  href="#contact"
                  variant="gold"
                  className="mt-5 !px-5 !py-3 !text-[0.62rem]"
                >
                  Start a project
                </ActionBtn>
              </div>
            </div>
          )}
        </div>

        <Reveal
          delay={80}
          className="mt-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
        >
          <p className="max-w-xl text-[0.8rem] leading-relaxed text-muted">
            Real client work and full case studies are available on request. New pieces are added as
            projects are published.
          </p>
          <FiverrBtn label="See my Fiverr profile" />
        </Reveal>
      </div>

      {activeIdx !== null && visibleProjects[activeIdx] && (
        <ProjectLightbox
          project={visibleProjects[activeIdx]}
          position={activeIdx + 1}
          total={visibleProjects.length}
          onClose={closeModal}
          onPrev={prevModal}
          onNext={nextModal}
        />
      )}
    </section>
  );
}

export const BLUEPRINT_LIMITS = {
  id: { minLength: 1, maxLength: 128, pattern: /^[a-zA-Z0-9_-]+$/ },
  projectId: { minLength: 1, maxLength: 64, pattern: /^[a-zA-Z0-9_-]+$/ },
  user: {
    displayName: { minLength: 1, maxLength: 100 },
    email: { minLength: 5, maxLength: 150, pattern: /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/ },
    photoURL: { maxLength: 500 },
  },
  project: {
    title: { minLength: 2, maxLength: 100 },
    subtitle: { minLength: 2, maxLength: 120 },
    year: { minLength: 4, maxLength: 4, pattern: /^[0-9]{4}$/ },
    image: { minLength: 1, maxLength: 300, pattern: /^(\/assets\/|https:\/\/).+/ },
    blurb: { minLength: 5, maxLength: 260 },
    description: { minLength: 10, maxLength: 1200 },
    arrayMaxItems: 10,
    arrayItemMaxLength: 80,
    categories: [
      'Logo & Branding',
      'Graphic Design',
      'Social Media Design',
      'Posters & Flyers',
      'Book Cover Design',
      'Photo Editing',
      'AI Video Creation',
      'Digital Projects',
    ] as const,
    spans: ['normal', 'wide'] as const,
  },
  brief: {
    name: { minLength: 2, maxLength: 100 },
    email: { minLength: 5, maxLength: 150, pattern: /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/ },
    service: { minLength: 2, maxLength: 120 },
    budgets: ["Let's discuss", 'Under $50', '$50 – $150', '$150 – $500', '$500+'] as const,
    message: { minLength: 20, maxLength: 2000 },
    statuses: ['submitted', 'reviewing', 'accepted', 'archived'] as const,
    terminalStatuses: ['accepted', 'archived'] as const,
  },
} as const;

export const ADMIN_EMAIL = 'fawmysahadh90@gmail.com';

export type ProjectCategory = (typeof BLUEPRINT_LIMITS.project.categories)[number];
export type ProjectSpan = (typeof BLUEPRINT_LIMITS.project.spans)[number];
export type BriefBudget = (typeof BLUEPRINT_LIMITS.brief.budgets)[number];
export type BriefStatus = (typeof BLUEPRINT_LIMITS.brief.statuses)[number];

export interface PortfolioProject {
  id: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  year: string;
  image: string;
  blurb: string;
  description: string;
  deliverables: string[];
  tools: string[];
  span: ProjectSpan;
  sortOrder?: number;
  published?: boolean;
  ownerUid?: string;
}

export interface ProjectBriefRecord {
  id: string;
  authorUid: string;
  name: string;
  email: string;
  service: string;
  budget: BriefBudget;
  message: string;
  status: BriefStatus;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface UserProfileRecord {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'client' | 'admin';
  createdAt?: unknown;
  updatedAt?: unknown;
}

export function clampString(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

export function validateBriefField(
  field: 'name' | 'email' | 'service' | 'message',
  value: string,
): string | undefined {
  const v = value.trim();
  if (field === 'name') {
    if (v.length < BLUEPRINT_LIMITS.brief.name.minLength) {
      return 'Please tell me your name (at least 2 characters).';
    }
    if (v.length > BLUEPRINT_LIMITS.brief.name.maxLength) {
      return `Please keep your name under ${BLUEPRINT_LIMITS.brief.name.maxLength} characters.`;
    }
  }
  if (field === 'email') {
    if (!v) return 'An email address is needed so I can reply.';
    if (
      v.length > BLUEPRINT_LIMITS.brief.email.maxLength ||
      !BLUEPRINT_LIMITS.brief.email.pattern.test(v)
    ) {
      return "That email address doesn't look right.";
    }
  }
  if (field === 'service') {
    if (!v) return "Choose the service you're interested in.";
    if (v.length > BLUEPRINT_LIMITS.brief.service.maxLength) {
      return `Service name must be under ${BLUEPRINT_LIMITS.brief.service.maxLength} characters.`;
    }
  }
  if (field === 'message') {
    if (v.length < BLUEPRINT_LIMITS.brief.message.minLength) {
      return 'A few more details please — at least 20 characters.';
    }
    if (v.length > BLUEPRINT_LIMITS.brief.message.maxLength) {
      return 'Please keep the brief under 2,000 characters.';
    }
  }
  return undefined;
}

export function sanitizeBriefPayload(input: {
  authorUid: string;
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
}) {
  const budget = (BLUEPRINT_LIMITS.brief.budgets as readonly string[]).includes(input.budget)
    ? (input.budget as BriefBudget)
    : "Let's discuss";
  return {
    authorUid: clampString(input.authorUid, BLUEPRINT_LIMITS.id.maxLength),
    name: clampString(input.name, BLUEPRINT_LIMITS.brief.name.maxLength),
    email: clampString(input.email, BLUEPRINT_LIMITS.brief.email.maxLength),
    service: clampString(input.service, BLUEPRINT_LIMITS.brief.service.maxLength),
    budget,
    message: clampString(input.message, BLUEPRINT_LIMITS.brief.message.maxLength),
    status: 'submitted' as BriefStatus,
  };
}

export function sanitizeProjectPayload(
  input: Omit<PortfolioProject, 'ownerUid'> & { ownerUid: string },
) {
  const sanitizeList = (arr: string[]) =>
    arr
      .map((item) => clampString(item, BLUEPRINT_LIMITS.project.arrayItemMaxLength))
      .filter(Boolean)
      .slice(0, BLUEPRINT_LIMITS.project.arrayMaxItems);

  const deliverables = sanitizeList(input.deliverables);
  const tools = sanitizeList(input.tools);

  return {
    id: clampString(input.id, BLUEPRINT_LIMITS.projectId.maxLength),
    title: clampString(input.title, BLUEPRINT_LIMITS.project.title.maxLength),
    subtitle: clampString(input.subtitle, BLUEPRINT_LIMITS.project.subtitle.maxLength),
    category: input.category,
    year: clampString(input.year, BLUEPRINT_LIMITS.project.year.maxLength),
    image: clampString(input.image, BLUEPRINT_LIMITS.project.image.maxLength),
    blurb: clampString(input.blurb, BLUEPRINT_LIMITS.project.blurb.maxLength),
    description: clampString(input.description, BLUEPRINT_LIMITS.project.description.maxLength),
    deliverables: deliverables.length > 0 ? deliverables : ['Visual study'],
    tools: tools.length > 0 ? tools : ['Adobe Illustrator'],
    span: input.span === 'wide' ? ('wide' as const) : ('normal' as const),
    sortOrder: typeof input.sortOrder === 'number' ? Math.max(0, Math.min(1000, input.sortOrder)) : 0,
    published: input.published !== false,
    ownerUid: clampString(input.ownerUid, BLUEPRINT_LIMITS.id.maxLength),
  };
}

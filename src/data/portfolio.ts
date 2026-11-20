import { PortfolioProject } from '../lib/validation';

export const FIVERR_URL = 'https://www.fiverr.com/s/odWm2Lb';

export const HERO_STUDY_IMAGE = '/assets/portfolio/hero-study.jpg';

export const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export const SERVICES = [
  {
    id: 'logo',
    title: 'Logo Design & Branding',
    description:
      'Distinctive marks and cohesive identity systems — logos, monograms, colour, type and usage guidance built to feel unmistakably yours.',
    icon: 'mark',
    tags: ['Identity', 'Logo suite'],
  },
  {
    id: 'card',
    title: 'Business Card Design',
    description:
      'Print-ready cards with considered hierarchy, premium finishes and a layout that makes a first impression on paper.',
    icon: 'card',
    tags: ['Print', 'Stationery'],
  },
  {
    id: 'poster',
    title: 'Poster & Flyer Design',
    description:
      'Bold promotional layouts that balance energy with clarity — from event flyers to large-format campaign posters.',
    icon: 'poster',
    tags: ['Campaign', 'Print'],
  },
  {
    id: 'banner',
    title: 'Banner & Advertisement Design',
    description:
      'Digital and print advertising that earns attention without shouting — crafted for feeds, billboards and storefronts.',
    icon: 'banner',
    tags: ['Ads', 'Digital'],
  },
  {
    id: 'social',
    title: 'Social Media Graphics',
    description:
      'A consistent visual voice for your channels — post templates, story sets and content systems ready to publish.',
    icon: 'grid',
    tags: ['Content', 'Templates'],
  },
  {
    id: 'thumbnail',
    title: 'YouTube Thumbnail Design',
    description:
      'Scroll-stopping thumbnails built around a clear focal message, readable type and strong contrast at small sizes.',
    icon: 'play',
    tags: ['Creator', 'Digital'],
  },
  {
    id: 'book',
    title: 'Arabic, English & Tamil Book Covers',
    description:
      'Cover artwork and typographic layouts that respect language, script and culture while standing out on the shelf.',
    icon: 'book',
    tags: ['Multilingual', 'Print'],
  },
  {
    id: 'photo',
    title: 'Professional Photo Editing',
    description:
      'Retouching, colour grading and clean-up that keeps the subject real while making the image feel finished.',
    icon: 'image',
    tags: ['Retouch', 'Colour'],
  },
  {
    id: 'ai-video',
    title: 'AI Video Creation',
    description:
      'Short-form visual content using AI-assisted motion and image tools, art-directed and edited to fit your brand.',
    icon: 'film',
    tags: ['Motion', 'AI-assisted'],
  },
  {
    id: 'document',
    title: 'Arabic Typing & Document Formatting',
    description:
      'Accurate bilingual typing, clean document structure and professional formatting for reports, books and proposals.',
    icon: 'document',
    tags: ['Arabic', 'Layout'],
  },
  {
    id: 'cv',
    title: 'CV & Resume Design',
    description:
      'Clearly structured, ATS-friendly résumés that present your experience with confidence and quiet polish.',
    icon: 'cv',
    tags: ['Editorial', 'Career'],
  },
  {
    id: 'web',
    title: 'Basic HTML & CSS Websites',
    description:
      'Lightweight, responsive one-page sites for portfolios and small businesses — hand-coded and easy to maintain.',
    icon: 'code',
    tags: ['Front-end', 'Responsive'],
  },
];

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  tags: string[];
  image?: string;
  imageAlt?: string;
  items?: string[];
}

export const ADDITIONAL_SERVICES: ServiceItem[] = [
  {
    id: 'data-entry',
    title: 'Data Entry Services',
    description:
      'Accurate, well-structured data handling and document processing tailored for busy teams, growing businesses, and organized digital operations.',
    icon: 'spreadsheet',
    image: '/assets/portfolio/service-data-entry.jpg',
    imageAlt:
      'Clean laptop workstation showing a structured spreadsheet for Excel and Google Sheets data entry services',
    items: [
      'Excel and Google Sheets data entry',
      'PDF to Excel/Word conversion',
      'Copy-paste tasks',
      'Database updates',
      'Customer information management',
      'Data verification',
      'Document typing',
      'Data organization',
    ],
    tags: ['Excel & Sheets', 'Data Accuracy'],
  },
  {
    id: 'bookkeeping',
    title: 'Bookkeeping Services',
    description:
      'Consistent day-to-day financial record keeping to keep your transactions categorized, invoices organized, and monthly summaries audit-ready.',
    icon: 'ledger',
    image: '/assets/portfolio/service-bookkeeping.jpg',
    imageAlt:
      'Financial summary chart, structured ledger table, and calculator for bookkeeping services',
    items: [
      'Income and expense recording',
      'Sales and purchase records',
      'Invoice and receipt management',
      'Transaction categorization',
      'Accounts payable and receivable tracking',
      'Basic financial record maintenance',
      'Bank reconciliation assistance',
      'Monthly financial summaries',
    ],
    tags: ['Ledger & AR/AP', 'Monthly Reports'],
  },
];

export const PROJECT_CATEGORIES = [
  'All Work',
  'Logo & Branding',
  'Graphic Design',
  'Social Media Design',
  'Posters & Flyers',
  'Book Cover Design',
  'Photo Editing',
  'AI Video Creation',
  'Digital Projects',
];

export const INITIAL_PROJECTS: PortfolioProject[] = [
  {
    id: 'aurelian',
    title: 'Aurelian Monogram',
    subtitle: 'Identity system concept',
    category: 'Logo & Branding',
    year: '2025',
    image: '/assets/portfolio/work-aurelian.jpg',
    blurb: 'A quiet, confident identity study in black, warm gold and structured space.',
    description:
      'A self-initiated identity concept exploring how a single monogram can carry a premium brand. The study pairs blind-embossed marks on matte black stock with restrained gold foil and a compact stationery system.',
    deliverables: ['Monogram marks', 'Business card system', 'Stationery layout'],
    tools: ['Adobe Illustrator', 'Adobe Photoshop'],
    span: 'wide',
    sortOrder: 0,
    published: true,
  },
  {
    id: 'editorial',
    title: 'Editorial No. 01',
    subtitle: 'Magazine layout study',
    category: 'Graphic Design',
    year: '2025',
    image: '/assets/portfolio/work-editorial.jpg',
    blurb: 'An editorial spread that lets typography, grid and whitespace do the talking.',
    description:
      'A layout study built around a strict baseline grid, oversized serif headlines and generous margins. The exercise focuses on rhythm across a spread, image cropping and a single metallic accent that guides the eye.',
    deliverables: ['Spread layout', 'Type hierarchy', 'Grid system'],
    tools: ['Adobe Illustrator', 'Adobe Photoshop'],
    span: 'normal',
    sortOrder: 1,
    published: true,
  },
  {
    id: 'lavender',
    title: 'Lavender Grid',
    subtitle: 'Social feed system',
    category: 'Social Media Design',
    year: '2025',
    image: '/assets/portfolio/work-lavender.jpg',
    blurb: 'A repeatable social system with a soft violet voice and hard editorial edges.',
    description:
      'A concept content system for a modern lifestyle brand. Nine-post templates balance bold geometric shapes with quiet typography, keeping the feed recognisable while allowing each post to stand alone.',
    deliverables: ['Feed templates', 'Story set', 'Colour system'],
    tools: ['Adobe Illustrator', 'Adobe Photoshop'],
    span: 'normal',
    sortOrder: 2,
    published: true,
  },
  {
    id: 'night-bloom',
    title: 'Night Bloom',
    subtitle: 'Poster series concept',
    category: 'Posters & Flyers',
    year: '2024',
    image: '/assets/portfolio/work-night-bloom.jpg',
    blurb: 'Three posters, one visual argument — pattern, restraint and light.',
    description:
      'A poster triptych concept built on layered geometric line work and a restrained lavender, cream and black palette. The series explores how a single motif can shift meaning purely through scale and crop.',
    deliverables: ['Poster triptych', 'A2 print artwork', 'Motif library'],
    tools: ['Adobe Illustrator', 'Adobe Photoshop'],
    span: 'normal',
    sortOrder: 3,
    published: true,
  },
  {
    id: 'three-tongues',
    title: 'Three Tongues',
    subtitle: 'Multilingual cover study',
    category: 'Book Cover Design',
    year: '2024',
    image: '/assets/portfolio/work-three-tongues.jpg',
    blurb: 'A cover concept designed to feel at home in Arabic, English and Tamil.',
    description:
      'A conceptual cover series examining how one visual language can hold three scripts. Geometric gold pattern work sits alongside considered typographic space so each language edition keeps its own voice.',
    deliverables: ['Cover series', 'Spine & back layout', 'Print-ready artwork'],
    tools: ['Adobe Illustrator', 'Adobe Photoshop'],
    span: 'normal',
    sortOrder: 4,
    published: true,
  },
  {
    id: 'dune-signal',
    title: 'Dune Signal',
    subtitle: 'AI film frame concept',
    category: 'AI Video Creation',
    year: '2025',
    image: '/assets/portfolio/work-dune-signal.jpg',
    blurb: 'A cinematic mood frame, art-directed from first prompt to final grade.',
    description:
      'An AI-assisted visual study for a short film treatment. Multiple generated frames were graded, composited and curated into a single cinematic direction — proof that the tool needs a designer behind it.',
    deliverables: ['Mood frames', 'Colour grade', 'Treatment stills'],
    tools: ['AI image tooling', 'Adobe Photoshop'],
    span: 'wide',
    sortOrder: 5,
    published: true,
  },
  {
    id: 'studio-retouch',
    title: 'Studio Portrait',
    subtitle: 'Retouch & colour study',
    category: 'Photo Editing',
    year: '2025',
    image: '/assets/portfolio/work-studio-retouch.jpg',
    blurb: 'Skin kept honest, light shaped carefully, colour graded with intent.',
    description:
      'A retouching demonstration focused on natural texture, skin-tone accuracy and cinematic colour. The grade leans into deep charcoal shadows with lavender rim light while keeping the subject believable.',
    deliverables: ['Retouched portrait', 'Colour grade', 'High-res export'],
    tools: ['Adobe Photoshop'],
    span: 'normal',
    sortOrder: 6,
    published: true,
  },
  {
    id: 'quiet-interface',
    title: 'Quiet Interface',
    subtitle: 'Portfolio UI study',
    category: 'Digital Projects',
    year: '2025',
    image: '/assets/portfolio/work-quiet-interface.jpg',
    blurb: 'A typography-led web layout made with real HTML and CSS, not a template.',
    description:
      'A self-initiated interface concept for a creative portfolio: a strict grid, oversized serif display type, thin rules and a restrained accent palette. Coded by hand as a responsive one-page layout.',
    deliverables: ['Responsive layout', 'Design system', 'HTML & CSS build'],
    tools: ['HTML', 'CSS'],
    span: 'normal',
    sortOrder: 7,
    published: true,
  },
  {
    id: 'thumbnail-lab',
    title: 'Thumbnail Lab',
    subtitle: 'YouTube thumbnail concept',
    category: 'Graphic Design',
    year: '2024',
    image: '/assets/portfolio/work-thumbnail-lab.jpg',
    blurb: 'Small-canvas design where contrast, face and focal point must win.',
    description:
      'A thumbnail direction study testing legibility at 320 pixels wide. The concept uses a single strong focal shape, a warm gold highlight and uncluttered typography space so the message survives any feed.',
    deliverables: ['Thumbnail set', 'A/B variants', 'Export sizes'],
    tools: ['Adobe Photoshop', 'Adobe Illustrator'],
    span: 'normal',
    sortOrder: 8,
    published: true,
  },
];

export const CAPABILITY_GROUPS = [
  {
    id: 'design',
    label: 'Design & brand',
    items: [
      'Graphic Design',
      'Logo & Brand Identity',
      'Social Media Design',
      'Typography & Layout',
      'Poster & Print Design',
    ],
  },
  {
    id: 'tools',
    label: 'Tools & production',
    items: [
      'Adobe Photoshop',
      'Adobe Illustrator',
      'Photo Editing & Retouching',
      'AI Video Creation',
      'Document Formatting',
      'HTML & CSS',
    ],
  },
  {
    id: 'language',
    label: 'Multilingual',
    items: ['Arabic Typography', 'English Typography', 'Tamil Typography'],
  },
];

export const HERO_STATS = [
  { value: '3.5+', label: 'Years of practice' },
  { value: '12', label: 'Design services' },
  { value: '03', label: 'Working languages' },
  { value: '∞', label: 'Ideas in progress' },
];

export const WHY_REASONS = [
  {
    n: '01',
    title: 'Creative and original',
    body: 'Every layout starts from your brief, not a downloaded template. You get a direction that belongs to your brand.',
    icon: 'spark',
  },
  {
    n: '02',
    title: 'Attention to detail',
    body: 'Alignment, spacing, type, export settings. The invisible details are what make work feel expensive.',
    icon: 'grid',
  },
  {
    n: '03',
    title: 'Professional communication',
    body: 'Clear updates, straightforward questions and plain-language feedback at each stage of the project.',
    icon: 'chat',
  },
  {
    n: '04',
    title: 'On-time delivery',
    body: 'Agreed milestones are treated as commitments. Files arrive when promised, organised and ready to use.',
    icon: 'clock',
  },
  {
    n: '05',
    title: 'Client satisfaction focus',
    body: 'Work continues until the design is right — refined revisions included within the agreed scope.',
    icon: 'shield',
  },
  {
    n: '06',
    title: 'Multilingual capability',
    body: 'Arabic, English and Tamil layout experience means your message stays intact across scripts and markets.',
    icon: 'globe',
  },
  {
    n: '07',
    title: 'Accessible freelance rates',
    body: 'Independent pricing without agency overhead — premium standards, sensible budgets, no surprises.',
    icon: 'tag',
  },
];

export const PROCESS_STEPS = [
  {
    n: '01',
    title: 'Discover',
    body: 'We talk about your brand, audience and the outcome you need. I ask the questions that shape the brief.',
  },
  {
    n: '02',
    title: 'Direct',
    body: 'You receive a clear visual direction — references, type, colour and the reasoning behind each choice.',
  },
  {
    n: '03',
    title: 'Design',
    body: 'The direction becomes real artwork. Revisions are focused and reviewed against the original brief.',
  },
  {
    n: '04',
    title: 'Deliver',
    body: 'Final files are organised, correctly sized and handed over ready for print, web or social.',
  },
];

export const DIRECT_CHANNELS = [
  {
    label: 'Fiverr',
    value: 'Order or message directly',
    note: 'Preferred channel',
    href: FIVERR_URL,
    icon: 'fiverr',
  },
  {
    label: 'Email',
    value: 'Shared on request',
    note: 'Available through Fiverr',
    href: FIVERR_URL,
    icon: 'mail',
  },
  {
    label: 'WhatsApp',
    value: 'Number shared on request',
    note: 'Available through Fiverr',
    href: FIVERR_URL,
    icon: 'phone',
  },
];

export const SOCIAL_PROFILES = [
  { label: 'Behance', handle: 'Coming soon' },
  { label: 'Dribbble', handle: 'Coming soon' },
  { label: 'Instagram', handle: 'Coming soon' },
  { label: 'LinkedIn', handle: 'Coming soon' },
];

export const MARQUEE_ITEMS = [
  'Brand Identity',
  'Logo Design',
  'Editorial Layout',
  'Social Media',
  'Poster Design',
  'Book Covers',
  'Photo Retouching',
  'AI Video',
  'Arabic Typography',
  'HTML & CSS',
];

export const LANGUAGES = [
  { glyph: 'Aa', label: 'English', note: 'Latin typography', lang: 'en' },
  { glyph: 'أ', label: 'العربية', note: 'Arabic typography', lang: 'ar' },
  { glyph: 'அ', label: 'தமிழ்', note: 'Tamil typography', lang: 'ta' },
];

export const TOOLKIT = [
  { name: 'Adobe Photoshop', short: 'Ps', area: 'Retouch · Composite' },
  { name: 'Adobe Illustrator', short: 'Ai', area: 'Vector · Identity' },
  { name: 'HTML & CSS', short: '</>', area: 'Responsive layouts' },
  { name: 'AI video tools', short: 'AI', area: 'Frames · Motion' },
  { name: 'Office documents', short: 'Doc', area: 'Arabic · Formatting' },
];

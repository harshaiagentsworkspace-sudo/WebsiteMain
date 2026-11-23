/* ===========================================================================
   OSTENDIC — CONTENT SCHEMA
   One description of every editable content file. It is used three ways:
   - the build validates content/*.json against it before generating pages;
   - the admin API validates every save against it (a bad edit is refused);
   - the admin panel (/admin) draws its forms from it.
   This module is plain ES with no Node imports, so the browser loads it
   directly (/build/schema.mjs).
   =========================================================================== */

/* ---------- field helpers ---------- */
const text = (label, max, o = {}) => ({ t: 'text', label, max, ...o });
const area = (label, max, o = {}) => ({ t: 'area', label, max, ...o });
const rich = (label, max, o = {}) => ({ t: 'rich', label, max, ...o });
const lines = (label, o = {}) => ({ t: 'lines', label, min: 1, max: 20, itemMax: 400, ...o });
const paras = (label, o = {}) => ({ t: 'paras', label, min: 1, max: 20, itemMax: 2000, ...o });
const bool = (label, o = {}) => ({ t: 'bool', label, ...o });
const url = (label, o = {}) => ({ t: 'url', label, max: 500, ...o });
const image = (label, o = {}) => ({ t: 'image', label, max: 300, ...o });
const obj = (label, fields, o = {}) => ({ t: 'obj', label, fields, ...o });
const list = (label, of, o = {}) => ({ t: 'list', label, of, min: 0, max: 50, ...o });
const select = (label, options, o = {}) => ({ t: 'select', label, options, ...o });
const multi = (label, options, o = {}) => ({ t: 'multi', label, options, ...o });
const opt = { optional: true };

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/* Service pages, in menu order. Renaming a slug changes a public URL: add a
   permanent redirect from the old path (vercel.json) when you do. */
export const SERVICE_SLUGS = ['ai-automation', 'ai-agent-development', 'workflow-automation', 'ai-consulting', 'web-development'];
export const SERVICE_NAMES = {
  'ai-automation': 'AI Automation',
  'ai-agent-development': 'Custom AI Agent Development',
  'workflow-automation': 'Workflow Automation',
  'ai-consulting': 'AI Consulting & Integration',
  'web-development': 'Website Development',
};
/* example workflow diagrams drawn in build/workflows.mjs (keep in step) */
export const WORKFLOW_IDS = ['ai-call', 'lead-follow-up', 'order-to-invoice', 'weekly-report'];
export const WORKFLOW_NAMES = {
  'ai-call': 'AI call on every enquiry',
  'lead-follow-up': 'Lead follow-up emails',
  'order-to-invoice': 'Order to invoice',
  'weekly-report': 'Weekly AI report',
};
/* stock photos in media/stock/ that cards can show (sizes and crops: build/mockups.mjs) */
export const STOCK_PHOTOS = ['home-local', 'home-growing', 'home-services', 'home-international',
  'automation-hero', 'automation-today', 'automation-after', 'agents-hero', 'agents-today', 'agents-after',
  'workflow-hero', 'workflow-today', 'workflow-after', 'consulting-hero', 'consulting-today', 'consulting-after',
  'web-hero', 'web-today', 'web-after', 'about-problem', 'about-cost', 'about-running', 'about-loop', 'about-clinic', 'about-food'];
/* product mockups drawn in build/mockups.mjs (keep in step) */
export const MOCK_IDS = ['inbox-messy', 'inbox-handled', 'lead-card', 'email-draft', 'invoice-extract', 'tool-chain',
  'report-message', 'quote-tool', 'call-screen', 'chat-booking', 'missed-calls', 'task-checklist', 'agent-handoff',
  'approval-card', 'knowledge-answer', 'order-chain', 'enquiry-timeline', 'sheet-manual', 'sheet-synced', 'process-map', 'enquiry-routing',
  'form-to-doc', 'ai-plan', 'idea-cloud', 'roadmap', 'readiness-check', 'process-audit', 'impact-matrix',
  'tool-compare', 'risk-list', 'team-guide', 'site-desktop', 'site-old', 'site-phone', 'site-form', 'landing-page',
  'shop-product', 'cms-edit', 'web-app', 'search-result'];
/* card icons (workflow-ring-v2/<name>.svg), chosen per card in the admin */
export const CARD_ICONS = ['step-1-enquiry', 'step-2-agent', 'step-3-approve', 'step-4-reminder',
  'ai-01-agents', 'ai-02-multi-agent', 'ai-03-leads', 'ai-04-sales-marketing', 'ai-05-support', 'ai-06-automation', 'ai-07-integrations', 'ai-08-internal-systems',
  'service-01-website', 'service-02-ui-ux', 'service-03-landing-page', 'service-04-ecommerce', 'service-05-cms', 'service-06-custom-app', 'service-07-responsive', 'service-08-redesign',
  'principle-1-problem', 'principle-2-cost', 'principle-3-keep-running', 'principle-4-people',
  'stat-1-projects', 'stat-2-clients', 'stat-3-rating'];
export const ROUTES = ['/', '/services', ...SERVICE_SLUGS.map(s => `/services/${s}`),
  '/work', '/about', '/blog', '/contact', '/book', '/privacy', '/terms'];

const seoEntry = (route) => obj(route, {
  title: text('Page title (browser tab and Google)', 70, { hint: 'Aim for 30–60 characters.' }),
  description: area('Meta description', 200, { hint: 'Aim for 70–160 characters. Shown under the title in Google.' }),
  ogTitle: text('Social title', 100, { ...opt, hint: 'Title shown when the page is shared (LinkedIn, WhatsApp, Facebook). Empty = the page title.' }),
  ogDescription: area('Social description', 200, { ...opt, hint: 'Empty = the meta description.' }),
  twitterTitle: text('X / Twitter title', 100, { ...opt, hint: 'Empty = the social title.' }),
  twitterDescription: area('X / Twitter description', 200, { ...opt, hint: 'Empty = the social description.' }),
  ogImage: image('Social share image', { ...opt, hint: 'Shown when the page is shared on LinkedIn, WhatsApp, X. 1200×630 works best. Empty = the site default.' }),
  noindex: bool('Hide this page from search engines'),
});

const titled = (label, o = {}) => list(label, obj('Item', {
  title: text('Title', 80), text: area('Text', 400),
}), { itemTitle: 'title', ...o });

const iconCards = (label, o = {}) => list(label, obj('Card', {
  title: text('Title', 80), text: area('Text', 400), icon: select('Icon', CARD_ICONS),
  ...(o.photos ? { photo: select('Photo', ['', ...STOCK_PHOTOS], { ...opt, labels: { '': 'No photo' }, hint: 'A real photo shown at the top of the card (media/stock/).' }) } : {}),
}), { itemTitle: 'title', ...o });
const faqList = (label, o = {}) => list(label, obj('Question', { q: text('Question', 200), a: area('Answer', 1200) }), { max: 12, itemTitle: 'q', ...o });

const servicePage = (name) => obj(name, {
  title: text('Service name', 80),
  heading: text('Page heading (H1)', 120, { ...opt, hint: 'The main heading at the top of the page. Empty = the service name.' }),
  short: text('Short name', 40, { hint: 'Used where space is tight.' }),
  summary: area('Summary', 300, { hint: 'Lead paragraph on the service page, the About page and /services.' }),
  who: area('Who it helps', 400),
  problem: area('The problem', 400),
  build: lines('What we build (tags)', { max: 12, itemMax: 80 }),
  includes: lines('What an engagement includes (steps)', { min: 2, max: 6, itemMax: 200 }),
  servicesHeading: text('Cards heading', 100, { ...opt, hint: 'Empty = “What we build”.' }),
  services: titled('Cards', { min: 3, max: 8, hint: 'Three to eight cards.' }),
  principles: titled('“What we hold to”', { min: 1, max: 6 }),
  details: list('Detail sections', obj('Section', {
    heading: text('Heading', 120),
    paragraphs: paras('Paragraphs', { max: 4, itemMax: 900 }),
    points: lines('Bullet points', { ...opt, min: 0, max: 10, itemMax: 240 }),
  }), { max: 8, itemTitle: 'heading', hint: 'Longer explanations shown as their own sections, each with its own heading.' }),
  faq: faqList('Frequently asked questions'),
  visual: obj('Visual page (replaces the cards, steps and principles above on the page)', {
    lead: area('Hero line (one sentence)', 160),
    before: obj('Before', { title: text('Title', 40), points: lines('Points', { min: 2, max: 3, itemMax: 60 }), mock: select('Mockup', MOCK_IDS) }),
    after: obj('After', { title: text('Title', 40), points: lines('Points', { min: 2, max: 3, itemMax: 60 }), mock: select('Mockup', MOCK_IDS) }),
    cardsHeading: text('Cards heading', 80),
    cards: list('Cards', obj('Card', { title: text('Title', 60), text: area('Text (one short line)', 110), mock: select('Mockup', MOCK_IDS) }), { min: 3, max: 8, itemTitle: 'title' }),
    workflow: obj('Example workflow', { id: select('Diagram', WORKFLOW_IDS, { labels: WORKFLOW_NAMES }), title: text('Heading', 90), done: text('Status when the run finishes', 90) }, { optional: true }),
    steps: list('How it works', obj('Step', { title: text('Title', 40), text: text('Text', 90) }), { min: 3, max: 5, itemTitle: 'title' }),
    promises: list('What we hold to', obj('Promise', { title: text('Title', 40), text: text('Text', 90) }), { min: 2, max: 4, itemTitle: 'title' }),
  }, { optional: true }),
  example: obj('Worked example', {
    title: text('Example title', 100),
    ring: lines('Short steps (home page ring)', { min: 2, max: 6, itemMax: 60 }),
    steps: lines('Full steps', { min: 2, max: 8, itemMax: 300 }),
  }, { optional: true }),
});

/* ---------- the files ---------- */
export const SCHEMAS = {
  settings: obj('Site settings', {
    identity: obj('Business identity', {
      name: text('Business name', 60),
      url: url('Site address', { hint: 'Used for canonical links, the sitemap and structured data.' }),
      email: text('Contact email', 120, { format: 'email' }),
      principal: text('Founder name', 80),
      principalRole: text('Founder role', 60),
      principalImage: image('Founder photo'),
      sub: area('Short description (default meta description)', 200),
      tagline: text('Tagline', 80, opt),
      footer: area('Footer line', 200),
    }),
    contact: obj('Contact channels', {
      phoneDisplay: text('Phone (as shown)', 40, { ...opt, hint: 'e.g. +91 98765 43210. Empty = no call buttons.' }),
      phoneTel: text('Phone (dial string)', 20, { ...opt, format: 'tel', hint: 'Digits with +, e.g. +919876543210.' }),
      whatsapp: text('WhatsApp number', 20, { ...opt, format: 'digits', hint: 'International, digits only, e.g. 919876543210. Empty = no WhatsApp buttons.' }),
      booking: url('Booking link (Calendly or Cal.com)', { ...opt, hint: 'Empty = no /book page; buttons go to /contact.' }),
      social: list('Social profiles', obj('Profile', { label: text('Name', 30), url: url('Profile URL') }), { max: 10, itemTitle: 'label' }),
    }),
    seo: obj('Search & sharing', {
      titleSuffix: text('Title suffix', 40, { ...opt, hint: 'Added after page titles that don’t set their own, e.g. “ | Ostendic”.' }),
      defaultOgImage: image('Default social share image', { ...opt, hint: '1200×630. Used when a page or post has none.' }),
      twitterHandle: text('X / Twitter handle', 30, { ...opt, hint: 'e.g. @ostendic' }),
      googleVerification: text('Google Search Console verification code', 120, { ...opt, hint: 'Only the content="…" value of the meta tag.' }),
      bingVerification: text('Bing Webmaster verification code', 120, opt),
      ga4: text('Google Analytics 4 measurement ID', 20, { ...opt, format: 'ga4', hint: 'e.g. G-XXXXXXXXXX. Empty = no analytics script.' }),
    }),
    form: obj('Enquiry form', {
      interests: lines('“What do you need?” options', { min: 2, max: 12, itemMax: 80 }),
      budgets: lines('Budget options', { min: 2, max: 10, itemMax: 60 }),
    }),
    stats: obj('Stats bar (home and About)', {
      placeholder: bool('These numbers are placeholders', { hint: 'While on, a production build refuses to run. Turn off only with verified figures.' }),
      items: list('Stats', obj('Stat', { value: text('Value', 20), label: text('Label', 40) }), { min: 1, max: 3, fixed: true, itemTitle: 'label' }),
    }),
    footerCta: obj('Footer invitation', {
      heading: text('Heading', 80),
      text: area('Text', 240, { hint: '{name} is replaced with the founder’s first name.' }),
      button: text('Button label', 50, { hint: 'Goes to the contact form.' }),
    }),
  }),

  home: obj('Home page', {
    hero: obj('Hero (top of the page)', {
      eyebrow: text('Eyebrow (small line above the headline)', 90, opt),
      headline: lines('Headline', { max: 3, itemMax: 80, hint: 'One line per row (up to 3). Put {curly braces} around words to set them in italics.' }),
      intro: area('Intro paragraph', 400),
      primaryButton: text('First button label', 50, { hint: 'Goes to the AI Automation service page.' }),
      secondaryButton: text('Second button label', 40, { hint: 'Goes to the enquiry form.' }),
    }),
    problems: obj('Business problems', {
      heading: text('Heading', 100), intro: area('Intro', 300, opt),
      items: iconCards('Problems', { min: 3, max: 8, photos: true }),
    }),
    solutions: obj('AI automation solutions', {
      heading: text('Heading', 100), intro: area('Intro', 300, opt),
      items: list('Solutions', obj('Solution', { title: text('Title', 80), text: area('Text', 400), icon: select('Icon', CARD_ICONS), service: select('Related service', SERVICE_SLUGS, { labels: SERVICE_NAMES }) }), { min: 2, max: 8, itemTitle: 'title' }),
    }),
    showcase: obj('Automations in action (example workflows)', {
      heading: text('Heading', 100), intro: area('Intro', 300, opt),
      workflows: list('Workflows (one tab each)', obj('Workflow', {
        id: select('Diagram', WORKFLOW_IDS, { labels: WORKFLOW_NAMES, hint: 'The drawing itself is built in code (build/workflows.mjs).' }),
        tab: text('Tab label', 40), title: text('Title', 90), summary: area('Summary', 320),
        done: text('Status when the example run finishes', 90),
        steps: list('Steps', obj('Step', { title: text('Title', 60), text: area('Text', 260) }), { min: 2, max: 5, itemTitle: 'title' }),
      }), { min: 1, max: 3, unique: 'id', itemTitle: 'tab' }),
      note: area('Note under the workflows', 240, { hint: 'Say plainly that these are examples, not client work.' }),
    }),
    services: obj('Core services', {
      heading: text('Section heading', 80),
      panels: obj('Panels', Object.fromEntries(SERVICE_SLUGS.map(s => [s, obj(`${SERVICE_NAMES[s]} panel`, {
        title: text('Panel heading', 80, { ...opt, hint: 'Empty = the service name.' }),
        summary: area('Summary', 240), who: area('Who it helps', 240), problem: area('The problem', 240),
        build: area('What we build', 300), includes: lines('A project can include', { max: 8, itemMax: 120 }),
      })]))),
    }),
    web: obj('Website development (secondary service)', {
      heading: text('Heading', 100),
      intro: area('Intro', 400),
      points: lines('What it covers', { min: 2, max: 8, itemMax: 120 }),
      button: text('Button label', 50, { hint: 'Goes to the Website Development page.' }),
    }),
    audiences: obj('Who we help', {
      heading: text('Heading', 100),
      items: iconCards('Groups', { min: 2, max: 6, photos: true }),
    }),
    process: obj('How a project runs', {
      heading: text('Section heading', 80),
      steps: list('Steps', obj('Step', { title: text('Title', 60), text: area('Text', 200) }), { min: 2, max: 6, itemTitle: 'title' }),
      note: area('Note under the steps', 400, { ...opt, hint: 'e.g. how data, approvals and human oversight are handled.' }),
    }),
    why: obj('Why Ostendic', {
      heading: text('Heading', 100), intro: area('Intro', 300, opt),
      items: iconCards('Reasons', { min: 3, max: 6 }),
    }),
    faq: obj('Frequently asked questions', {
      heading: text('Heading', 100),
      items: faqList('Questions', { min: 1 }),
    }),
  }),

  services: obj('Services', Object.fromEntries(SERVICE_SLUGS.map(s => [s, servicePage(SERVICE_NAMES[s])]))),

  pages: obj('Pages', {
    seo: obj('Search listing per page', Object.fromEntries(ROUTES.map(r => [r, seoEntry(r)]))),
    services: obj('/services', { label: text('Label', 40), heading: text('Heading', 120), lead: area('Lead', 300) }),
    work: obj('/work', {
      label: text('Label', 40), heading: text('Heading', 120),
      selectedHeading: text('Home page “Selected work” heading', 120),
      noteTitle: text('Note title', 80), noteText: area('Note text', 400),
    }),
    about: obj('/about', {
      heading: text('Hero heading', 120), lead: area('Lead', 300), body: paras('Hero paragraphs', { max: 4, itemMax: 600 }),
      approachLabel: text('Principles label', 40), approachHeading: text('Principles heading', 120),
      approach: titled('Principles', { min: 4, max: 4, fixed: true, hint: 'Four, one per icon.' }),
      servicesLabel: text('Services label', 40), servicesHeading: text('Services heading', 120),
      clients: obj('“The businesses we build for” photos', {
        label: text('Label', 40), heading: text('Heading', 120), note: text('Note under the photos', 160, opt),
        items: list('Photos', obj('Photo', { label: text('Caption', 40), photo: select('Photo', STOCK_PHOTOS) }), { min: 3, max: 6, itemTitle: 'label' }),
      }, { optional: true }),
    }),
    contact: obj('/contact', { heading: text('Heading', 120) }),
    book: obj('/book', { heading: text('Heading', 120), lead: area('Lead', 300) }),
    blog: obj('/blog', { heading: text('Heading', 120) }),
    legal: obj('Privacy and Terms', {
      updated: text('“Last updated” line', 80),
      privacy: paras('Privacy paragraphs', { rich: true, max: 30, itemMax: 2000, hint: 'Bold, italic and links are kept.' }),
      terms: paras('Terms paragraphs', { rich: true, max: 30, itemMax: 2000 }),
    }),
  }),

  work: obj('Work', {
    projects: list('Projects', obj('Project', {
      name: text('Name', 60),
      slug: text('Anchor name', 60, { format: 'slug', hint: 'Used in /work#anchor links.' }),
      kind: select('Label', ['client', 'demo', 'sample'], { labels: { client: 'Client project', demo: 'Demo build', sample: 'Sample' } }),
      publish: bool('Show on the site'),
      url: url('Live link'),
      linkLabel: text('Link button text', 40),
      area: text('Sector / type', 80),
      pillars: multi('Services it relates to', SERVICE_SLUGS, { labels: SERVICE_NAMES }),
      scope: lines('Scope tags', { ...opt, min: 0, max: 10, itemMax: 60 }),
      what: area('What it is', 300),
      problem: area('The problem', 400),
      built: area('What was built', 500),
      contribution: area('Ostendic’s part', 300),
      caution: area('Internal caution note (not shown)', 500, opt),
      images: obj('Screenshots', { desktop: image('Desktop screenshot', opt), phone: image('Phone screenshot', opt) }, { optional: true }),
      heroImage: obj('Faded background image', { src: image('Image'), w: { t: 'number', label: 'Width', min: 1, max: 10000 }, h: { t: 'number', label: 'Height', min: 1, max: 10000 } }, { optional: true }),
      mark: obj('Logo tile (service pages)', { logo: image('Logo'), w: { t: 'number', label: 'Width', min: 1, max: 10000 }, h: { t: 'number', label: 'Height', min: 1, max: 10000 }, bg: { t: 'color', label: 'Tile colour' } }, { optional: true }),
      brand: obj('Brand plate (client projects)', {
        logo: image('Logo'), w: { t: 'number', label: 'Width', min: 1, max: 10000 }, h: { t: 'number', label: 'Height', min: 1, max: 10000 },
        colours: list('Frame colours', obj('Colour', { name: text('Name', 40), hex: { t: 'color', label: 'Colour' } }), { min: 0, max: 2, itemTitle: 'name' }),
        verticals: list('Verticals', obj('Vertical', { name: text('Name', 60), text: text('Description', 80) }), { min: 0, max: 4, itemTitle: 'name' }),
      }, { optional: true }),
    }), { min: 0, max: 30, unique: 'slug', itemTitle: 'name' }),
  }),

  media: obj('Media library', {
    items: { t: 'dict', label: 'Media', of: obj('File', { alt: text('Alt text', 250, opt), title: text('Title', 120, opt), w: { t: 'number', label: 'Width', min: 0, max: 20000, optional: true }, h: { t: 'number', label: 'Height', min: 0, max: 20000, optional: true } }) },
  }),

  redirects: obj('Redirects', {
    redirects: list('Redirects', obj('Redirect', {
      source: text('From path', 200, { format: 'path', hint: 'e.g. /old-page or /blog/:slug' }),
      destination: text('To', 300, { format: 'dest' }),
      permanent: bool('Permanent (301/308)', { hint: 'Off = temporary (307). Use permanent only when the move is final.' }),
    }), { max: 200, itemTitle: 'source', unique: 'source' }),
  }),
};

/* ---------- blog: fields around the article body ---------- */
export const POST_FIELDS = obj('Post', {
  title: text('Title', 140),
  slug: text('URL handle', 80, { format: 'slug' }),
  category: text('Category', 40),
  tags: lines('Tags', { min: 0, max: 15, itemMax: 40, optional: true }),
  excerpt: area('Excerpt', 300),
  draft: bool('Hidden (draft)'),
  publishedAt: text('Publish date', 10, { format: 'date' }),
  updatedAt: text('Last updated', 10, { ...opt, format: 'date' }),
  author: text('Author', 80),
  toc: bool('Show a table of contents'),
  featuredImage: obj('Featured image', { src: image('Image', opt), alt: text('Alt text', 250, opt) }),
  faq: list('FAQ', obj('Question', { q: text('Question', 200), a: area('Answer', 1200) }), { max: 20, itemTitle: 'q' }),
  seo: obj('Search engine listing', {
    title: text('Page title', 70, opt),
    description: area('Meta description', 170, opt),
    focusKeyword: text('Focus keyword', 80, opt),
    canonical: url('Canonical URL', opt),
    noindex: bool('Hide from search engines'),
    ogTitle: text('Social title', 100, opt),
    ogDescription: area('Social description', 200, opt),
    ogImage: image('Social image', opt),
  }),
});
export const BLOCK_TYPES = ['p', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'quote', 'img', 'hr', 'code', 'embed', 'button'];

/* ---------- inline HTML sanitiser ----------
   Rich fields keep a small set of inline tags. Everything else is dropped
   (its text kept); <script>/<style> are dropped with their content; links
   keep only a safe href. The build runs this on every render, so nothing
   unsafe reaches a page even if the JSON is edited by hand. */
const INLINE = { strong: 'strong', b: 'strong', em: 'em', i: 'em', a: 'a', code: 'code', br: 'br', s: 's', del: 's', strike: 's', sup: 'sup', sub: 'sub', u: 'u', mark: 'mark' };
const decodeEnt = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (m, e) => {
  const l = e.toLowerCase();
  if (l[0] === '#') { const c = l[1] === 'x' ? parseInt(l.slice(2), 16) : parseInt(l.slice(1), 10); return c > 0 && c < 0x110000 ? String.fromCodePoint(c) : ''; }
  return { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }[l];
});
const escText = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => escText(s).replace(/"/g, '&quot;');

export const safeHref = (raw) => {
  const h = decodeEnt(String(raw || '')).trim().replace(/[\u0000-\u001f\s]+/g, (m) => m.includes(' ') ? '%20' : '');
  if (!h) return '';
  if (/^(https?:\/\/|mailto:|tel:)/i.test(h)) return h;
  if (/^[/#?]/.test(h) && !h.startsWith('//')) return h;
  return '';
};

export const sanitizeInline = (html) => {
  const src = String(html || '');
  let out = '';
  const stack = [];
  const re = /<!--[\s\S]*?-->|<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>|<|[^<]+/g;
  let m, skip = null;
  while ((m = re.exec(src))) {
    const tok = m[0];
    if (skip) { if (m[1] && tok[1] === '/' && m[1].toLowerCase() === skip) skip = null; continue; }
    if (tok.startsWith('<!--')) continue;
    if (tok === '<') { out += '&lt;'; continue; }
    if (!m[1]) { out += escText(decodeEnt(tok)); continue; }
    const name = m[1].toLowerCase();
    if (name === 'script' || name === 'style' || name === 'template' || name === 'iframe') { if (tok[1] !== '/') skip = name; continue; }
    const tag = INLINE[name];
    if (!tag) { if (name === 'p' || name === 'div') { /* block inside inline: soft break */ if (tok[1] === '/' && out && !out.endsWith('<br>')) out += ' '; } continue; }
    if (tag === 'br') { out += '<br>'; continue; }
    if (tok[1] === '/') {
      let i = stack.length - 1;
      while (i >= 0 && stack[i] !== tag && !(tag === 'a' && stack[i] === '__skip')) i--;
      if (i === -1) continue;
      while (stack.length > i) { const t = stack.pop(); if (t !== '__skip') out += `</${t}>`; }
      continue;
    }
    if (tag === 'a') {
      const hm = m[2].match(/href\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const href = safeHref(hm ? (hm[2] ?? hm[3] ?? hm[4]) : '');
      if (!href) { stack.push('__skip'); continue; }
      const ext = /^https?:\/\//i.test(href);
      const nf = /rel\s*=\s*["'][^"']*nofollow/i.test(m[2]);
      out += `<a href="${escAttr(href)}"${ext ? ` target="_blank" rel="noopener${nf ? ' nofollow' : ''}"` : ''}>`;
      stack.push('a');
      continue;
    }
    out += `<${tag}>`; stack.push(tag);
  }
  while (stack.length) { const t = stack.pop(); if (t !== '__skip') out += `</${t}>`; }
  return out.replace(/<(strong|em|code|s|sup|sub|u|mark)><\/\1>/g, '').trim();
};
export const stripTags = (html) => decodeEnt(String(html || '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();

/* ---------- validation ---------- */
const FORMATS = {
  email: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'must be an email address'],
  tel: [/^\+?[0-9]{6,16}$/, 'must be digits, optionally starting with +'],
  digits: [/^[0-9]{6,16}$/, 'must be digits only'],
  slug: [SLUG_RE, 'may only use lowercase letters, numbers and single hyphens'],
  date: [/^\d{4}-\d{2}-\d{2}$/, 'must be a date (YYYY-MM-DD)'],
  ga4: [/^G-[A-Z0-9]{4,16}$/, 'must look like G-XXXXXXXXXX'],
  path: [/^\/[^\s]*$/, 'must start with /'],
  dest: [/^(\/[^\s]*|https?:\/\/[^\s]+)$/, 'must start with / or https://'],
};

const isStr = (v) => typeof v === 'string';
const join = (a, b) => (a ? `${a} › ${b}` : b);

export function check(s, v, label, errors) {
  const empty = v === undefined || v === null || v === '';
  if (s.t === 'obj') {
    if (empty && s.optional) return;
    if (!v || typeof v !== 'object' || Array.isArray(v)) { errors.push(`${label} is missing`); return; }
    for (const [k, f] of Object.entries(s.fields)) check(f, v[k], join(label, f.label || k), errors);
    return;
  }
  if (s.t === 'dict') {
    if (!v || typeof v !== 'object' || Array.isArray(v)) { errors.push(`${label} is missing`); return; }
    for (const [k, item] of Object.entries(v)) check(s.of, item, join(label, k), errors);
    return;
  }
  if (s.t === 'list') {
    if (empty && s.optional) return;
    if (!Array.isArray(v)) { errors.push(`${label} must be a list`); return; }
    if (v.length < (s.min || 0)) errors.push(`${label} needs at least ${s.min} item${s.min === 1 ? '' : 's'}`);
    if (v.length > s.max) errors.push(`${label} has too many items (max ${s.max})`);
    const seen = new Set();
    v.forEach((item, i) => {
      const name = s.itemTitle && item && isStr(item[s.itemTitle]) && item[s.itemTitle].trim() ? `"${item[s.itemTitle].trim().slice(0, 40)}"` : `${i + 1}`;
      check(s.of, item, `${label} ${name}`, errors);
      if (s.unique && item) {
        const key = item[s.unique];
        if (seen.has(key)) errors.push(`${label} ${name}: another item already uses "${key}"`);
        seen.add(key);
      }
    });
    return;
  }
  if (s.t === 'lines' || s.t === 'paras') {
    if (empty && s.optional) return;
    if (!Array.isArray(v)) { errors.push(`${label} must be a list`); return; }
    if (v.length < s.min) errors.push(`${label} needs at least ${s.min} item${s.min === 1 ? '' : 's'}`);
    if (v.length > s.max) errors.push(`${label} has too many items (max ${s.max})`);
    v.forEach((item, i) => {
      if (!isStr(item)) errors.push(`${label} item ${i + 1} must be text`);
      else if (!item.trim()) errors.push(`${label} item ${i + 1} is empty`);
      else if ((s.rich ? stripTags(item) : item).length > s.itemMax) errors.push(`${label} item ${i + 1} is too long (max ${s.itemMax})`);
    });
    return;
  }
  if (s.t === 'bool') { if (typeof v !== 'boolean') errors.push(`${label} must be on or off`); return; }
  if (s.t === 'number') {
    if (empty && s.optional) return;
    if (typeof v !== 'number' || !Number.isFinite(v)) errors.push(`${label} must be a number`);
    else if (v < s.min || v > s.max) errors.push(`${label} must be between ${s.min} and ${s.max}`);
    return;
  }
  if (s.t === 'select') { if (empty && s.optional) return; if (!s.options.includes(v)) errors.push(`${label} must be one of: ${s.options.join(', ')}`); return; }
  if (s.t === 'multi') {
    if (!Array.isArray(v) || v.some(x => !s.options.includes(x))) errors.push(`${label} has an unknown choice`);
    return;
  }
  if (s.t === 'color') { if (!isStr(v) || !/^#[0-9a-fA-F]{6}$/.test(v)) errors.push(`${label} must be a colour like #1B4D3E`); return; }
  // text-like
  if (v === undefined && s.optional) return;
  if (!isStr(v)) { errors.push(`${label} must be text`); return; }
  const n = (s.t === 'rich' ? stripTags(v) : v).trim().length;
  if (!n) { if (!s.optional) errors.push(`${label} is empty`); return; }
  if (n > s.max) errors.push(`${label} is too long (${n} characters, max ${s.max})`);
  if (s.format && FORMATS[s.format] && !FORMATS[s.format][0].test(v.trim())) errors.push(`${label} ${FORMATS[s.format][1]}`);
  if (s.t === 'url' && !/^(https?:\/\/|\/)/.test(v.trim())) errors.push(`${label} must start with https:// or /`);
  if (s.t === 'image' && !/^(\/?[A-Za-z0-9._\- /()%]+\.(png|jpe?g|webp|avif|gif|svg)|https:\/\/\S+)$/i.test(v.trim())) errors.push(`${label} must be an image file`);
}

function validateBlocks(blocks, at, errors) {
  if (!Array.isArray(blocks)) { errors.push(`${at}: article must be a list of blocks`); return; }
  if (!blocks.length) errors.push(`${at}: the article is empty`);
  if (blocks.length > 600) errors.push(`${at}: the article has too many blocks`);
  blocks.forEach((b, i) => {
    const w = `${at}: block ${i + 1}`;
    if (!b || !BLOCK_TYPES.includes(b.type)) { errors.push(`${w} has an unknown type`); return; }
    const str = (k, max, req = true) => {
      if (b[k] === undefined && !req) return;
      if (!isStr(b[k])) errors.push(`${w}: ${k} must be text`);
      else if (req && !stripTags(b[k]).trim() && k !== 'alt') errors.push(`${w} (${b.type}) is empty`);
      else if (b[k].length > max) errors.push(`${w}: ${k} is too long`);
    };
    switch (b.type) {
      case 'p': case 'h1': case 'h2': case 'h3': case 'h4': str('html', 8000); break;
      case 'quote': str('html', 4000); str('cite', 200, false); break;
      case 'ul': case 'ol':
        if (!Array.isArray(b.items) || !b.items.length) errors.push(`${w}: a list needs items`);
        else b.items.forEach((it) => { if (!isStr(it) || it.length > 4000) errors.push(`${w}: a list item is not valid`); });
        break;
      case 'img':
        str('src', 500); str('alt', 250, false); str('caption', 400, false);
        if (b.href !== undefined && b.href !== '' && !safeHref(b.href)) errors.push(`${w}: the image link is not a valid address`);
        break;
      case 'code': if (!isStr(b.text) || b.text.length > 20000) errors.push(`${w}: code is not valid`); break;
      case 'embed': if (!isStr(b.url) || !embedInfo(b.url)) errors.push(`${w}: only YouTube and Vimeo links can be embedded`); break;
      case 'button': str('label', 60); if (!safeHref(b.href)) errors.push(`${w}: the button needs a valid link`); break;
    }
  });
}

/* YouTube / Vimeo url -> { provider, id, src } (null if not embeddable) */
export const embedInfo = (u) => {
  const s = String(u || '').trim();
  let m = s.match(/^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,15})/);
  if (m) return { provider: 'youtube', id: m[1], src: `https://www.youtube-nocookie.com/embed/${m[1]}` };
  m = s.match(/^https?:\/\/(?:www\.|player\.)?vimeo\.com\/(?:video\/)?(\d{5,12})/);
  if (m) return { provider: 'vimeo', id: m[1], src: `https://player.vimeo.com/video/${m[1]}` };
  return null;
};

export function validateBlog(d) {
  const errors = [];
  if (!d || typeof d !== 'object') return ['Blog content is missing'];
  if (typeof d.indexable !== 'boolean') errors.push('"Show the blog to search engines" must be on or off');
  if (!Array.isArray(d.posts)) return [...errors, 'Posts must be a list'];
  const seen = new Set();
  d.posts.forEach((p, i) => {
    const at = `Post ${i + 1}${p && isStr(p.title) && p.title.trim() ? ` ("${p.title.trim().slice(0, 40)}")` : ''}`;
    if (!p || typeof p !== 'object') { errors.push(`${at} is not a post`); return; }
    check(POST_FIELDS, p, at, errors);
    if (isStr(p.slug)) { if (seen.has(p.slug)) errors.push(`${at}: another post already uses the URL handle "${p.slug}"`); seen.add(p.slug); }
    validateBlocks(p.body, at, errors);
  });
  return errors;
}

export const CONTENT_NAMES = ['settings', 'home', 'services', 'pages', 'work', 'blog', 'media', 'redirects'];

export function validate(name, data) {
  if (name === 'blog') return validateBlog(data);
  if (!SCHEMAS[name]) return [`Unknown content "${name}"`];
  const errors = [];
  check(SCHEMAS[name], data, '', errors);
  return errors.map(e => e.replace(/^ › /, ''));
}

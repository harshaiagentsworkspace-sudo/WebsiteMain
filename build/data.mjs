/* ===========================================================================
   OSTENDIC — CONTENT DATA
   Every page reads its content from here. The content itself lives in
   content/*.json, which the admin panel (/admin) edits; this module loads
   those files (validated against build/schema.mjs) and shapes them for the
   page templates.

   Rules:
   - Real Ostendic facts only. No invented client names, results, numbers,
     testimonials or contact details.
   - A missing fact is empty. Components that depend on it render nothing
     until it is filled in, and `build.mjs` prints a PENDING list on every
     build so the gaps stay visible.

   Positioning: a digital studio with two service areas —
     01  Web Development and UI/UX Design
     02  Agentic AI Workflows
   =========================================================================== */
import { loadContent } from './content.mjs';

const settings = loadContent('settings');
const home = loadContent('home');
const services = loadContent('services');
export const pagesCopy = loadContent('pages');
const work = loadContent('work');
export const media = loadContent('media');

const I = settings.identity, C = settings.contact;

export const site = {
  ...I,
  /* booking: env var wins (set in Vercel), then the admin setting */
  booking: globalThis.process.env.NEXT_PUBLIC_CALENDLY_URL || C.booking || null,
  /* Web3Forms access key: a public key by design (it can only send to the
     inbox it was created for). */
  formKey: globalThis.process.env.WEB3FORMS_ACCESS_KEY || 'c9c76618-084b-43ff-b3bb-be8aa2de655a',
  phone: C.phoneDisplay && C.phoneTel ? { display: C.phoneDisplay, tel: C.phoneTel } : null,
  whatsapp: C.whatsapp || null,
  social: C.social.map(s => [s.label, s.url]),
  seo: settings.seo,
  footerCta: settings.footerCta,

  /* Brand mark. The supplied artwork is a black wordmark on a wide white
     canvas; `ink` is the wordmark's bounding box inside it. The header and
     footer crop to `ink` in CSS so the file itself is never edited. */
  logo: {
    src: 'assets/ostendic-logo.jpg',
    nav: 'assets/ostendic-logo.png',
    w: 1746, h: 901,
    ink: { x: 284, y: 322, w: 1183, h: 239 },
  },
};

/* Derived contact helpers — every CTA goes through these, so a CTA can never
   point at an empty or invented destination. */
const bookingHost = site.booking ? new URL(site.booking).hostname.replace(/^www\./, '') : '';
export const bookingProvider = bookingHost === 'calendly.com' ? 'calendly'
  : (bookingHost === 'cal.com' || bookingHost === 'app.cal.com') ? 'cal'
  : null;
if (site.booking && !bookingProvider) throw new Error(`The booking link must be a calendly.com or cal.com URL: ${site.booking}`);

export const links = {
  whatsapp: site.whatsapp ? `https://wa.me/${site.whatsapp}` : null,
  tel: site.phone ? `tel:${site.phone.tel}` : null,
  start: site.booking ? '/book' : '/contact',
  startLabel: site.booking ? 'Book a quick call' : 'Start a conversation',
};

/* ---------- HOME PAGE ---------- */
export const heroCopy = {
  lines: home.hero.headline,
  lead: home.hero.intro,
  secondaryButton: home.hero.secondaryButton,
};
export const homeCopy = {
  servicesHeading: home.services.heading,
  about: { heading: home.about.heading, headingItalic: home.about.headingItalic },
};

/* ---------- SERVICES ----------
   Exactly two service areas, fixed slugs and order. */
const tuples = (arr) => arr.map(x => [x.title, x.text]);
export const pillars = [['web-development', '01'], ['agentic-ai-workflows', '02']].map(([slug, n]) => {
  const s = services[slug];
  return {
    slug, n, path: `/services/${slug}`,
    title: s.title, short: s.short, summary: s.summary, who: s.who, problem: s.problem,
    build: s.build, includes: s.includes,
    services: tuples(s.services), principles: tuples(s.principles),
    ...(s.example ? { example: s.example } : {}),
    /* short copy for the panels on the homepage and /services */
    panel: { ...home.services.panels[slug] },
  };
});

/* ---------- PROCESS ----------
   /services keeps the full process; the homepage uses the editable one. */
export const process = [
  ['01', 'Conversation', 'You tell us what you need and what isn’t working today. If we’re not the right fit, we’ll say so.',
    'An honest view of whether, and how, we can help'],
  ['02', 'Written scope and price', 'What will be built, what isn’t included, the price and when payments are due, all in writing. Work starts once you’ve agreed to it.',
    'A scope and price you can hold us to'],
  ['03', 'Design and build', 'We share work in progress at agreed review points, so you can comment before anything is final.',
    'Review points before anything is final'],
  ['04', 'Launch and handover', 'We test, launch and hand over everything you need to run what we built.',
    'Logins, access and notes for your team'],
];
export const processHome = {
  heading: home.process.heading,
  steps: home.process.steps.map((s, i) => [String(i + 1).padStart(2, '0'), s.title, s.text]),
};

/* About page principle icons, in order (workflow-ring-v2/) */
const APPROACH_ICONS = ['principle-1-problem.svg', 'principle-2-cost.svg', 'principle-3-keep-running.svg', 'principle-4-people.svg'];
const A = pagesCopy.about;
export const aboutCopy = {
  hero: { heading: A.heading, lead: A.lead, body: A.body },
  teaser: home.about.paragraphs,
  approach: A.approach.map((x, i) => [x.title, x.text, APPROACH_ICONS[i]]),
};

/* ---------- STATS ---------- */
const STAT_ICONS = ['stat-1-projects.svg', 'stat-2-clients.svg', 'stat-3-rating.svg'];
export const statsConfig = {
  placeholder: settings.stats.placeholder,
  items: settings.stats.items.map((s, i) => ({ ...s, icon: STAT_ICONS[i] })),
};

/* ---------- WORK ----------
   kind: 'client' | 'demo' | 'sample'. Only entries with `publish: true`
   appear, in file order. */
export const projects = work.projects.map(p => ({
  ...p,
  ...(p.brand ? { brand: {
    ...p.brand,
    colours: p.brand.colours && p.brand.colours.length >= 2 ? p.brand.colours.map(c => [c.name, c.hex]) : null,
    verticals: p.brand.verticals && p.brand.verticals.length ? p.brand.verticals.map(v => [v.name, v.text]) : null,
  } } : {}),
}));
export const published = projects.filter(p => p.publish);
export const kindLabel = { client: 'Client project', demo: 'Demo build', sample: 'Sample' };

/* ---------- ENQUIRY FORM ---------- */
export const budgets = settings.form.budgets;
export const interests = settings.form.interests;

/* ---------- NAV ---------- */
export const nav = [
  ['Services', '/services', pillars.map(p => [p.title, p.path])],
  ['Work', '/work'],
  ['About', '/about'],
  ['Blog', '/blog'],
  ['Contact', '/contact'],
];

/* ---------- PENDING: printed on every build ---------- */
export const pending = [
  !site.phone && 'Phone number (Admin › Settings): click-to-call is hidden until set.',
  !site.whatsapp && 'WhatsApp number (Admin › Settings): WhatsApp buttons are hidden until set.',
  !site.booking && 'Booking link (Admin › Settings): no /book page is generated until a Calendly/Cal.com URL is set.',
  !site.social.length && 'LinkedIn / Instagram URLs (Admin › Settings): no social links shown until set.',
  statsConfig.placeholder && 'Stats bar shows placeholder numbers (Admin › Settings › Stats).',
  ...projects.filter(p => p.publish && p.caution).map(p => `Work: ${p.name}. ${p.caution}`),
  !site.formKey && 'CONTACT FORM IS NOT DELIVERING: no Web3Forms access key (WEB3FORMS_ACCESS_KEY).',
].filter(Boolean);

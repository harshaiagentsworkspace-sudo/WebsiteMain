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

   Positioning (2026-11-23): an AI automation and AI integration company
   with a secondary website development offering. Five service pages
   (SERVICE_SLUGS in schema.mjs), in menu order:
     01  AI Automation                (flagship)
     02  Custom AI Agent Development
     03  Workflow Automation          (child of AI Automation in the menu)
     04  AI Consulting & Integration
     05  Website Development          (secondary)
   The homepage leads with AI: three core service chapters (01, 02, 04),
   then a smaller website section.
   =========================================================================== */
import { existsSync } from 'node:fs';
import { loadContent } from './content.mjs';
import { SERVICE_SLUGS } from './schema.mjs';

const settings = loadContent('settings');
const home = loadContent('home');
const services = loadContent('services');
export const pagesCopy = loadContent('pages');
const work = loadContent('work');
export const media = loadContent('media');

const I = settings.identity, C = settings.contact;

/* the founder photo at button/signature size, when a -192 copy exists
   next to the original (assets/harsh-dubey-192.jpg) */
const small = I.principalImage.replace(/(\.[a-z]+)$/i, '-192$1');
export const site = {
  ...I,
  avatar: existsSync(new URL(`../${small}`, import.meta.url)) ? small : I.principalImage,
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
    /* what the pages load: the same canvas at half size (the CSS crop works
       in ratios, so it renders identically at a fraction of the bytes).
       The full-size PNG stays the logo in structured data. */
    web: 'assets/ostendic-logo-nav.webp',
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
  eyebrow: home.hero.eyebrow || '',
  lines: home.hero.headline,
  lead: home.hero.intro,
  primaryButton: home.hero.primaryButton,
  secondaryButton: home.hero.secondaryButton,
};
export const homeCopy = {
  problems: home.problems,
  solutions: home.solutions,
  web: home.web,
  showcase: home.showcase,
  audiences: home.audiences,
  why: home.why,
  faq: home.faq,
  servicesHeading: home.services.heading,
};

/* ---------- SERVICES ----------
   Fixed slugs and order (SERVICE_SLUGS). */
const tuples = (arr) => arr.map(x => [x.title, x.text]);
export const pillars = SERVICE_SLUGS.map((slug, i) => {
  const s = services[slug];
  const panel = home.services.panels[slug];
  return {
    slug, n: String(i + 1).padStart(2, '0'), path: `/services/${slug}`,
    title: s.title, heading: s.heading || s.title, short: s.short, summary: s.summary, who: s.who, problem: s.problem,
    build: s.build, includes: s.includes,
    servicesHeading: s.servicesHeading || 'What we build',
    services: tuples(s.services), principles: tuples(s.principles),
    details: s.details || [], faq: s.faq || [],
    ...(s.example ? { example: s.example } : {}),
    ...(s.visual ? { visual: s.visual } : {}),
    /* short copy for the panels on the homepage and /services */
    panel: { ...panel, title: panel.title || s.title },
  };
});
export const pillar = Object.fromEntries(pillars.map(p => [p.slug, p]));

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
  note: home.process.note || '',
  steps: home.process.steps.map((s, i) => [String(i + 1).padStart(2, '0'), s.title, s.text]),
};

/* About page principle icons, in order (workflow-ring-v2/) */
const APPROACH_ICONS = ['principle-1-problem.svg', 'principle-2-cost.svg', 'principle-3-keep-running.svg', 'principle-4-people.svg'];
const A = pagesCopy.about;
export const aboutCopy = {
  hero: { heading: A.heading, lead: A.lead, body: A.body },
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
/* AI first, web development last. Workflow Automation sits under AI
   Automation. Every entry is a plain <a href>, so all are crawlable. Work
   and Blog are linked from the footer (Blog is placeholder posts for now). */
export const nav = [
  ['AI Automation', '/services/ai-automation', [['AI Automation', '/services/ai-automation'], ['Workflow Automation', '/services/workflow-automation']]],
  ['AI Agents', '/services/ai-agent-development'],
  ['AI Consulting', '/services/ai-consulting'],
  ['Web Development', '/services/web-development'],
  ['About', '/about'],
  ['Contact', '/contact'],
];

/* Enquiry-form option for each service page, so a service page's CTA
   (/contact?service=<slug>) arrives with the right choice selected, and
   analytics can tell AI enquiries from website enquiries. Matched on the
   option text, so options edited in the admin keep working. */
export const interestSlug = (label) => {
  const l = String(label).toLowerCase();
  return /agent/.test(l) ? 'ai-agent-development'
    : /consult|strategy|integration/.test(l) ? 'ai-consulting'
    : /web|site/.test(l) ? 'web-development'
    : /automat/.test(l) ? 'ai-automation'
    : '';
};

/* ---------- PENDING: printed on every build ---------- */
export const pending = [
  !site.phone && 'Phone number (Admin › Settings): click-to-call is hidden until set.',
  !site.whatsapp && 'WhatsApp number (Admin › Settings): WhatsApp buttons are hidden until set.',
  !site.booking && 'Booking link (Admin › Settings): no /book page is generated until a Calendly/Cal.com URL is set.',
  !site.social.length && 'LinkedIn / Instagram URLs (Admin › Settings): no social links shown until set.',
  statsConfig.placeholder && 'Stats bar is hidden: its numbers are marked as placeholders (Admin › Settings › Stats). Enter verified figures to show it.',
  ...projects.filter(p => p.publish && p.caution).map(p => `Work: ${p.name}. ${p.caution}`),
  !site.formKey && 'CONTACT FORM IS NOT DELIVERING: no Web3Forms access key (WEB3FORMS_ACCESS_KEY).',
].filter(Boolean);

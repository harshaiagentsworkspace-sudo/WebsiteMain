/* Static site generator — writes .html into the project root.
   Run: node build/build.mjs                                            */
import { writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { page } from './ui.mjs';
import { site, pillars, pending } from './data.mjs';
import * as P from './pages.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const written = [];
const add = (rel, html) => {
  const file = join(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html, 'utf8');
  written.push(rel);
};
const T = (t) => `${t} | ${site.name}`;

/* The hero poster is the first thing painted on the homepage; preloading it
   keeps the background from popping in after the text. */
const heroPreload = '<link rel="preload" as="image" href="/assets/hero-vortex-poster.jpg">\n';

add('index.html', page({
  title: `${site.name} | Websites, UI/UX design and agentic AI workflows`,
  desc: site.sub, current: '/', body: P.home(), preload: heroPreload,
}));
add('services.html', page({
  title: T('Services'),
  desc: 'Two services: web development and UI/UX design, and agentic AI workflows that coordinate tasks across your tools and reduce repetitive manual work.',
  current: '/services', body: P.servicesIndex(),
}));
const pillarMeta = {
  'web-development': 'Website design and development, UI/UX design, landing pages, e-commerce, Shopify and WordPress, custom web applications and redesigns from Ostendic.',
  'agentic-ai-workflows': 'AI agents and connected workflows for lead follow-up, customer support, sales and marketing, process automation and tool integrations, designed with people kept in control.',
};
for (const s of pillars) add(`services/${s.slug}.html`, page({
  title: T(s.title), desc: pillarMeta[s.slug], current: s.path, body: P.pillarPage(s),
}));
add('work.html', page({
  title: T('Work'), desc: 'Products Ostendic has designed and built, each labelled as a client project, demo build or sample.',
  current: '/work', body: P.work(),
}));
add('pricing.html', page({
  title: T('Pricing'), desc: 'How Ostendic prices websites, UI/UX design and AI workflow projects: a written price, scope and payment schedule before any work starts.',
  current: '/pricing', body: P.pricing(),
}));
add('about.html', page({
  title: T('About'), desc: `Ostendic is a small digital studio run by ${site.principal}, designing and building websites, web applications and AI workflows.`,
  current: '/about', body: P.about(),
}));
add('contact.html', page({
  title: T('Contact'), desc: 'Tell Ostendic about a website, UI/UX design or AI workflow project. Replies come from the founder directly.',
  current: '/contact', body: P.contact(), needsForm: true,
}));

/* booking: only with a real scheduler configured */
if (site.booking) {
  add('book.html', page({
    title: T('Book a quick call'), desc: `Book a quick call with ${site.principal} of Ostendic about a website, UI/UX design or an AI workflow. Pick a date and time that suits you.`,
    current: '/book', body: P.book(), needsBooking: true,
  }));
} else if (existsSync(join(ROOT, 'book.html'))) rmSync(join(ROOT, 'book.html'));

/* legal */
const para = (t) => `<p>${t}</p>`;
add('privacy.html', page({
  title: T('Privacy'), desc: 'How Ostendic handles the information you send us.', current: '/privacy',
  body: P.legal('Privacy', [
    para('We collect only what you send through the enquiry form on this site: your name, email address, and, if you choose to give them, your phone number, business name, budget range, the service you’re interested in and your project description.'),
    para('We use those details for one purpose: to reply to your enquiry and, if we work together, to scope and deliver the work. We don’t sell them, and we don’t add you to a marketing list.'),
    para('Enquiries are stored in our database for as long as we reasonably need them for an ongoing or possible engagement. Ask us to delete yours and we will.'),
    para(`For anything about your data, email <a class="alink" href="mailto:${site.email}">${site.email}</a>.`),
  ].join('')),
}));
add('terms.html', page({
  title: T('Terms'), desc: 'Terms of use for the Ostendic website.', current: '/terms',
  body: P.legal('Terms', [
    para('This site is provided for information. Content may change without notice, and nothing on it is an offer or a contract.'),
    para('Project work is governed by the written scope and agreement for that project. Where anything on this site conflicts with a signed agreement, the agreement takes precedence.'),
    para('Names and marks of other products shown on this site belong to their owners.'),
    para(`Questions: <a class="alink" href="mailto:${site.email}">${site.email}</a>.`),
  ].join('')),
}));

/* Retired pages. Insights had no published articles, Resources held one
   off-brand download and Careers described no real hiring process. Their
   generated HTML is removed; vercel.json redirects the old URLs. The
   underlying assets (e.g. the .docx) are kept in the repo. */
for (const gone of ['blog.html', 'careers.html', 'resources.html']) {
  const f = join(ROOT, gone);
  if (existsSync(f)) rmSync(f);
}

/* sitemap + robots */
const routes = ['/', '/services', ...pillars.map(s => s.path), '/work', '/pricing', '/about', '/contact', ...(site.booking ? ['/book'] : []), '/privacy', '/terms'];
add('sitemap.xml',
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(r => `  <url><loc>${site.url}${r === '/' ? '/' : r}</loc></url>`).join('\n')}
</urlset>`);
add('robots.txt', `User-agent: *\nAllow: /\nDisallow: /legacy/\nDisallow: /orbix-reference/\nDisallow: /form-studio/\n\nSitemap: ${site.url}/sitemap.xml\n`);

console.log(`Built ${written.length} files:`);
for (const w of written) console.log('  ' + w);
if (pending.length) {
  console.log(`\nPENDING (${pending.length}) — business details needed before these parts go live:`);
  for (const p of pending) console.log('  - ' + p);
}

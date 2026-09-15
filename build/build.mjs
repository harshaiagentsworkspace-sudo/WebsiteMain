/* Static site generator — writes .html into the project root.
   Run: node build/build.mjs                                            */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { page } from './ui.mjs';
import { site, services, projects } from './data.mjs';
import * as P from './pages.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = (rel, html) => {
  const file = join(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html, 'utf8');
  return rel;
};

const T = (t) => `${t} — ${site.name}`;
const written = [];
const add = (rel, html) => written.push(out(rel, html));

/* core pages */
add('index.html', page({
  title: `${site.name} — Digital studio for brand, web and automation`,
  desc: site.sub, current: '/', body: P.home(),
}));
add('about.html', page({
  title: T('About'), desc: `Ostendic is a principal-led digital studio led by ${site.principal}, working across brand, UI/UX, web and automation.`,
  current: '/about', body: P.about(),
}));
add('services.html', page({
  title: T('Services'), desc: 'Brand and UI/UX, web and e-commerce development, and the AI automation that runs behind them.',
  current: '/services', body: P.servicesIndex(),
}));
add('work.html', page({
  title: T('Work'), desc: 'Selected Ostendic projects. Client work labelled as client work, demo builds labelled as demos.',
  current: '/work', body: P.work(),
}));
add('pricing.html', page({
  title: T('Engagement & pricing'), desc: 'Fixed scope, fixed fee and a delivery date we commit to. Three ways to work with Ostendic.',
  current: '/pricing', body: P.pricing(),
}));
add('contact.html', page({
  title: T('Contact'), desc: 'Tell us what is not working. We reply within one business day with a scope and a price.',
  current: '/contact', body: P.contact(), needsForm: true,
}));
add('blog.html', page({
  title: T('Insights'), desc: 'Working notes on design, build and automation from the Ostendic studio.',
  current: '/blog', body: P.blog(),
}));
add('careers.html', page({
  title: T('Careers'), desc: 'Ostendic is principal-led and deliberately small. Collaborator briefs come up regularly.',
  current: '/careers', body: P.careers(),
}));
add('resources.html', page({
  title: T('Resources'), desc: 'Free frameworks and templates from the Ostendic studio.',
  current: '/resources', body: P.resourcesPage(),
}));

/* service detail pages */
for (const s of services) {
  add(`services/${s.slug}.html`, page({
    title: T(s.title),
    desc: s.lead.slice(0, 155),
    current: `/services/${s.slug}`,
    body: P.serviceDetail(s),
  }));
}

/* case detail pages */
for (const p of projects) {
  add(`work/${p.slug}.html`, page({
    title: T(p.name),
    desc: p.summary.slice(0, 155),
    current: `/work/${p.slug}`,
    body: P.caseDetail(p),
  }));
}

/* legal */
const para = (t) => `<p class="body-sm">${t}</p>`;
add('privacy.html', page({
  title: T('Privacy'), desc: 'How Ostendic handles the information you send us.', current: '/privacy',
  body: P.legal('Privacy', [
    para('We collect only what you send us through the enquiry form on this site: your name, email address, optional company name, budget range, service interest and project description.'),
    para('We use those details for one purpose — to reply to your enquiry and, if we work together, to scope and deliver the project. We do not sell them, and we do not add you to a marketing list without you asking.'),
    para('Enquiries are stored in our database and are retained for as long as we may reasonably need them for an ongoing or prospective engagement. Ask us to delete yours and we will.'),
    para(`For anything about your data, email <a class="alink" href="mailto:${site.email}">${site.email}</a>.`),
  ].join('')),
}));
add('terms.html', page({
  title: T('Terms'), desc: 'Terms of use for the Ostendic website.', current: '/terms',
  body: P.legal('Terms', [
    para('This site is provided for information. Content may change without notice, and nothing here is an offer or a contract.'),
    para('Project work is governed by the written scope and agreement signed for that engagement. Where anything on this page conflicts with a signed agreement, the agreement takes precedence.'),
    para('Work shown on this site remains the property of the respective client. Demo builds are our own and are labelled as demonstrations rather than client work.'),
    para(`Questions: <a class="alink" href="mailto:${site.email}">${site.email}</a>.`),
  ].join('')),
}));

/* favicon */
add('favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#111314"/><text x="16" y="23" font-family="Helvetica,Arial,sans-serif" font-size="20" font-weight="500" fill="#F4F4F2" text-anchor="middle">O</text></svg>`);

console.log(`Built ${written.length} files:`);
for (const w of written) console.log('  ' + w);

/* sitemap + robots */
const routes = ['/', '/about', '/services', '/work', '/pricing', '/contact', '/blog',
  '/careers', '/resources', '/privacy', '/terms',
  ...services.map(s => `/services/${s.slug}`), ...projects.map(p => `/work/${p.slug}`)];
add('sitemap.xml',
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(r => `  <url><loc>${site.url}${r}</loc><changefreq>monthly</changefreq></url>`).join('\n')}
</urlset>`);
add('robots.txt', `User-agent: *\nAllow: /\nDisallow: /legacy/\nDisallow: /orbix-reference/\n\nSitemap: ${site.url}/sitemap.xml\n`);

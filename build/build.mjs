/* Static site generator — writes .html into the project root.
   Run: node build/build.mjs                                            */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { page } from './ui.mjs';
import { site, pillars } from './data.mjs';
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
  title: `${site.name} — Web Development, UI/UX Design & Agentic AI Workflows`,
  desc: site.sub, current: '/', body: P.home(),
}));
add('services.html', page({
  title: T('Services: Web Development, UI/UX Design & AI Workflows'),
  desc: 'Two service pillars: website design and development with UI/UX design, and agentic AI workflows that connect your tools, coordinate tasks and reduce manual work.',
  current: '/services', body: P.servicesIndex(),
}));
const pillarMeta = {
  'web-development': {
    title: 'Web Development Agency & UI/UX Design',
    desc: 'Website design and development, UI/UX design, custom web development, web applications, e-commerce, WordPress and Shopify, and SaaS and MVP development from Ostendic.',
  },
  'agentic-ai-workflows': {
    title: 'Agentic AI Workflows & AI Agents for Business',
    desc: 'Ostendic designs agentic AI workflows, AI agents for business operations and AI workflow automation for lead follow-up, customer support, data processing and reporting.',
  },
};
for (const s of pillars) add(`services/${s.slug}.html`, page({
  title: T(pillarMeta[s.slug].title), desc: pillarMeta[s.slug].desc,
  current: s.path, body: P.pillarPage(s),
}));
add('work.html', page({
  title: T('Work'), desc: 'Selected Ostendic work across website development, e-commerce, UI/UX design and automation, including the VMS Careline project.',
  current: '/work', body: P.work(),
}));
add('pricing.html', page({
  title: T('Pricing'), desc: 'How Ostendic scopes and prices websites, UI/UX design and agentic AI workflow projects: a diagnostic, a scoped project, or ongoing monthly capacity.',
  current: '/pricing', body: P.pricing(),
}));
add('about.html', page({
  title: T('About'), desc: `Ostendic was founded by ${site.principal}. A digital studio bringing together brand, UI/UX design, web development and agentic AI workflows.`,
  current: '/about', body: P.about(),
}));
add('contact.html', page({
  title: T('Contact'), desc: 'Book a 30-minute call with Ostendic about a website, UI/UX design, an agentic AI workflow, or a combination.',
  current: '/contact', body: P.contact(), needsForm: true,
}));
add('blog.html', page({
  title: T('Insights'), desc: 'Working notes on web development, UI/UX design and agentic AI workflows from Ostendic.',
  current: '/blog', body: P.blog(),
}));
add('careers.html', page({
  title: T('Careers'), desc: 'Ostendic is founder-led and deliberately small. Collaborator briefs come up regularly.',
  current: '/careers', body: P.careers(),
}));
add('resources.html', page({
  title: T('Resources'), desc: 'Free frameworks and templates from Ostendic.',
  current: '/resources', body: P.resourcesPage(),
}));

/* legal */
const para = (t) => `<p class="body-sm">${t}</p>`;
add('privacy.html', page({
  title: T('Privacy'), desc: 'How Ostendic handles the information you send us.', current: '/privacy',
  body: P.legal('Privacy', [
    para('We collect only what you send us through the enquiry form on this site: your name, email address, optional company name, budget range, service interest and project description.'),
    para('We use those details for one purpose — to reply to your enquiry and, if we work together, to scope and deliver the engagement. We do not sell them, and we do not add you to a marketing list without you asking.'),
    para('Enquiries are stored in our database and are retained for as long as we may reasonably need them for an ongoing or prospective engagement. Ask us to delete yours and we will.'),
    para(`For anything about your data, email <a class="alink" href="mailto:${site.email}">${site.email}</a>.`),
  ].join('')),
}));
add('terms.html', page({
  title: T('Terms'), desc: 'Terms of use for the Ostendic website.', current: '/terms',
  body: P.legal('Terms', [
    para('This site is provided for information. Content may change without notice, and nothing here is an offer or a contract.'),
    para('Project work is governed by the written scope and agreement signed for that engagement. Where anything on this page conflicts with a signed agreement, the agreement takes precedence.'),
    para('Client names and marks shown on this site remain the property of their respective owners.'),
    para(`Questions: <a class="alink" href="mailto:${site.email}">${site.email}</a>.`),
  ].join('')),
}));

/* favicon — NOT generated. /favicon.svg is the supplied brand mark (the open
   "O" ring, squared up with its own white ground) and is checked in as a
   static asset. The placeholder letterform this build used to emit was
   removed when the real artwork arrived; do not re-add it, or a build will
   overwrite the real icon. The <link rel="icon"> in ui.mjs still points at
   /favicon.svg, so the path is unchanged. */

console.log(`Built ${written.length} files:`);
for (const w of written) console.log('  ' + w);

/* sitemap + robots */
const routes = ['/', '/services', ...pillars.map(s => s.path), '/work', '/pricing',
  '/about', '/contact', '/blog', '/careers', '/resources', '/privacy', '/terms'];
add('sitemap.xml',
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(r => `  <url><loc>${site.url}${r}</loc><changefreq>monthly</changefreq></url>`).join('\n')}
</urlset>`);
add('robots.txt', `User-agent: *\nAllow: /\nDisallow: /legacy/\nDisallow: /orbix-reference/\n\nSitemap: ${site.url}/sitemap.xml\n`);

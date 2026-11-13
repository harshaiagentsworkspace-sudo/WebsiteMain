/* ===========================================================================
   OSTENDIC — UI PRIMITIVES
   Every component returns an HTML string. One visual language, all pages.
   =========================================================================== */
import { readFileSync } from 'node:fs';
import { site, links, nav, pillars } from './data.mjs';

export const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ---------- icons (inline, no icon font) ---------- */
export const ico = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>',
  right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5 9 17.5 20 6.5"/></svg>',
  minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"/></svg>',
  caret: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4.5" width="18" height="16.5" rx="3"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.6" y="5" width="18.8" height="14" rx="3"/><path d="m3.4 7.4 7.5 5.3a2 2 0 0 0 2.2 0l7.5-5.3"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3.5h3.2l1.6 4.2-2.1 1.4a11.6 11.6 0 0 0 7.2 7.2l1.4-2.1 4.2 1.6V19a1.9 1.9 0 0 1-2 1.9A16.6 16.6 0 0 1 3.1 5.5 1.9 1.9 0 0 1 5 3.5Z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2.01a9.94 9.94 0 0 0-8.5 15.1L2 22.01l5.05-1.32a9.94 9.94 0 1 0 4.99-18.68Zm0 1.8a8.14 8.14 0 1 1-4.15 15.14l-.3-.18-3 .78.8-2.92-.2-.31A8.14 8.14 0 0 1 12.04 3.8Zm4.7 10.3c-.26-.13-1.5-.74-1.74-.82-.23-.09-.4-.13-.57.13s-.65.82-.8.99-.3.19-.55.06a6.6 6.6 0 0 1-1.96-1.21 7.3 7.3 0 0 1-1.35-1.68c-.14-.25 0-.38.11-.5.12-.12.26-.3.39-.45.12-.16.16-.26.25-.43a.47.47 0 0 0-.02-.45c-.06-.13-.56-1.36-.77-1.86-.2-.48-.41-.42-.56-.43h-.48a.93.93 0 0 0-.67.31 2.83 2.83 0 0 0-.88 2.1 4.9 4.9 0 0 0 1.03 2.6 11.2 11.2 0 0 0 4.3 3.8c.6.26 1.07.41 1.44.53.6.2 1.15.17 1.58.1.48-.07 1.5-.61 1.71-1.2.21-.6.21-1.1.15-1.21-.06-.11-.23-.18-.48-.3Z"/></svg>',
};

/* ---------- service icons ----------
   Source of truth: assets/Service icons/*.svg. The files are read at build
   time and their contents are inlined unchanged (same viewBox, paths,
   strokes and currentColor fills), so the icon takes its parent's text
   colour. Only the outer tag changes: width/height come from `size`, the
   file's role/aria-label are dropped and aria-hidden is set, because the
   service name sits right beside the icon. */
const svgFile = (dir) => (file) => {
  const src = readFileSync(new URL(file, new URL(dir, import.meta.url)), 'utf8').trim();
  const m = src.match(/^<svg\b([^>]*)>([\s\S]*)<\/svg>$/);
  if (!m) throw new Error(`Not a single <svg> element: ${file}`);
  const attrs = m[1]
    .replace(/\s(width|height|role|aria-label|aria-hidden|class)="[^"]*"/g, '')
    .replace(/\sxmlns="[^"]*"/, '');
  return ({ size = 44, className = '' } = {}) =>
    `<svg${attrs} width="${size}" height="${size}"${className ? ` class="${esc(className)}"` : ''} aria-hidden="true" focusable="false">${m[2]}</svg>`;
};
const serviceIcon = svgFile('../assets/Service icons/');
export const WebDevelopmentIcon = serviceIcon('web-development.svg');
export const AgenticWorkflowsIcon = serviceIcon('agentic-ai-workflows.svg');
/* About page principle icons (workflow-ring-v2/principle-*.svg) */
export const principleIcon = (file, opts) => svgFile('../workflow-ring-v2/')(file)(opts);
/* Stats bar icons (workflow-ring-v2/stat-*.svg), same inlining */
export const statIcon = principleIcon;

const ext = (href) => /^https?:/.test(href) ? ' target="_blank" rel="noopener"' : '';

/* Button. `opts.avatar` puts the founder's portrait in the badge slot, so
   the main "talk to us" CTA carries a face rather than a glyph. */
export const btn = (label, href, kind = 'primary', opts = {}) => {
  const badge = opts.avatar
    ? `<span class="btn__ava face"><img src="/${site.principalImage}" alt="" width="96" height="96" decoding="async"${opts.eager ? '' : ' loading="lazy"'}></span>`
    : opts.icon
      ? `<span class="btn__ico">${ico[opts.icon]}</span>`
      : `<span class="btn__ico">${ico.arrow}</span>`;
  return `<a class="btn btn--${kind}${opts.avatar ? ' btn--ava' : ''}" href="${href}"${ext(href)}>`
    + `<span class="btn-label">${esc(label)}</span>${badge}</a>`;
};

/* The single "start a project" CTA used across the site. */
export const startBtn = (kind = 'primary', opts = {}) =>
  btn(links.startLabel, links.start, kind, { avatar: true, ...opts });

/* WhatsApp / call buttons render only when the number is configured. */
export const waBtn = (kind = 'ghost', label = 'Message on WhatsApp') =>
  links.whatsapp ? btn(label, links.whatsapp, kind, { icon: 'whatsapp' }) : '';
export const telBtn = (kind = 'ghost') =>
  links.tel ? btn(`Call ${site.phone.display}`, links.tel, kind, { icon: 'phone' }) : '';

export const alink = (label, href) =>
  `<a class="alink" href="${href}"${ext(href)}>${esc(label)}${ico.arrow}</a>`;

/* Headline: plain text, with {curly braces} marking an italic-serif phrase.
   The serif is reserved for a few moments per page, not every heading. */
export const head = (lines, cls = 'h2', tag = 'h2') => {
  const render = (l) => esc(l).replace(/\{(.+?)\}/g, '<em class="em">$1</em>');
  return `<${tag} class="${cls}">${lines.map(render).join(' <br> ')}</${tag}>`;
};

/* Page header for inner pages: one heading, one lead, no badges. */
export const pageHead = ({ label, lines, lead, actions = '' }) => `
<section class="phead">
  <div class="wrap phead__in">
    ${label ? `<p class="label">${esc(label)}</p>` : ''}
    ${head(lines, 'h1', 'h1')}
    ${lead ? `<p class="lead">${esc(lead)}</p>` : ''}
    ${actions ? `<div class="btn-row">${actions}</div>` : ''}
  </div>
</section>`;

/* ---------- brand mark ----------
   `site.logo.ink` is the wordmark's bounding box inside the supplied file;
   CSS crops to it so the white margin never paints and the file is never
   edited. The <img> keeps intrinsic width/height so the slot is reserved. */
export const brandMark = ({ eager = false, nav = false } = {}) => {
  const L = site.logo;
  return `<span class="brand__crop" style="--lg-w:${L.w};--lg-h:${L.h};`
    + `--ink-x:${L.ink.x};--ink-y:${L.ink.y};--ink-w:${L.ink.w};--ink-h:${L.ink.h}">`
    + `<img src="${encodeURI('/' + (nav && L.nav ? L.nav : L.src))}" alt="${esc(site.name)}"`
    + ` width="${L.w}" height="${L.h}" decoding="async"`
    + (eager ? ' fetchpriority="high"' : ' loading="lazy"') + '>'
    + `</span>`;
};

/* ---------- header ----------
   Services opens a two-item menu on hover and keyboard focus (CSS only);
   the parent stays a real link to /services. */
const isCurrent = (current, h) => current === h || (h !== '/' && current.startsWith(h + '/'));
const navItem = (current) => ([l, h, kids]) => {
  const link = `<a href="${h}"${isCurrent(current, h) ? ' aria-current="page"' : ''}>${esc(l)}${kids ? `<span class="nav__caret">${ico.caret}</span>` : ''}</a>`;
  if (!kids) return link;
  return `<div class="nav__dd">${link}
        <div class="nav__menu">
          ${kids.map(([kl, kh]) => `<a href="${kh}"${current === kh ? ' aria-current="page"' : ''}>${esc(kl)}</a>`).join('')}
        </div>
      </div>`;
};

/* quick contact in the header: WhatsApp first (preferred by local buyers),
   then phone. Nothing renders if neither is configured. */
const quickContact = () => {
  const items = [];
  if (links.whatsapp) items.push(`<a class="hdr__quick" href="${links.whatsapp}" target="_blank" rel="noopener" aria-label="Message Ostendic on WhatsApp">${ico.whatsapp}<span>WhatsApp</span></a>`);
  if (links.tel) items.push(`<a class="hdr__quick" href="${links.tel}" aria-label="Call Ostendic on ${esc(site.phone.display)}">${ico.phone}<span>${esc(site.phone.display)}</span></a>`);
  return items.join('');
};

export const header = (current = '') => `
<header class="hdr">
  <div class="wrap hdr__in">
    <a class="brand" href="/" aria-label="${esc(site.name)} home">${brandMark({ eager: true, nav: true })}</a>
    <nav class="nav" aria-label="Primary">
      ${nav.map(navItem(current)).join('')}
    </nav>
    <div class="hdr__cta">
      ${quickContact()}
      ${btn(links.startLabel, links.start, 'primary').replace('<span class="btn-label">', `<span class="btn-label btn-label--short">${site.booking ? 'Book a call' : 'Contact'}</span><span class="btn-label btn-label--full">`)}
      <button class="burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mnav" id="burger"><span></span></button>
    </div>
  </div>
</header>
<div class="mnav" id="mnav" aria-hidden="true">
  <nav class="mnav__in" aria-label="Mobile">
    ${nav.map(([l, h]) => `<a class="mnav__link" href="${h}"${isCurrent(current, h) ? ' aria-current="page"' : ''}>${esc(l)}</a>`).join('')}
    <div class="mnav__svc">
      ${pillars.map(s => `<a href="${s.path}">${esc(s.title)}</a>`).join('')}
    </div>
    <div class="mnav__foot">
      ${startBtn('primary')}
      ${waBtn('ghost')}
      ${telBtn('ghost')}
      <a class="alink" href="mailto:${site.email}">${site.email}${ico.arrow}</a>
    </div>
  </nav>
</div>`;

/* ---------- footer ----------
   The closing invitation lives here so every page ends the same way:
   one heading, one sentence, the real contact routes. */
export const footer = (current = '') => `
<footer class="ftr">
  <div class="svc-bg ftr__bg" aria-hidden="true">
    <div class="svc-bg__media">
      <video class="bgvid" muted loop playsinline preload="none" tabindex="-1"
             disablepictureinpicture data-src="/assets/hero-vortex.mp4"></video>
    </div>
  </div>
  <div class="wrap">
    ${current === '/contact' ? '' : `<div class="ftr__cta">
      <div class="ftr__say">
        <h2 class="h2">Tell us what you’re working on.</h2>
        <p class="lead">A short message is enough to start. You’ll hear back from ${esc(site.principal.split(' ')[0])} directly.</p>
      </div>
      <div class="ftr__act">
        <div class="btn-row">
          ${startBtn('primary')}
          ${waBtn('ghost')}
          ${telBtn('ghost')}
        </div>
        <a class="ftr__mail" href="mailto:${site.email}">${ico.mail}<span>${site.email}</span></a>
      </div>
    </div>`}

    <div class="ftr__cols">
      <div class="ftr__brand">
        <a class="brand brand--plaque" href="/" aria-label="${esc(site.name)} home">${brandMark()}</a>
        <p>${esc(site.footer)}</p>
      </div>
      <div>
        <h3 class="ftr__h">Services</h3>
        <ul>${pillars.map(s => `<li><a href="${s.path}">${esc(s.title)}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h3 class="ftr__h">Ostendic</h3>
        <ul>
          <li><a href="/work">Work</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
      <div>
        <h3 class="ftr__h">Contact</h3>
        <ul>
          <li><a href="mailto:${site.email}">${site.email}</a></li>
          ${links.whatsapp ? `<li><a href="${links.whatsapp}" target="_blank" rel="noopener">WhatsApp</a></li>` : ''}
          ${links.tel ? `<li><a href="${links.tel}">${esc(site.phone.display)}</a></li>` : ''}
          ${site.social.map(([l, h]) => `<li><a href="${h}" target="_blank" rel="noopener">${esc(l)}</a></li>`).join('')}
        </ul>
      </div>
    </div>

    <div class="ftr__bar">
      <span>© 2026 ${esc(site.name)}</span>
      <nav aria-label="Legal">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
      </nav>
    </div>
  </div>
</footer>`;

/* ---------- page shell ---------- */
export const page = ({ title, desc, current = '', body, needsForm = false, needsBooking = false, preload = '', noindex = false }) => `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${noindex ? '<meta name="robots" content="noindex, nofollow">\n' : ''}
<link rel="canonical" href="${site.url}${current || '/'}">
<meta name="theme-color" content="#F2F2F0">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${site.url}${current || '/'}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Instrument+Serif:ital@1&display=swap">
${preload}<link rel="stylesheet" href="/styles/ostendic.css">
<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org', '@type': 'Organization',
  name: site.name, url: site.url, email: site.email,
  description: site.sub,
  founder: { '@type': 'Person', name: site.principal, jobTitle: site.principalRole },
  ...(site.phone ? { telephone: site.phone.tel } : {}),
  ...(site.social.length ? { sameAs: site.social.map(([, h]) => h) } : {}),
  knowsAbout: ['Website design and development', 'UI/UX design', 'Web applications', 'E-commerce', 'Agentic AI workflows', 'Process automation'],
})}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${header(current)}
<main id="main">
${body}
</main>
${footer(current)}
${needsForm ? `<script>window.OSTENDIC_EMAIL=${JSON.stringify(site.email)};window.OSTENDIC_FORM_KEY=${JSON.stringify(site.formKey || '')};</script>
<script src="/db.js" defer></script>` : ''}
${needsBooking ? '<script src="/scripts/booking.js" defer></script>\n' : ''}<script src="/scripts/site.js" defer></script>
</body>
</html>`;

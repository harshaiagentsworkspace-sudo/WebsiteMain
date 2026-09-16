/* ===========================================================================
   OSTENDIC — UI PRIMITIVES
   Every component returns an HTML string. One visual language, all pages.
   =========================================================================== */
import { site, nav, services, footerQuick } from './data.mjs';

export const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ---------- icons (inline, no icon font) ---------- */
export const ico = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>',
  right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  dot: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="5"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  flow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="5" cy="6" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M5 8.5V14a4 4 0 0 0 4 4h7.5"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5 9 17.5 20 6.5"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2.01a9.94 9.94 0 0 0-8.5 15.1L2 22.01l5.05-1.32a9.94 9.94 0 1 0 4.99-18.68Zm0 1.8a8.14 8.14 0 1 1-4.15 15.14l-.3-.18-3 .78.8-2.92-.2-.31A8.14 8.14 0 0 1 12.04 3.8Zm4.7 10.3c-.26-.13-1.5-.74-1.74-.82-.23-.09-.4-.13-.57.13s-.65.82-.8.99-.3.19-.55.06a6.6 6.6 0 0 1-1.96-1.21 7.3 7.3 0 0 1-1.35-1.68c-.14-.25 0-.38.11-.5.12-.12.26-.3.39-.45.12-.16.16-.26.25-.43a.47.47 0 0 0-.02-.45c-.06-.13-.56-1.36-.77-1.86-.2-.48-.41-.42-.56-.43h-.48a.93.93 0 0 0-.67.31 2.83 2.83 0 0 0-.88 2.1 4.9 4.9 0 0 0 1.03 2.6 11.2 11.2 0 0 0 4.3 3.8c.6.26 1.07.41 1.44.53.6.2 1.15.17 1.58.1.48-.07 1.5-.61 1.71-1.2.21-.6.21-1.1.15-1.21-.06-.11-.23-.18-.48-.3Z"/></svg>',
  mark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M12 3 4 7v6c0 4.5 3.3 7.6 8 8.7 4.7-1.1 8-4.2 8-8.7V7l-8-4Z"/></svg>',
  /* capability + proof icons: same 24px grid, same 1.6 stroke, drawn larger */
  layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 2.6 9 5.2-9 5.2-9-5.2 9-5.2Z"/><path d="m3.6 12.4 8.4 4.8 8.4-4.8M3.6 16.6 12 21.4l8.4-4.8"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.6 4l-3.2 16"/></svg>',
  rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.6 3.2c3.6 1 6.2 3.6 7.2 7.2l-8.6 8.6-5.8-1.4-1.4-5.8 8.6-8.6Z"/><circle cx="14.6" cy="9.4" r="1.9"/><path d="M6.4 17.6 3 21"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.4 2.6 4.6 13.4h6L10 21.4l9.4-11.2h-6.6l.6-7.6Z"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9S14.6 18.4 12 21c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3Z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5.4l3.4 2"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.6" y="5" width="18.8" height="14" rx="3"/><path d="m3.4 7.4 7.5 5.3a2 2 0 0 0 2.2 0l7.5-5.3"/></svg>',
};

/* ---------- logo marks ----------
   Abstract geometric marks used by the client / logo wall. The two client
   marks are drawn in-house; everything else is a generic placeholder shape
   cycled across the fictitious names in data.mjs. Nothing here reproduces a
   real third-party logo. */
const mk = (body, w = 1.7) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

export const marks = {
  /* client marks */
  careline: mk('<path d="M12 2.8 4.4 6v6.4c0 4.6 3.1 7.9 7.6 8.8 4.5-.9 7.6-4.2 7.6-8.8V6L12 2.8Z"/><path d="M12 8.4v6M9 11.4h6"/>'),
  vms: mk('<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M7.6 8.6 12 16l4.4-7.4"/>'),
  /* generic placeholder marks */
  arc: mk('<path d="M3.4 17.2a8.6 8.6 0 0 1 17.2 0"/><circle cx="12" cy="17.2" r="1.7" fill="currentColor" stroke="none"/>'),
  prism: mk('<path d="M12 3.2 21 20.2H3L12 3.2Z"/><path d="M12 3.2v17"/>'),
  orbit: mk('<circle cx="12" cy="12" r="4"/><ellipse cx="12" cy="12" rx="9.4" ry="4.4" transform="rotate(-28 12 12)"/>'),
  stack: mk('<rect x="4" y="4" width="13" height="5" rx="2"/><rect x="7" y="10.6" width="13" height="5" rx="2"/><rect x="4" y="17" width="13" height="3" rx="1.5"/>'),
  hexa: mk('<path d="m12 2.8 8 4.6v9.2l-8 4.6-8-4.6V7.4l8-4.6Z"/><circle cx="12" cy="12" r="2.4"/>'),
  nodes: mk('<circle cx="5" cy="6.6" r="2.4"/><circle cx="19" cy="12" r="2.4"/><circle cx="7.4" cy="18.4" r="2.4"/><path d="m7.2 7.8 9.4 3M17 13.7l-7.5 3.6"/>'),
  wave: mk('<path d="M2.6 14.4c2.6-6 6.2-6 9.4 0s6.8 6 9.4 0"/><path d="M2.6 9c2.6-4.4 6.2-4.4 9.4 0"/>'),
  rhomb: mk('<path d="m12 2.6 9.4 9.4L12 21.4 2.6 12 12 2.6Z"/><path d="m12 8 4 4-4 4-4-4 4-4Z"/>'),
  pulse: mk('<path d="M2.6 12.4h4.2l2.4-6 3.6 12 2.6-7.2 1.8 3.4h4.2"/>'),
  bloom: mk('<path d="M12 2.8c3.4 3 3.4 6.2 0 9.2-3.4-3-3.4-6.2 0-9.2Zm0 18.4c-3.4-3-3.4-6.2 0-9.2 3.4 3 3.4 6.2 0 9.2Z"/><path d="M2.8 12c3-3.4 6.2-3.4 9.2 0-3 3.4-6.2 3.4-9.2 0Zm18.4 0c-3 3.4-6.2 3.4-9.2 0 3-3.4 6.2-3.4 9.2 0Z"/>'),
  chev: mk('<path d="m5.4 6.4 6 5.6-6 5.6M13 6.4l6 5.6-6 5.6"/>'),
  ringdot: mk('<circle cx="12" cy="12" r="8.6"/><circle cx="16.4" cy="8" r="2.4" fill="currentColor" stroke="none"/>'),
};

/* Placeholder marks. Stepping 7 at a time through 12 shapes (7 and 12 are
   coprime) walks all twelve before repeating and keeps neighbouring cards —
   across the row and down the column — on visibly different silhouettes. */
const genericMarks = ['arc', 'prism', 'orbit', 'stack', 'hexa', 'nodes', 'wave', 'rhomb', 'pulse', 'bloom', 'chev', 'ringdot'];
const markAt = (i) => genericMarks[(i * 7) % genericMarks.length];

/* Wordmark treatment, varied deterministically so the wall reads like a
   real set of identities rather than one repeated lockup. */
const wordStyles = ['', ' lw__word--caps', ' lw__word--serif', ' lw__word--caps', '', ' lw__word--tight'];

/* Just the lockup. The card shell around it is built by the deck in
   sections.mjs, because one card face can hold any lockup as it cycles. */
export const logoLockup = (name, { mark, src = '', client = false, i = 0 } = {}) => {
  const glyph = src
    ? `<img class="lw__img" src="/${src}" alt="" width="120" height="40" loading="lazy">`
    : `<span class="lw__mark">${marks[mark] || marks[markAt(i)]}</span>`;
  return `<span class="lw__logo${client ? ' is-client' : ''}" data-n="${esc(name)}">`
    + `${glyph}<span class="lw__word${client ? '' : wordStyles[i % wordStyles.length]}">${esc(name)}</span>`
    + `</span>`;
};

/* ---------- atoms ---------- */
export const eyebrow = (text, icon = 'dot') =>
  `<span class="eyebrow">${ico[icon] || ico.dot}${esc(text)}</span>`;

/* `opts.avatar` swaps the arrow badge for the founder portrait, so the call
   CTA carries a face rather than a glyph. It is the same pill, same depth and
   the same 36px badge slot — only the contents of the badge change, which is
   why it stays one component instead of a second button. */
export const btn = (label, href, kind = 'primary', opts = {}) => {
  const tag = href ? 'a' : 'button';
  const attrs = href ? `href="${href}"${/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : ''}` : 'type="button"';
  const badge = opts.avatar
    ? `<span class="btn__ava face"><img src="/${site.principalImage}" alt="" width="96" height="96" loading="lazy" decoding="async"></span>`
    : `<span class="btn__ico">${ico.arrow}</span>`;
  return `<${tag} class="btn btn--${kind}${opts.avatar ? ' btn--ava' : ''}" ${attrs}${opts.id ? ` id="${opts.id}"` : ''}>
    <span class="btn-label">${esc(label)}</span>${badge}
  </${tag}>`;
};

export const alink = (label, href) =>
  `<a class="alink" href="${href}"${/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : ''}>${esc(label)}${ico.arrow}</a>`;

/* Editorial headline: plain text + <em> emphasis. Pass an array of lines;
   wrap the emphasised part in {curly braces} to render it as italic serif. */
export const head = (lines, level = 'h2', tag = 'h2') => {
  const render = (l) => esc(l).replace(/\{(.+?)\}/g, '<em class="em">$1</em>');
  // Spaces around <br> are deliberate: when the break is suppressed on small
  // screens the words must still separate rather than run together.
  return `<${tag} class="${level}">${lines.map(render).join(' <br> ')}</${tag}>`;
};

export const secHead = ({ eye, lines, lead, level = 'h2', tag = 'h2', center = false, cta = '' }) => `
  <div class="sec-head${center ? ' center' : ''}">
    ${eye ? eyebrow(eye) : ''}
    ${head(lines, level, tag)}
    ${lead ? `<p class="lead">${esc(lead)}</p>` : ''}
    ${cta ? `<div class="btn-row mt-8">${cta}</div>` : ''}
  </div>`;

/* ---------- blocks ---------- */
export const statRow = (stats, dark = false) => `
  <div class="grid g4">
    ${stats.map(([n, l]) => `<div class="stat"><span class="stat__n tnum">${esc(n)}</span><span class="stat__l">${esc(l)}</span></div>`).join('')}
  </div>`;

export const rowList = (items) => `
  <div class="rowlist">
    ${items.map(i => i.href
      ? `<a href="${i.href}"><span class="row__t">${esc(i.title)}</span>${ico.arrow}</a>`
      : `<div class="row"><span class="row__t">${esc(i.title)}</span>${i.meta ? `<span class="body-sm">${esc(i.meta)}</span>` : ''}</div>`
    ).join('')}
  </div>`;

export const cellGrid = (items, cols = 5) => `
  <div class="cellgrid c${cols}">${items.map(i => `<div>${esc(i)}</div>`).join('')}</div>`;

export const projCard = (p) => {
  const media = p.image
    ? `<img src="/${p.image}" alt="${esc(p.name)} — ${esc(p.summary)}" loading="lazy" width="1200" height="750">`
    : `<div style="display:grid;place-items:center;height:100%;color:var(--ink-3);font-size:var(--t-sm)">${esc(p.name)}</div>`;
  return `<a class="proj card--link" href="/work/${p.slug}" style="background:none;border:0;padding:0">
    <div class="proj__media">${media}</div>
    <div class="stack gap-8">
      <div class="proj__meta">
        <span class="tag ${p.kind === 'client' ? 'tag--live' : 'tag--demo'}">${p.kind === 'client' ? 'Client project' : 'Demo build'}</span>
        <span>${esc(p.category)}</span><span class="dot"></span><span>${esc(p.year)}</span>
      </div>
      <h3 class="h3">${esc(p.name)}</h3>
      <p class="body-sm">${esc(p.summary)}</p>
    </div>
  </a>`;
};

export const faqBlock = (faqs, { eye = 'FAQ', lines = ['Got questions?', 'We’ve {got answers}'] } = {}) => `
  <section class="section" id="faq">
    <div class="wrap faq">
      <div class="faq__grid">
        <div class="stack gap-24">
          ${secHead({ eye, lines, lead: 'If you are not sure where to start, or want to see whether we can help, get in touch and we will walk you through it.' })}
          <div class="faq__aside">
            <span class="faq__face face">
              <img src="/${site.principalImage}"
                   alt="${esc(site.principal)}, ${esc(site.principalRole)} of ${esc(site.name)}"
                   width="200" height="200" loading="lazy" decoding="async">
            </span>
            <h3 class="h4">Book an intro call</h3>
            <p class="body-sm">A 30-minute conversation about your goals, your timeline and whether Ostendic is the right fit. No deck, no pitch.</p>
            <div class="btn-row">${btn('Book a call', '/contact', 'primary')}</div>
            <a class="faq__mail" href="mailto:${site.email}">
              <span class="faq__mail-i">${ico.mail}</span>
              <span>
                <span class="faq__mail-k">Prefer email instead?</span>
                <span class="faq__mail-v">${site.email}</span>
              </span>
            </a>
          </div>
        </div>
        <div class="faq__list">
          ${faqs.map(([q, a], i) => `
            <details${i === 0 ? ' open' : ''}>
              <summary><span>${esc(q)}</span><span class="pm">${ico.plus}</span></summary>
              <div class="faq__a"><p>${esc(a)}</p></div>
            </details>`).join('')}
        </div>
      </div>
    </div>
  </section>`;

export const journeyStrip = () => `
  <section class="section section--sm section--white">
    <div class="wrap stack gap-24">
      <div class="stack gap-16" style="max-width:62ch">
        ${head([site.differentiator.replace('the system around it', '{the system around it}')], 'h3', 'h2')}
      </div>
      <div class="rowlist" style="border-top:1px solid var(--line)">
        <div class="row" style="gap:8px;flex-wrap:wrap;justify-content:flex-start">
          ${site.journey.map((s, i) => `
            <span class="body-sm" style="color:var(--ink);font-weight:500">${esc(s)}</span>
            ${i < site.journey.length - 1 ? '<span class="body-sm" style="opacity:.4">→</span>' : ''}`).join('')}
        </div>
      </div>
    </div>
  </section>`;

/* ---------- header / footer ---------- */
export const header = (current = '') => `
<header class="hdr">
  <div class="wrap hdr__in">
    <a class="brand" href="/" aria-label="Ostendic home">Ostendic</a>
    <nav class="nav" aria-label="Primary">
      ${nav.map(([l, h]) => `<a href="${h}"${current === h ? ' aria-current="page"' : ''}>${esc(l)}</a>`).join('')}
    </nav>
    <div class="hdr__cta">
      ${btn('Contact us', '/contact', 'primary').replace('<a class', '<a aria-label="Contact us" class')}
      <button class="burger" aria-label="Open menu" aria-expanded="false" aria-controls="mnav" id="burger"><span></span></button>
    </div>
  </div>
</header>
<div class="mnav" id="mnav" aria-hidden="true">
  <div class="mnav__in">
    ${nav.map(([l, h]) => `<a class="mnav__link" href="${h}">${esc(l)}${ico.arrow}</a>`).join('')}
    <p class="mnav__lbl">Services</p>
    <div class="mnav__svc">
      ${services.slice(0, 8).map(s => `<a href="/services/${s.slug}">${esc(s.nav)}</a>`).join('')}
    </div>
    <div class="mnav__foot">
      ${btn('Contact us', '/contact', 'primary')}
      <a class="alink" href="mailto:${site.email}">${site.email}${ico.arrow}</a>
    </div>
  </div>
</div>`;

export const footer = () => `
<footer class="ftr">
  <div class="wrap">
    <div class="ftr__cta">
      <div class="stack gap-20">
        ${head(['Ready to build something', 'worth {showing}?'], 'h2', 'h2')}
        <p class="lead">Tell us what is not working. We will tell you honestly whether we are the right people to fix it.</p>
      </div>
      <div class="btn-row" style="justify-content:flex-start">
        ${btn('Start a project', '/contact', 'primary')}
        ${btn('See the work', '/work', 'ghost')}
      </div>
    </div>

    <div class="ftr__cols">
      <div class="ftr__brand">
        <a class="brand" href="/" style="color:var(--ink-inv)">Ostendic</a>
        <p>${esc(site.sub)}</p>
        <p style="margin-top:18px"><a class="alink" href="mailto:${site.email}" style="color:var(--ink-inv)">${site.email}${ico.arrow}</a></p>
      </div>
      <div>
        <h4>Services</h4>
        <ul>${services.slice(0, 7).map(s => `<li><a href="/services/${s.slug}">${esc(s.nav)}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>${footerQuick.map(([l, h]) => `<li><a href="${h}">${esc(l)}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h4>Elsewhere</h4>
        <ul>${site.social.map(([l, h]) => `<li><a href="${h}" target="_blank" rel="noopener">${esc(l)}</a></li>`).join('')}</ul>
        <h4 style="margin-top:26px">Working with</h4>
        <ul><li style="color:var(--ink-inv-2);font-size:var(--t-sm)">${site.markets.join(' · ')}</li></ul>
      </div>
    </div>

    <div class="ftr__bar">
      <span>© ${site.founded}–2026 ${esc(site.name)}. All rights reserved.</span>
      <nav aria-label="Legal">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="/contact">Contact</a>
      </nav>
    </div>
  </div>
</footer>`;

/* ---------- page shell ---------- */
export const page = ({ title, desc, current = '', body, cls = '', needsForm = false }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${site.url}${current || '/'}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${site.url}${current || '/'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Instrument+Serif:ital@0;1&display=swap">
<link rel="stylesheet" href="/styles/ostendic.css">
<link rel="stylesheet" href="/styles/motion.css">
<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org', '@type': 'Organization',
  name: site.name, url: site.url, email: site.email,
  description: site.sub,
  founder: { '@type': 'Person', name: site.principal, jobTitle: site.principalRole },
  areaServed: site.markets,
})}</script>
</head>
<body class="${cls}">
<a class="skip" href="#main">Skip to content</a>
${header(current)}
<main id="main">
${body}
</main>
${footer()}
${needsForm ? `<script>window.OSTENDIC_EMAIL=${JSON.stringify(site.email)};</script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js" defer></script>
<script src="/db.js" defer></script>` : ''}
<script src="/scripts/site.js" defer></script>
<script src="/scripts/motion.js" defer></script>
</body>
</html>`;

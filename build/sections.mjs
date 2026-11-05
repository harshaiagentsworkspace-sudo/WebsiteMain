/* ===========================================================================
   OSTENDIC — MOTION-LED SECTION LIBRARY
   Scroll-driven and depth components used by the homepage narrative.
   Everything renders readable without JS; motion.js enhances it.
   Visible copy comes from data.mjs.
   =========================================================================== */
import {
  site, cta, heroCopy, intro, pillars, servicesHead, audiences, audiencesHead,
  signature, process, processHead, pov, aboutCopy, posts, brands,
} from './data.mjs';
import { esc, ico, eyebrow, btn, head, secHead } from './ui.mjs';


/* faint structural guides at the container edges */
export const guides = () => '<span class="gline" style="left:max(var(--pad-x),calc((100% - var(--max))/2 + var(--pad-x)))"></span>' +
  '<span class="gline" style="right:max(var(--pad-x),calc((100% - var(--max))/2 + var(--pad-x)))"></span>';

/* ---------- 1. HERO ---------- */
export const hero = () => `
<section class="section hero hero--center guides" style="padding-top:clamp(56px,7vw,110px)">
  <!-- Atmospheric background layer. Decorative only: aria-hidden, no controls,
       pointer-events off, and muted + playsinline so it autoplays under every
       current browser policy. The poster shows while it loads and stands in
       under prefers-reduced-motion, so the hero is never blank or broken.
       hero-vortex.mp4 is the web encode of the
       Vortex_rotating_over_static_land… master (see .gitignore). -->
  <div class="hero__bg" aria-hidden="true">
    <div class="hero__media">
      <video class="hero__vid" autoplay muted loop playsinline preload="metadata"
             poster="/assets/hero-vortex-poster.jpg" tabindex="-1"
             disablepictureinpicture>
        <source src="/assets/hero-vortex.mp4" type="video/mp4">
      </video>
    </div>
    <span class="hero__scrim"></span>
  </div>
  ${guides()}
  <div class="wrap stack gap-24" style="align-items:center;position:relative;z-index:1">
    <p class="hero__eye">${esc(heroCopy.eyebrow)}</p>
    ${head(heroCopy.lines, 'display', 'h1')}
    <p class="lead" style="text-align:center;max-width:60ch">${esc(heroCopy.lead)}</p>
    <div class="btn-row center" style="margin-top:8px">
      ${btn(cta.primary, '/contact', 'primary', { avatar: true })}
      ${btn(cta.secondary, '#services', 'ghost')}
    </div>
    <p class="hero__support">${heroCopy.support.map(esc).join('<span aria-hidden="true"> · </span>')}</p>
  </div>
</section>`;

/* ---------- 2. CLIENT SHOWCASE — LOGO MARQUEE ----------
   Exactly four brands (`brands`), one continuous row, no cards.

   The row is rendered twice inside one track and the track slides by
   exactly half its width, so the loop point is invisible. The second copy
   is the same four brands — aria-hidden, empty alts — purely so the row
   never runs out; it adds no new names. Each copy is at least one viewport
   wide (CSS), which is what keeps the seam off-screen with only four logos.

   Pure CSS animation: no scroll listener, no JS, nothing touches page
   scrolling. Hover pauses it on pointer devices; prefers-reduced-motion
   stops it and shows the single row, centred. */
const brandMark = (b, hidden) => b.src
  ? `<img class="mq__img" src="/${encodeURI(b.src)}" alt="${hidden ? '' : esc(b.name)}"
          width="${b.w}" height="${b.h}" loading="lazy" decoding="async">`
  : `<span class="mq__word mq__word--${b.style}">${b.parts
      ? b.parts.map((p, i) => `<span${i ? ' class="mq__word-b"' : ''}>${esc(p)}</span>`).join('')
      : esc(b.name)}</span>`;

const brandRow = (hidden = false) => `
      <ul class="mq__group"${hidden ? ' aria-hidden="true"' : ' aria-label="Brands"'}>
        ${brands.map(b => `<li class="mq__item">${brandMark(b, hidden)}</li>`).join('')}
      </ul>`;

export const logoWall = () => `
<section class="section section--sm logowall">
  <!-- clients-vortex.mp4 is the web encode of the
       Animate_swirling_sky_vortex_1080p master (see .gitignore).
       Environmental layer only. It sits under the marquee, takes no pointer
       events and is aria-hidden. -->
  <div class="lw__bg" aria-hidden="true">
    <div class="lw__media">
      <video class="lw__vid" autoplay muted loop playsinline preload="metadata"
             poster="/assets/clients-vortex-poster.jpg" tabindex="-1"
             disablepictureinpicture>
        <source src="/assets/clients-vortex.mp4" type="video/mp4">
      </video>
    </div>
    <span class="lw__veil"></span>
  </div>
  <div class="wrap">
    <div class="lw__head">
      <p class="lw__lede">Brands we have <em class="em">worked with</em></p>
    </div>
  </div>
  <div class="mq">
    <div class="mq__track">${brandRow()}${brandRow(true)}
    </div>
  </div>
</section>`;

/* ---------- 3. INTRO — CUSTOMER EXPERIENCE / BUSINESS OPERATIONS ----------
   An editorial spread. The statement and a short answer open the section;
   below, the two capabilities share one ruled spread, their labels, titles
   and descriptions aligned row for row (CSS subgrid). Service 01 is an
   abstract plate (a type specimen over golden-section construction
   lines); service 02 is a typographic index. No client work, screenshots
   or mock interfaces appear in this section. */
const AI_ROWS = ['AI Agents for Operations', 'Multi-Agent Systems', 'Process Automation',
  'Lead Management & Follow-ups', 'Customer Support Workflows', 'API & Tool Integrations'];

export const introBlock = () => {
  const [web, ai] = pillars;
  return `
<section class="section ed" data-rv>
  <div class="wrap">
    <div class="ed__top">
      ${head(intro.lines, 'h2 ed__h', 'h2')}
      <div class="ed__aside">
        <p class="ed__say">${esc(intro.body[0])}</p>
        <p class="ed__p">${esc(intro.body[1])}</p>
        <div class="btn-row">${btn(cta.primary, '/contact', 'primary', { avatar: true })}</div>
      </div>
    </div>

    <div class="ed__spread">
      <article class="ed__svc ed__svc--web">
        <p class="ed__label"><span class="tnum">01</span><span class="ed__sl">/</span>Customer experience</p>
        <h3 class="ed__t">Web Development <em>&amp; UI/UX</em></h3>
        <p class="ed__d">We design and build digital experiences that help businesses communicate clearly, establish trust and make it easier for customers to take action.</p>
        <div class="ed__work">
          <div class="ed__art" aria-hidden="true">
            <svg viewBox="0 0 1600 1100" preserveAspectRatio="xMidYMid slice" focusable="false">
              <circle class="ed__disc" cx="915" cy="575" r="275"/>
              <g class="ed__cons">
                <rect x="640" y="300" width="890" height="550"/>
                <path d="M1190 300V850M1190 640H1530M1320 640V850M1190 720H1320"/>
                <path class="ed__arc" d="M640 850A550 550 0 0 1 1190 300A340 340 0 0 1 1530 640A210 210 0 0 1 1320 850A130 130 0 0 1 1190 720"/>
                <path d="M0 850H1600M640 0V1100"/>
              </g>
              <circle class="ed__pin" cx="1190" cy="640" r="7"/>
            </svg>
            <span class="ed__aa">Aa</span>
            <span class="ed__cap">Type <i>/</i> Layout <i>/</i> Interaction</span>
          </div>
          <p class="ed__focus">${web.focus.slice(0, 4).map(esc).join(' <i>·</i> ')}</p>
        </div>
        <a class="ed__more" href="${web.path}">Explore web development <i>${ico.arrow}</i></a>
      </article>

      <article class="ed__svc ed__svc--ai">
        <p class="ed__label"><span class="tnum">02</span><span class="ed__sl">/</span>Business operations</p>
        <h3 class="ed__t">Agentic AI <em>Workflows</em></h3>
        <p class="ed__d">We build connected AI-powered systems that coordinate tasks, move information between tools and reduce repetitive work across business operations.</p>
        <ol class="ed__rows">
          ${AI_ROWS.map((r, i) => `<li><span class="ed__rn">${String(i + 1).padStart(2, '0')}</span><span class="ed__rt">${esc(r)}</span></li>`).join('\n          ')}
        </ol>
        <a class="ed__more" href="${ai.path}">Explore agentic AI workflows <i>${ico.arrow}</i></a>
      </article>
    </div>
  </div>
</section>`;
};

/* ---------- 4. SERVICES — 3D PILLAR STACK ----------
   The same pinned stack (desktop) and sticky matte card stack (mobile),
   now holding the two service pillars. The media side is typographic: it
   lists the pillar's grouped services, and the full list lives on the
   pillar page, so the card stays focused rather than becoming a directory. */
export const servicesStack = () => `
<section class="section section--flush-b" id="services">
  <div class="wrap stack gap-24">
    ${secHead({ eye: 'Services', lines: servicesHead,
      lead: 'Two service pillars with equal weight: the digital experiences your customers use, and the intelligent workflows that keep your business running.' })}
  </div>
</section>
<div class="stage" data-stack>
  <div class="stage__pin">
    <div class="stage__inner">
      ${pillars.map((s, i) => `
        <article class="panel panel--${s.slug}" style="--i:${i}">
          <div class="panel__head">
            <span class="panel__n">Pillar ${s.n} <span class="panel__n-of">/ ${String(pillars.length).padStart(2, '0')}</span></span>
            <h3 class="panel__t">${esc(s.title)}</h3>
            <p class="panel__kick">${esc(s.kicker)}</p>
          </div>
          <div class="panel__media panel__media--focus" aria-hidden="true">
            <span class="focus__i">${ico[s.icon] || ico.spark}</span>
            <ul class="focus">
              ${s.focus.map(f => `<li>${esc(f)}</li>`).join('')}
            </ul>
          </div>
          <div class="panel__body">
            <p class="panel__lead">${esc(s.desc)}</p>
            <div class="panel__caps">
              ${s.focus.map(f => `<span class="tag">${esc(f)}</span>`).join('')}
            </div>
            <div class="btn-row">${btn(`Explore ${s.short}`, s.path, 'ghost')}</div>
          </div>
        </article>`).join('')}
    </div>
  </div>
</div>`;

/* ---------- 5. WHAT YOU CAN COME TO US FOR ----------
   The capability-block grid: four cards covering web, UI/UX, AI workflows
   and the combination. Paint servers give each icon its own gradient
   stroke; mobile turns each card matte. */
export const whoWeHelp = () => `
<section class="section section--white" id="what-we-build" data-rv>
  <svg class="cap__defs" aria-hidden="true" focusable="false" width="0" height="0">
    <defs>
      <linearGradient id="capA" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#5D66BC"/><stop offset="1" stop-color="#8E72C6"/>
      </linearGradient>
      <linearGradient id="capB" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#2E6FA6"/><stop offset="1" stop-color="#3FA0B2"/>
      </linearGradient>
      <linearGradient id="capC" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0E4F47"/><stop offset="1" stop-color="#4C9E7A"/>
      </linearGradient>
      <linearGradient id="capD" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#16233D"/><stop offset="1" stop-color="#4E6FA8"/>
      </linearGradient>
    </defs>
  </svg>
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'What we build', lines: audiencesHead })}
    <div class="caps caps--3 caps--4">
      ${audiences.map((a, i) => `
        <article class="cap">
          <span class="cap__n tnum">${String(i + 1).padStart(2, '0')}</span>
          <span class="cap__i">${ico[a.icon] || ico.spark}</span>
          <h3 class="cap__t">${esc(a.title)}</h3>
          <p class="cap__d">${esc(a.desc)}</p>
        </article>`).join('')}
    </div>
  </div>
</section>`;

/* ---------- 6. SIGNATURE OUTCOME — gradient field ----------
   The glass window that used to hold a project chat now holds the three
   "it might mean" examples, one per pane. */
export const signatureOutcome = () => `
<section class="section collab" data-rv>
  <div class="wrap">
    <div class="grid g2" style="gap:clamp(32px,5vw,72px);align-items:center">
      <div class="stack gap-24">
        ${eyebrow('What it looks like', 'flow')}
        ${head(signature.lines, 'h2', 'h2')}
        <p class="lead">${esc(signature.close[0])}</p>
        <p class="body-sm">${esc(signature.close[1])}</p>
        <div class="btn-row">${btn(cta.primary, '/contact', 'primary', { avatar: true })}</div>
      </div>
      <div class="chatwin">
        <div class="chatwin__bar"><i></i><i></i><i></i><span>What it might look like</span></div>
        ${signature.examples.map((e, i) => `<p class="msg ${i === 1 ? 'msg--us' : 'msg--them'}">${esc(e)}</p>`).join('')}
      </div>
    </div>
  </div>
</section>`;

/* ---------- 7. PROCESS ROADMAP ---------- */
export const roadmap = () => `
<section class="section section--white" id="how-it-works" data-road>
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'How it works', lines: processHead })}
    <div class="road">
      <div class="road__steps">
        <div class="road__rail"><span class="road__fill"></span></div>
        ${process.map(([n, t, d], i) => `
          <div class="step${i === 0 ? ' is-on' : ''}">
            <span class="step__dot"><i></i></span>
            <span class="eyebrow" style="margin-bottom:10px">Step ${n}</span>
            <h3 class="step__t">${esc(t)}</h3>
            <p class="body-sm" style="max-width:48ch">${esc(d)}</p>
          </div>`).join('')}
      </div>
      <div class="road__visuals" aria-hidden="true">
        <div class="road__vwrap">
          ${process.map(([n, t], i) => `
            <div class="road__v${i === 0 ? ' is-on' : ''}">
              <div class="road__frame">
                <span class="panel__n">Step ${n} <span class="panel__n-of">/ ${String(process.length).padStart(2, '0')}</span></span>
                <p class="road__big"><em class="em">${esc(t)}</em></p>
                <hr class="divider">
                <ol class="road__path">
                  ${process.map(([m, u], j) => `<li class="${j === i ? 'is-now' : j < i ? 'is-done' : ''}"><span class="tnum">${m}</span>${esc(u)}</li>`).join('')}
                </ol>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>
  </div>
</section>`;

/* ---------- 8. POINT OF VIEW (dark) ---------- */
export const pointOfView = () => `
<section class="section dark" data-rv>
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'Point of view', center: true, lines: pov.lines })}
    <div class="pov">
      ${pov.body.map((p, i) => `<p class="${i === 1 ? 'pov__q' : 'body-sm'}">${esc(p)}</p>`).join('')}
    </div>
  </div>
</section>`;

/* ---------- 9. ABOUT — FOUNDER SIGNATURE (dark, flush) ----------
   The founder is a human signature on the position, not the hero image of
   the page. The full presentation lives on /about. */
export const founderSignature = () => `
<section class="section dark section--flush-t" data-rv>
  <div class="wrap fsig">
    <div class="fsig__by">
      <img class="fsig__img" src="/${site.principalImage}"
           alt="${esc(site.principal)}, ${esc(site.principalRole)} of ${esc(site.name)}"
           width="240" height="240" loading="lazy">
      <div class="fsig__id">
        <span class="fsig__lbl">About</span>
        <p class="fsig__name">${esc(site.principal)}</p>
        <p class="fsig__role">${esc(site.principalRole)}</p>
        <p class="fsig__disc">${esc(site.principalBio)}</p>
      </div>
    </div>
    <div class="fsig__say">
      ${head(aboutCopy.lines, 'fsig__q', 'h2')}
      ${aboutCopy.body.map(p => `<p class="body-sm">${esc(p)}</p>`).join('')}
      <div class="btn-row">${btn('About Ostendic', '/about', 'ghost')}</div>
    </div>
  </div>
</section>`;

/* ---------- 10. INSIGHTS (editorial) ---------- */
export const insights = () => `
<section class="section section--white" data-rv>
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'Insights', center: true,
      lines: ['Notes on design, development', 'and {intelligent systems}'],
      lead: 'Working notes on websites, UI/UX and agentic AI workflows — written from real projects rather than to a content calendar.' })}
    <div class="posts">
      ${posts.map(p => `
        <a class="post" href="/blog">
          <div class="post__media">
            <img src="/${p.art}" alt="" loading="lazy" width="1200" height="900">
          </div>
          <div class="post__meta">
            <span class="tag">${esc(p.cat)}</span>
            <span class="dot"></span><span>${esc(p.read)}</span>
          </div>
          <h3 class="post__t">${esc(p.title)}</h3>
          <p class="body-sm">${esc(p.desc)}</p>
          <span class="alink" style="align-self:flex-start">Read the note${ico.arrow}</span>
        </a>`).join('')}
    </div>
    <div class="btn-row center">${btn('View all insights', '/blog', 'primary')}</div>
  </div>
</section>`;

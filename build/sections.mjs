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

/* ---------- 3. INTRO — FRONT END / BACK END SHOWCASE ----------
   One statement, then the same idea drawn: the website a customer uses
   (A) and the agentic workflow the team runs behind it (B), joined by one
   line from the mockup's "Send enquiry" button into the workflow's first
   node. Both visuals are live HTML in the site's own design language —
   no screenshots, no stock imagery — and purely illustrative, so they are
   aria-hidden; the copy above carries the meaning. motion.js draws the
   connector and pauses the loops off-screen; without JS the panels still
   read, joined by a static CSS rule. */
const flowNode = (icon, t, d, cls = '', extra = '') => `
          <li class="wf__node ${cls}"${extra}>
            <span class="wf__i">${ico[icon]}</span>
            <span class="wf__txt"><span class="wf__t">${esc(t)}</span><span class="wf__d">${esc(d)}</span></span>
          </li>`;

export const introBlock = () => `
<section class="section duo" data-rv>
  <div class="wrap">
    <div class="duo__copy">
      <div class="duo__lead">
        ${head(intro.lines, 'h2 duo__h', 'h2')}
        <p class="lead">${esc(intro.lead)}</p>
      </div>
      <div class="duo__side">
        <p class="duo__say">${esc(intro.body[0])}</p>
        <p class="body-sm">${esc(intro.body[1])}</p>
        <div class="btn-row">${btn(cta.primary, '/contact', 'primary', { avatar: true })}</div>
      </div>
    </div>

    <div class="duo__stage" data-duo aria-hidden="true">
      <svg class="duo__link" focusable="false">
        <path class="duo__path" id="duoPath" pathLength="1"/><path class="duo__flow"/><circle class="duo__port" r="3.5"/>
        <circle class="duo__dot" r="4">
          <animateMotion dur="6s" repeatCount="indefinite" calcMode="linear" keyPoints="0;1;1" keyTimes="0;.28;1"><mpath href="#duoPath"/></animateMotion>
          <animate attributeName="opacity" dur="6s" repeatCount="indefinite" values="0;1;1;0;0" keyTimes="0;.04;.26;.3;1"/>
        </circle>
      </svg>

      <!-- A — the customer-facing experience -->
      <div class="duo__area duo__area--a">
        <p class="duo__tag"><span class="tnum">01</span> What customers see <em>Web development &amp; UI/UX</em></p>
        <div class="mk">
          <div class="mk__win">
            <div class="mk__bar"><i></i><i></i><i></i><span class="mk__url">yourbusiness.com</span></div>
            <div class="mk__page">
              <div class="mk__nav">
                <span class="mk__logo"><b></b>Your brand</span>
                <span class="mk__links"><span>Services</span><span>Work</span><span>About</span></span>
                <span class="mk__pill">Book a call</span>
              </div>
              <div class="mk__hero">
                <span class="mk__eye">Trusted local experts</span>
                <p class="mk__h">Services your customers <em>understand.</em></p>
                <span class="mk__ln"></span><span class="mk__ln mk__ln--s"></span>
                <span class="mk__ctas"><span class="mk__pill">Get started</span><span class="mk__pill mk__pill--g">Our services</span></span>
              </div>
              <div class="mk__cards">
                <span class="mk__card"><i>${ico.layers}</i><b>Consulting</b><s></s></span>
                <span class="mk__card"><i>${ico.globe}</i><b>Online booking</b><s></s></span>
                <span class="mk__card"><i>${ico.check}</i><b>Support</b><s></s></span>
              </div>
            </div>
          </div>
          <div class="mk__phone">
            <span class="mk__notch"></span>
            <span class="mk__logo"><b></b></span>
            <p class="mk__h">Services your customers <em>understand.</em></p>
            <span class="mk__ln"></span><span class="mk__ln mk__ln--s"></span>
            <span class="mk__pill">Book a call</span>
          </div>
          <div class="mk__form">
            <p class="mk__ft">Book a consultation</p>
            <span class="mk__fld"><small>Name</small>Alex Morgan</span>
            <span class="mk__fld"><small>Interested in</small>Website redesign</span>
            <span class="mk__send" data-duo-from>Send enquiry<i>${ico.arrow}</i></span>
          </div>
        </div>
      </div>

      <!-- B — the business operations behind it -->
      <div class="duo__area duo__area--b">
        <p class="duo__tag"><span class="tnum">02</span> What your team runs <em>Agentic AI workflows</em></p>
        <div class="wf">
          <div class="wf__head"><span>Enquiry workflow</span><span class="wf__live"><i></i>Running</span></div>
          <ol class="wf__list">
            ${flowNode('mail', 'New enquiry received', 'From the website form', 'wf__node--in', ' data-duo-to style="--n:0"')}
            ${flowNode('spark', 'AI agent reviews it', 'Qualifies the request, writes a summary', 'wf__node--agent', ' style="--n:1"')}
            <li class="wf__tools" style="--n:2">
              <span class="wf__tool"><i>${ico.grid}</i>CRM updated</span>
              <span class="wf__tool"><i>${ico.clock}</i>Call slots held</span>
              <span class="wf__tool"><i>${ico.flow}</i>Task assigned</span>
            </li>
            ${flowNode('mail', 'Follow-up drafted', 'Waiting for your approval', '', ' style="--n:3"')}
            ${flowNode('check', 'Team notified', 'Lead ready for a call', 'wf__node--done', ' style="--n:4"')}
          </ol>
        </div>
      </div>
    </div>

    <ol class="duo__steps" aria-label="How the two work together">
      <li><span class="tnum">01</span>Customer experience</li>
      <li><span class="tnum">02</span>Business workflow</li>
      <li><span class="tnum">03</span>Better coordinated operations</li>
    </ol>
  </div>
</section>`;

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

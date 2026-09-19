/* ===========================================================================
   OSTENDIC — MOTION-LED SECTION LIBRARY
   Scroll-driven and depth components used by the homepage narrative.
   Everything renders readable without JS; motion.js enhances it.
   Visible copy comes from data.mjs, which mirrors
   OSTENDIC_UPDATED_WEBSITE_CONTENT.md.
   =========================================================================== */
import {
  site, cta, heroCopy, intro, services, servicesHead, audiences, audiencesHead,
  signature, process, processHead, pov, aboutCopy, posts, clients, teamTypes,
} from './data.mjs';
import { esc, ico, eyebrow, btn, head, secHead, logoLockup, teamLockup } from './ui.mjs';


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
      ${btn(heroCopy.secondary, '#what-we-do', 'ghost')}
    </div>
    <p class="hero__support">${heroCopy.support.map(esc).join('<span aria-hidden="true"> · </span>')}</p>
  </div>
</section>`;

/* ---------- 2. CLIENT / LOGO DECK ----------
   Two rows of cards, not a directory. Ten slots hold the wall at a compact
   height; the rest of the roster cycles through them on the flip mechanism
   rather than being laid out as another five rows of static grid.

   One sequence, no special cases: every slot flips, starting at the first
   card of the first row and running through both rows in order.

   Company names on the deck come only from `clients`. The other cards are
   team types (`teamTypes`), drawn as plain descriptors rather than logos.
   Clients are dealt back in from the pool, so they keep reappearing as the
   deck cycles instead of disappearing after the first pass. */
const SLOTS = 10;

export const logoWall = () => {
  const client = (c, i) => logoLockup(c.name, { mark: c.mark, src: c.src, client: true, i });
  /* the first slots-worth of team types start face-up. The <template> pool
     holds the whole roster — the unseen team types first, then the clients
     interleaved with the rest — and motion.js skips whatever is already
     face-up. A pool smaller than the grid would run dry and stall the deck. */
  const onDeck = teamTypes.slice(0, SLOTS - clients.length);
  const rest = teamTypes.slice(SLOTS - clients.length);
  const pool = rest.map((n, i) => teamLockup(n, i + onDeck.length));
  onDeck.forEach((n, i) => {
    if (clients[i]) pool.push(client(clients[i], i));
    pool.push(teamLockup(n, i));
  });

  const slot = (lockup) => `
    <div class="lw__card">
      <div class="lw__slot">
        <div class="lw__f">${lockup}</div>
        <div class="lw__b" aria-hidden="true"></div>
      </div>
    </div>`;

  const cards =
    clients.map((c, i) => slot(logoLockup(c.name, { mark: c.mark, src: c.src, client: true, i }))).join('') +
    onDeck.map((n, i) => slot(teamLockup(n, i))).join('');

  return `
<section class="section section--sm logowall" data-deck>
  <!-- clients-vortex.mp4 is the web encode of the
       Animate_swirling_sky_vortex_1080p master (see .gitignore).
       Environmental layer only. It sits under every card, takes no pointer
       events and is aria-hidden, so the flip deck above it is untouched:
       same DOM, same z-order, same observers, same timer. -->
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
  <div class="wrap stack gap-32">
    <div class="lw__head">
      <p class="lw__lede">Our clients, and the teams <em class="em">Ostendic is built for</em></p>
    </div>
    <div class="lw">${cards}</div>
    <template data-pool>${pool.join('')}</template>
  </div>
</section>`;
};

/* ---------- 3. INTRO ----------
   The editorial pause after the deck: one statement, one answer. */
export const introBlock = () => `
<section class="section section--white" data-rv>
  <div class="wrap">
    <div class="xpt xpt--intro">
      <div class="stack gap-24">
        ${head(intro.lines, 'h2', 'h2')}
        <p class="lead">${esc(intro.lead)}</p>
      </div>
      <div class="xpt__copy">
        ${intro.body.map((p, i) => `<p class="${i === 0 ? 'xpt__say' : 'body-sm'}">${esc(p)}</p>`).join('')}
        <div class="btn-row">${btn(cta.primary, '/contact', 'primary', { avatar: true })}</div>
      </div>
    </div>
  </div>
</section>`;

/* ---------- 4. SERVICES — 3D CATEGORY STACK ----------
   The same pinned stack as before (desktop) and the same sticky matte card
   stack (mobile). The media side is typographic: it lists only the areas the
   service description already names, so the visual never over-claims. */
export const servicesStack = () => `
<section class="section section--flush-b" id="what-we-do">
  <div class="wrap stack gap-24">
    ${secHead({ eye: 'What we do', lines: servicesHead })}
  </div>
</section>
<div class="stage" data-stack>
  <div class="stage__pin">
    <div class="stage__inner">
      ${services.map((s, i) => `
        <article class="panel" style="--i:${i}">
          <div class="panel__head">
            <span class="panel__n">${String(i + 1).padStart(2, '0')} <span class="panel__n-of">/ ${String(services.length).padStart(2, '0')}</span></span>
            <h3 class="panel__t">${esc(s.title)}</h3>
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
          </div>
        </article>`).join('')}
    </div>
  </div>
</div>`;

/* ---------- 5. WHO WE HELP ----------
   The capability-block grid, now three audience cards. Paint servers give
   each icon its own gradient stroke; mobile turns each card matte. */
export const whoWeHelp = () => `
<section class="section section--white" id="who-we-help" data-rv>
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
    </defs>
  </svg>
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'Who we help', lines: audiencesHead })}
    <div class="caps caps--3">
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
        ${eyebrow('Signature outcome', 'flow')}
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
      lines: ['Deeper notes, practical tips', 'and {real talk about AI}'],
      lead: 'Working notes on AI strategy, team training and workflow design — written from live engagements rather than to a content calendar.' })}
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

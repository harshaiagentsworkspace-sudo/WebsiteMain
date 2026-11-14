/* ===========================================================================
   OSTENDIC — SECTION LIBRARY
   Homepage narrative, in order:
     hero → selected work → services (two chapters) → process → about → footer CTA
   Each section has one job; no section repeats another's content.
   Everything is static HTML. The only motion is the hero background video,
   which never loads on small screens, data-saver or reduced motion.
   =========================================================================== */
import { readFileSync } from 'node:fs';
import { site, heroCopy, homeCopy, pillars, process, processHome, aboutCopy, published, kindLabel } from './data.mjs';
import { stats, statsDevWarning } from './stats.mjs';
import { esc, ico, btn, alink, head, startBtn, WebDevelopmentIcon, AgenticWorkflowsIcon, statIcon } from './ui.mjs';

/* ---------- HERO ----------
   The vortex clip is atmosphere, not content: a poster paints immediately
   (CSS background), and site.js attaches the video source only on larger
   screens with motion allowed. The headline is the LCP element. */
export const hero = () => `
<section class="hero">
  <div class="hero__bg" aria-hidden="true">
    <div class="hero__media">
      <video class="hero__vid" muted loop playsinline preload="none" tabindex="-1"
             disablepictureinpicture data-src="/assets/hero-vortex.mp4"></video>
    </div>
    <span class="hero__scrim"></span>
  </div>
  <div class="wrap hero__in">
    ${head(heroCopy.lines, 'display', 'h1')}
    <p class="lead hero__lead">${esc(heroCopy.lead)}</p>
    <div class="btn-row hero__cta">
      ${startBtn('primary', { eager: true })}
      ${btn(heroCopy.secondaryButton, '#work', 'ghost')}
    </div>
    <ul class="hero__index" aria-label="Services">
      ${pillars.map(p => `<li><a href="${p.path}"><span class="tnum">${p.n}</span><span class="hero__index-t">${esc(p.title)}</span>${ico.right}</a></li>`).join('')}
    </ul>
  </div>
</section>`;

/* ---------- SELECTED WORK ----------
   One client project, presented first and at full width, then the demo
   builds as a secondary row. Labels state each project's real status.
   The client project uses a brand plate: official logo and the project's
   structure, and, when `heroImage` is set, a faded capture behind the logo. */
const plateBg = (p) => p.heroImage
  ? `<img class="plate__bg" src="/${p.heroImage.src}" alt="" width="${p.heroImage.w}" height="${p.heroImage.h}" loading="lazy" decoding="async">`
  : '';

export const brandPlate = (p) => `
  <figure class="plate${p.heroImage ? ' plate--hero' : ''}" style="--logo-ar:${p.brand.h / p.brand.w}${p.brand.colours ? `;--c1:${p.brand.colours[0][1]};--c2:${p.brand.colours[1][1]}` : ''}">
    <div class="plate__logo">
      ${plateBg(p)}
      <img class="plate__mark" src="/${p.brand.logo}" alt="${esc(p.name)} logo" width="${p.brand.w}" height="${p.brand.h}" loading="lazy" decoding="async">
    </div>
    ${p.brand.verticals ? `<div class="plate__foot">
      <ul class="plate__verticals" aria-label="Digital verticals">
        ${p.brand.verticals.map(([n, d]) => `<li><strong>${esc(n)}</strong><span>${esc(d)}</span></li>`).join('')}
      </ul>
    </div>` : ''}
  </figure>`;

/* a project without a logo but with a heroImage: faded capture, name on top */
const heroPlate = (p) => `
  <figure class="plate plate--hero">
    <div class="plate__logo">
      ${plateBg(p)}
      <p class="plate__name">${esc(p.name)}</p>
    </div>
  </figure>`;

/* the visual for a project card: brand plate, faded hero, or screenshots */
export const cardVisual = (p, opts) => p.brand ? brandPlate(p) : p.heroImage ? heroPlate(p) : workFigure(p, opts);

/* screenshot pair for demo builds (real captures of the live product) */
export const workFigure = (p, { phone = true } = {}) => `
  <figure class="wk__fig${phone && p.images.phone ? '' : ' wk__fig--solo'}">
    <img class="wk__desk" src="/${p.images.desktop}" alt="${esc(p.name)} on desktop, captured from the live demo"
         width="1600" height="1000" loading="lazy" decoding="async">
    ${phone && p.images.phone ? `<img class="wk__phone" src="/${p.images.phone}" alt="${esc(p.name)} on a phone"
         width="780" height="1688" loading="lazy" decoding="async">` : ''}
  </figure>`;

export const selectedWork = () => {
  const list = published.slice(0, 4);
  if (!list.length) return '';
  const client = list.filter(p => p.kind === 'client');
  const demos = list.filter(p => p.kind !== 'client');
  return `
<section class="section section--white work-split" id="work">
  <div class="work-part work-part--client">${sectionVideo('/assets/work-bg.mp4')}
  <div class="wrap">
    <div class="shead">
      <p class="label">Selected work</p>
      <div class="shead__main">
        <h2 class="h2">Client work, and products we built ourselves</h2>
      </div>
    </div>

    ${client.map(p => `
    <article class="feat">
      ${brandPlate(p)}
      <div class="feat__text">
        <h3 class="h2">${esc(p.name)}</h3>
        <p class="body">${esc(p.what)}</p>
        <p class="body-sm">${esc(p.built)}</p>
        <div class="wk__links">
          ${alink(p.linkLabel, p.url)}
        </div>
      </div>
    </article>`).join('')}
  </div>
  </div>

    ${demos.length ? `
  <div class="work-part work-part--demos">${sectionVideo('/assets/demos-bg.mp4')}
  <div class="wrap">
    <div class="demos">
      <div class="demos__head">
        <h3 class="h4">Demo builds</h3>
        <p class="body-sm">Products designed and built in-house by Ostendic. They show how we work, and are not client projects.</p>
      </div>
      <ul class="demos__list">
        ${demos.map(p => `
        <li class="demo">
          <a class="demo__img" href="/work#${p.slug}" tabindex="-1" aria-hidden="true">
            <img src="/${p.images.desktop}" alt="" width="1600" height="1000" loading="lazy" decoding="async">
          </a>
          ${p.mark ? `<a class="demo__logo" href="/work#${p.slug}" tabindex="-1" aria-hidden="true" style="background:${p.mark.bg}">
            <img src="/${p.mark.logo}" alt="" width="${p.mark.w}" height="${p.mark.h}" loading="lazy" decoding="async">
          </a>` : ''}
          <h4 class="h4"><a href="/work#${p.slug}">${esc(p.name)}</a></h4>
          <p class="body-sm">${esc(p.what)}</p>
          ${alink(p.linkLabel, p.url)}
        </li>`).join('')}
      </ul>
    </div>
  </div>
  </div>` : ''}
</section>`;
};

/* ---------- STATS BAR ----------
   One component, used under the hero on the homepage and the About page.
   Values, labels and icons come only from build/stats.mjs. Each value is
   split at render time into its leading number ("30", "4.6") and the rest
   ("+", " / 5"); the rest is set in the accent colour. Reads as "30+
   Projects delivered" to screen readers. Icons are decorative. */
const splitValue = (v) => {
  const m = String(v).match(/^(\d[\d.,]*)(.*)$/);
  return m ? `${esc(m[1])}${m[2] ? `<span class="statsbar__suffix">${esc(m[2])}</span>` : ''}` : esc(v);
};
export const statsBar = () => `
<section class="statsbar" aria-label="Ostendic at a glance" data-fade>
  <div class="wrap">
    <ul class="statsbar__row">
      ${stats.map(x => `<li class="statsbar__item">${x.icon ? statIcon(x.icon, { size: 40, className: 'statsbar__icon' }) : ''}<span class="statsbar__value">${splitValue(x.value)}</span><span class="statsbar__label">${esc(x.label)}</span></li>`).join('')}
    </ul>
  </div>
</section>${statsDevWarning}`;

/* ---------- SEQUENCE ----------
   A connected list of steps with a rail. site.js fills the rail as the list
   scrolls through the viewport and marks steps as reached. Text is always
   fully visible; only the rail, the nodes and the numbers change. Without
   JS or with reduced motion the rail is drawn complete. */
export const sequence = (items, cls = '') => `
  <div class="seq ${cls}" data-progress>
    <span class="seq__rail" aria-hidden="true"><span class="seq__fill"></span></span>
    <ol class="seq__list">
    ${items.map(({ n, title, body, get }) => `
    <li class="seq__item">
      <span class="seq__node" aria-hidden="true"></span>
      <span class="seq__n tnum">${esc(n)}</span>
      ${title ? `<h3 class="seq__t">${esc(title)}</h3>` : ''}
      <p class="seq__d">${esc(body)}</p>
      ${get ? `<p class="seq__get"><span>You receive</span>${esc(get)}</p>` : ''}
    </li>`).join('')}
    </ol>
  </div>`;

/* ---------- SERVICES ----------
   One section, two chapters with the same information model but different
   compositions. The heading column is sticky only inside .chap__main, so it
   is released before the worked example below it (the earlier version made
   the whole chapter its sticky container, and the pinned heading slid over
   the example). */
/* Panels use the short `panel` copy; the service pages keep the full fields. */
const facts = ({ panel: p }) => `
  <dl class="facts facts--panel">
    <div><dt>Who it helps</dt><dd>${esc(p.who)}</dd></div>
    <div><dt>The problem</dt><dd>${esc(p.problem)}</dd></div>
    <div><dt>What we build</dt><dd>${esc(p.build)}</dd></div>
    <div><dt>A project can include</dt><dd><ul class="ticks">${p.includes.map(b => `<li>${ico.check}<span>${esc(b)}</span></li>`).join('')}</ul></dd></div>
  </dl>`;

const chapter = (s, link, icon = '', bg = '') => `
      <div class="chap__main">${bg}
        <header class="chap__head">
          ${icon}<span class="chap__n tnum">${s.n}</span>
          <h3 class="chap__t">${esc(s.title)}</h3>
          <p class="body">${esc(s.panel.summary)}</p>
          ${alink(link, s.path)}
        </header>
        ${facts(s)}
      </div>`;

export const example = (s, dark = true) => `
      <aside class="eg${dark ? '' : ' eg--light'}" aria-labelledby="eg-${s.slug}">
        <p class="eg__t" id="eg-${s.slug}">${esc(s.example.title)}</p>
        ${sequence(s.example.steps.map((t, i) => ({ n: String(i + 1).padStart(2, '0'), body: t })), 'seq--eg')}
        <p class="eg__note">An illustration of the kind of workflow we build, not a client case.</p>
      </aside>`;

/* ---------- WORKFLOW RING (homepage example) ----------
   Four steps as nodes on a ring. site.js loops the cycle: the ring draws
   node to node while each node lifts, holds complete, then softly resets.
   Without JS, or with reduced motion, the completed state renders (full
   ring, all nodes lifted, all text visible).
   Node icons are the files in workflow-ring-v2/, inlined unchanged at build
   time (geometry, stroke, currentColor, role and aria-label kept); only the
   fixed width/height are dropped so CSS sizes them. The ring line, the dot
   and the shadows are decorative and aria-hidden; the step lines are real
   text. */
const RING_ICON_DIR = new URL('../workflow-ring-v2/', import.meta.url);
const RING_ICONS = ['step-1-enquiry.svg', 'step-2-agent.svg', 'step-3-approve.svg', 'step-4-reminder.svg'].map(f => {
  const src = readFileSync(new URL(f, RING_ICON_DIR), 'utf8').trim();
  const m = src.match(/^<svg\b([^>]*)>([\s\S]*)<\/svg>$/);
  if (!m) throw new Error(`Not a single <svg> element: ${f}`);
  const attrs = m[1].replace(/\s(width|height|class)="[^"]*"/g, '').replace(/\sxmlns="[^"]*"/, '');
  return `<svg${attrs} class="loop__icon" focusable="false">${m[2]}</svg>`;
});

export const exampleRing = (s) => `
      <aside class="eg eg--ring" aria-labelledby="eg-${s.slug}">
        <p class="eg__t" id="eg-${s.slug}">${esc(s.example.title)}</p>
        <div class="loop" data-loop>
          <div class="loop__box">
            <div class="loop__tilt">
              <svg class="loop__svg" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
                <circle class="loop__track" cx="100" cy="100" r="100"/>
                <circle class="loop__draw" cx="100" cy="100" r="100" pathLength="100"/>
                <circle class="loop__draw loop__draw--done" cx="100" cy="100" r="100" pathLength="100"/>
              </svg>
              <span class="loop__arm" aria-hidden="true"><span class="loop__dot"></span></span>
              ${RING_ICONS.map((icon, i) => `<span class="loop__shadow loop__at--${i}" aria-hidden="true"></span><span class="loop__node loop__at--${i}">${icon}</span>`).join('')}
            </div>
          </div>
          <ol class="loop__steps">
            ${s.example.ring.map(t => `<li class="loop__step">${esc(t)}</li>`).join('')}
          </ol>
        </div>
        <p class="eg__note">An illustration of the kind of workflow we build, not a client case.</p>
      </aside>`;

/* Background clip behind the homepage work, service, process and about sections. Same treatment
   as the hero: decorative, attached by site.js on wider screens with motion
   allowed, and only once the section is near the viewport. */
export const sectionVideo = (src) => `
  <div class="svc-bg" aria-hidden="true">
    <div class="svc-bg__media">
      <video class="bgvid" muted loop playsinline preload="none" tabindex="-1"
             disablepictureinpicture data-src="${src}"></video>
    </div>
  </div>`;

/* Agentic AI panel background: the Ferris wheel clip, placed inside the
   panel's top block (heading + rows) so it stops where the enquiry-loop
   example begins. Same opacity, grade and scrim as the other clips. A still
   frame sits underneath and is what phones and reduced-motion visitors see
   (the clip loads only on wider screens with motion allowed). */
const sectionStill = (src, w, h, clip = '') => `
  <div class="svc-bg" aria-hidden="true">
    <div class="svc-bg__media">
      <img class="svc-still" src="${src}" alt="" width="${w}" height="${h}" loading="lazy" decoding="async">
      ${clip ? `<video class="bgvid svc-still svc-still--vid" muted loop playsinline preload="none" tabindex="-1"
             disablepictureinpicture data-src="${clip}"></video>` : ''}
    </div>
  </div>`;

/* `icons` and `video` are on for the homepage only; /services reuses this without them. */
export const serviceChapters = ({ withHead = true, icons = false, ring = false, video = false } = {}) => {
  const [web, ai] = pillars;
  return `
<section class="section${video ? ' section--vid' : ''}" id="services">${video ? sectionVideo('/assets/web-development-bg.mp4') : ''}
  <div class="wrap">
    ${withHead ? `
    <div class="shead">
      <p class="label">Services</p>
      <div class="shead__main">
        <h2 class="h2">${esc(homeCopy.servicesHeading)}</h2>
      </div>
    </div>` : ''}
    <article class="chap" id="${web.slug}">${chapter(web, 'More on web development and UI/UX', icons ? WebDevelopmentIcon({ className: 'chap__icon' }) : '')}
    </article>
  </div>
</section>
<section class="section section--dark${video ? ' section--vid' : ''}" id="${ai.slug}">
  <div class="wrap">
    <article class="chap chap--ai">${chapter(ai, 'More on agentic AI workflows', icons ? AgenticWorkflowsIcon({ className: 'chap__icon' }) : '', video ? sectionStill('/assets/agentic-ai-bg.webp', 1920, 1040, '/assets/agentic-ai-bg.mp4') : '')}
${ring ? exampleRing(ai) : example(ai)}
    </article>
  </div>
</section>`;
};

/* ---------- PROCESS ROADMAP ---------- */
export const processSection = ({ home = false } = {}) => home ? `
<section class="section roadmap roadmap--home section--vid" id="process">${sectionVideo('/assets/process-bg.mp4')}
  <div class="wrap">
    <div class="shead">
      <p class="label">How a project runs</p>
      <div class="shead__main">
        <h2 class="h2">${esc(processHome.heading)}</h2>
      </div>
    </div>
    ${sequence(processHome.steps.map(([n, title, body]) => ({ n, title, body })), 'seq--road')}
  </div>
</section>` : `
<section class="section roadmap" id="process">
  <div class="wrap">
    <div class="shead">
      <p class="label">How a project runs</p>
      <div class="shead__main">
        <h2 class="h2">Agreed in writing before anything is built</h2>
      </div>
    </div>
    ${sequence(process.map(([n, title, body, get]) => ({ n, title, body, get })), 'seq--road')}
  </div>
</section>`;

/* ---------- ABOUT TEASER ----------
   Text-led. The founder appears as a small portrait beside his name, the
   same size on every screen, so the section reads as a studio introduction
   rather than a personal profile. */
/* Founder line: small photo, name, role. Homepage About teaser and the
   About page hero. `extra` goes after the name (e.g. a link). */
export const founderSig = (extra = '') => `<div class="sig">
          <span class="sig__img face"><img src="/${site.principalImage}" alt="${esc(site.principal)}" width="800" height="800" loading="lazy" decoding="async"></span>
          <span class="sig__id"><strong>${esc(site.principal)}</strong><span>${esc(site.principalRole)}, ${esc(site.name)}</span></span>
          ${extra}
        </div>`;

export const aboutTeaser = () => `
<section class="section section--vid" id="about">${sectionVideo('/assets/about-bg.mp4')}
  <div class="wrap">
    <div class="shead shead--flush">
      <p class="label">About</p>
      <div class="shead__main">
        <h2 class="h2">${esc(homeCopy.about.heading)}${homeCopy.about.headingItalic ? ` <em class="em">${esc(homeCopy.about.headingItalic)}</em>` : ''}</h2>
        <div class="about-t">
          ${aboutCopy.teaser.map(p => `<p class="body">${esc(p)}</p>`).join('')}
        </div>
        ${founderSig(alink('More about Ostendic', '/about'))}
      </div>
    </div>
  </div>
</section>`;

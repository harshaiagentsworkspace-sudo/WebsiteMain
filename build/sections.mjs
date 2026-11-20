/* ===========================================================================
   OSTENDIC — SECTION LIBRARY
   Homepage narrative, in order (pages.mjs › home):
     hero → selected work → problems → services (three chapters) → who we
     help → process → solutions → benefits → about → FAQ → footer CTA
   Problems, who we help, solutions and benefits are glass cards with icons
   over a blurred clip, the same treatment as the service pages.
   Each section has one job; no section repeats another's content.
   Heading levels: one h1 (hero), an h2 per section, h3 inside sections.
   Everything is static HTML. The only motion is the background video,
   which never loads with data-saver or reduced motion.
   =========================================================================== */
import { readFileSync, existsSync } from 'node:fs';
import { site, heroCopy, homeCopy, pillars, pillar, process, processHome, aboutCopy, published, kindLabel, pagesCopy } from './data.mjs';
import { stats, statsDevWarning, STATS_ARE_PLACEHOLDER } from './stats.mjs';
import { esc, ico, btn, alink, head, serviceIconFor, statIcon, principleIcon } from './ui.mjs';

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
      ${btn(heroCopy.primaryButton, '/contact', 'primary', { avatar: true, eager: true })}
      ${btn(heroCopy.secondaryButton, '#services', 'ghost', { icon: 'right' })}
    </div>
    <ul class="hero__index" aria-label="Services">
      ${pillars.map(p => `<li><a href="${p.path}"><span class="tnum">${p.n}</span><span class="hero__index-t">${esc(p.short)}</span>${ico.right}</a></li>`).join('')}
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
        <h2 class="h2">${esc(pagesCopy.work.selectedHeading)}</h2>
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
export const statsBar = () => STATS_ARE_PLACEHOLDER ? '' : `
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
  <div class="seq ${cls}" data-progress style="--seq-n:${items.length}">
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
   One chapter per service area, all with the same information model. The
   heading column is sticky only inside .chap__main, so it is released
   before the worked example below it (the earlier version made the whole
   chapter its sticky container, and the pinned heading slid over the
   example). */
/* Panels use the short `panel` copy; the service pages keep the full fields. */
const facts = ({ panel: p }) => `
  <dl class="facts facts--panel">
    <div><dt>Who it helps</dt><dd>${esc(p.who)}</dd></div>
    <div><dt>The problem</dt><dd>${esc(p.problem)}</dd></div>
    <div><dt>What we do</dt><dd>${esc(p.build)}</dd></div>
    <div><dt>A project can include</dt><dd><ul class="ticks">${p.includes.map(b => `<li>${ico.check}<span>${esc(b)}</span></li>`).join('')}</ul></dd></div>
  </dl>`;

const chapter = (s, { icon = '', bg = '', tag = 'h3', links = [] } = {}) => `
      <div class="chap__main">${bg}
        <header class="chap__head">
          ${icon}<span class="chap__n tnum">${s.n}</span>
          <${tag} class="chap__t">${esc(s.panel.title)}</${tag}>
          <p class="body">${esc(s.panel.summary)}</p>
          ${links.map(([label, href]) => alink(label, href)).join('')}
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
        <div class="eg__head">
          <span class="eg__live" aria-hidden="true"><span class="eg__pulse"></span>Live workflow</span>
          <p class="eg__t" id="eg-${s.slug}">${esc(s.example.title)}</p>
        </div>
        <div class="loop" data-loop>
          <div class="loop__box">
            <div class="loop__tilt">
              <svg class="loop__svg" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
                <defs><linearGradient id="loop-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7B5CFA"/><stop offset=".55" stop-color="#4F7BFF"/><stop offset="1" stop-color="#22B5F2"/></linearGradient></defs>
                <circle class="loop__track" cx="100" cy="100" r="100"/>
                <circle class="loop__draw" cx="100" cy="100" r="100" pathLength="100"/>
                <circle class="loop__draw loop__draw--done" cx="100" cy="100" r="100" pathLength="100"/>
              </svg>
              <span class="loop__arm" aria-hidden="true"><span class="loop__dot"></span></span>
              ${RING_ICONS.map((icon, i) => `<span class="loop__shadow loop__at--${i}" aria-hidden="true"></span><span class="loop__node loop__at--${i}"><span class="loop__ripple" aria-hidden="true"></span><span class="loop__num tnum" aria-hidden="true">0${i + 1}</span>${icon}</span>`).join('')}
            </div>
            <div class="loop__hub" aria-hidden="true">
              ${s.example.ring.map((t, i) => `<span class="loop__hub-s" data-s="${i + 1}"><b class="tnum">0${i + 1}</b><span>Step ${i + 1} of ${s.example.ring.length}</span></span>`).join('')}
              <span class="loop__hub-s loop__hub-s--done"><b>${ico.check}</b><span>Handled, start to finish</span></span>
            </div>
          </div>
          <ol class="loop__steps">
            ${s.example.ring.map((t, i) => `<li class="loop__step"><span class="loop__sn tnum" aria-hidden="true">0${i + 1}</span><span class="loop__st">${esc(t)}</span><span class="loop__bar" aria-hidden="true"></span></li>`).join('')}
          </ol>
        </div>
        <p class="eg__note">An illustration of the kind of workflow we build, not a client case.</p>
      </aside>`;

/* Background clip behind the homepage work, service, process and about
   sections. Decorative: site.js attaches the clip once the section is near
   the viewport (any screen size; not with reduced motion or data saver).
   The clip's poster frame (assets/<name>-poster.jpg) is painted underneath,
   so the section has its backdrop while the clip loads, and on phones that
   refuse autoplay (iOS Low Power Mode, Android battery saver). */
const posterOf = (src) => {
  const p = src.replace(/\.mp4$/, '-poster.jpg');
  return existsSync(new URL(`..${p}`, import.meta.url)) ? p : '';
};
export const sectionVideo = (src) => `
  <div class="svc-bg" aria-hidden="true">
    <div class="svc-bg__media"${posterOf(src) ? ` style="background-image:url('${posterOf(src)}')"` : ''}>
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
/* The homepage shows three areas (AI automation's chapter also links to
   AI agent development); /services shows all four. The AI automation
   chapter is the dark band and carries the worked example. `icons` and
   `video` are on for the homepage only. */
const HOME_AREAS = ['web-development', 'ai-automation', 'business-consulting'];
const CHAPTER_CLIP = { 'web-development': '/assets/web-development-bg.mp4', 'business-consulting': '/assets/clients-vortex.mp4' };
export const serviceChapters = ({ slugs = HOME_AREAS, withHead = true, icons = false, ring = false, video = false } = {}) => {
  const tag = withHead ? 'h3' : 'h2';
  let light = 0;
  return slugs.map(slug => pillar[slug]).map((s, i) => {
    const dark = s.slug === 'ai-automation';
    const links = [[`More on ${s.title.replace(/ and UI\/UX Design$/, '')}`, s.path]];
    if (dark && !slugs.includes('ai-agent-development')) links.push(['More on custom AI agents', pillar['ai-agent-development'].path]);
    const icon = icons ? serviceIconFor(s.slug, { className: 'chap__icon' }) : '';
    const cls = dark ? ' section--dark' : (light++ % 2 ? ' section--white' : '');
    const clip = video && !dark && CHAPTER_CLIP[s.slug];
    const head = withHead && i === 0 ? `
    <div class="shead">
      <p class="label">Services</p>
      <div class="shead__main">
        <h2 class="h2">${esc(homeCopy.servicesHeading)}</h2>
      </div>
    </div>` : '';
    return `
<section class="section${cls}${video ? ' section--vid' : ''}" id="${i === 0 ? 'services' : s.slug}">${clip ? sectionVideo(clip) : ''}
  <div class="wrap">${head}
    <article class="chap${dark ? ' chap--ai' : ''}"${i === 0 ? ` id="${s.slug}"` : ''}>${chapter(s, { icon, tag, links,
      bg: dark && video ? sectionStill('/assets/agentic-ai-bg.webp', 1920, 1040, '/assets/agentic-ai-bg.mp4') : '' })}
${dark && s.example && !ring ? example(s) : ''}
    </article>
  </div>
</section>${dark && s.example && ring ? `
<section class="section section--vid section--glass section--ring" id="workflow-example">${glassBg('hero-vortex')}
  <span class="ring-orbs" aria-hidden="true"><span></span><span></span><span></span></span>
  <div class="wrap">
${exampleRing(s)}
  </div>
</section>` : ''}`;
  }).join('');
};

/* ---------- SHARED: glass cards and FAQ ----------
   Frosted-glass cards over a full-strength clip, blurred and washed with
   white. The clip's poster is the backdrop wherever the clip doesn't play
   (phones that refuse autoplay, reduced motion, data saver), so the glass
   always has something to blur. */
export const glassBg = (name) => `
  <div class="svc-bg glass-bg" aria-hidden="true">
    <div class="svc-bg__media" style="background-image:url('/assets/${name}-poster.jpg')">
      <video class="bgvid" muted loop playsinline preload="none" tabindex="-1"
             disablepictureinpicture data-src="/assets/${name}.mp4"></video>
    </div>
  </div>`;

const glassCards = (items, { cols = 3, numbered = false, link } = {}) => `
    <ul class="glass-grid glass-grid--${cols} glass-cards">
      ${items.map((x, i) => `<li class="glass">
        <span class="glass-cards__top">
          <span class="glass__tile">${x.icon ? principleIcon(`${x.icon}.svg`, { size: 28 }) : ico.check}</span>
          ${numbered ? `<span class="glass__pill tnum">${String(i + 1).padStart(2, '0')}</span>` : ''}
        </span>
        <h3 class="h4">${esc(x.title)}</h3>
        <p class="body-sm">${esc(x.text)}</p>
        ${link ? link(x) : ''}
      </li>`).join('')}
    </ul>`;
const cols = (n) => n >= 5 ? 5 : n;

const shead = (label, heading, intro = '') => `
    <div class="shead">
      <p class="label">${esc(label)}</p>
      <div class="shead__main">
        <h2 class="h2">${esc(heading)}</h2>
        ${intro ? `<p class="body">${esc(intro)}</p>` : ''}
      </div>
    </div>`;

/* Questions as <details>, so every answer is in the HTML (crawlable and
   readable without JS) but the list stays short to scan. */
export const faqList = (items) => `
    <div class="faq">
      ${items.map((f, i) => `<details class="faq__item glass">
        <summary><span class="faq__n tnum" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><h3 class="faq__q">${esc(f.q)}</h3><span class="faq__ico" aria-hidden="true">${ico.caret}</span></summary>
        <div class="faq__a"><p class="body">${esc(f.a)}</p></div>
      </details>`).join('')}
    </div>`;

/* glass cards over a blurred clip, like the other card sections */
export const faqSection = (heading, items, { label = 'FAQ', clip = 'clients-vortex' } = {}) => !items.length ? '' : `
<section class="section section--vid section--glass section--faq" id="faq">${glassBg(clip)}
  <span class="ring-orbs" aria-hidden="true"><span></span><span></span><span></span></span>
  <div class="wrap">${shead(label, heading)}
    ${faqList(items)}
  </div>
</section>`;

/* ---------- PROBLEMS ---------- */
export const problemsSection = () => {
  const P = homeCopy.problems;
  return `
<section class="section section--vid section--glass section--pain" id="problems">${glassBg('about-hero-bg')}
  <div class="wrap">${shead('The challenge', P.heading, P.intro)}
    ${glassCards(P.items, { cols: cols(P.items.length), numbered: true })}
  </div>
</section>`;
};

/* ---------- WHO WE HELP ---------- */
export const audiencesSection = () => {
  const A = homeCopy.audiences;
  return `
<section class="section section--vid section--glass" id="who-we-help">${glassBg('blog-bg')}
  <div class="wrap">${shead('Who we help', A.heading)}
    ${glassCards(A.items, { cols: A.items.length === 3 ? 3 : 4 })}
  </div>
</section>`;
};

/* ---------- SOLUTIONS ---------- */
export const solutionsSection = () => {
  const S = homeCopy.solutions;
  return `
<section class="section section--vid section--glass" id="solutions">${glassBg('demos-bg')}
  <div class="wrap">${shead('Solutions', S.heading, S.intro)}
    ${glassCards(S.items, { cols: 3, link: (x) => alink(pillar[x.service].short, pillar[x.service].path) })}
  </div>
</section>`;
};

/* ---------- BENEFITS ---------- */
export const benefitsSection = () => {
  const B = homeCopy.benefits;
  return `
<section class="section section--vid section--glass" id="benefits">${glassBg('agentic-ai-bg')}
  <div class="wrap">${shead('What changes', B.heading, B.intro)}
    ${glassCards(B.items, { cols: cols(B.items.length) })}
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
          <span class="sig__img face"><img src="/${site.avatar}" alt="${esc(site.principal)}" width="192" height="192" loading="lazy" decoding="async"></span>
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

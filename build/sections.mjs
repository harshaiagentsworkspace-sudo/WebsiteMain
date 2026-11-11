/* ===========================================================================
   OSTENDIC — SECTION LIBRARY
   Homepage narrative, in order:
     hero → selected work → services (two chapters) → process → about → footer CTA
   Each section has one job; no section repeats another's content.
   Everything is static HTML. The only motion is the hero background video,
   which never loads on small screens, data-saver or reduced motion.
   =========================================================================== */
import { site, heroCopy, pillars, process, aboutCopy, published, kindLabel, stats } from './data.mjs';
import { esc, ico, btn, alink, head, startBtn, WebDevelopmentIcon, AgenticWorkflowsIcon } from './ui.mjs';

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
      ${btn('See selected work', '#work', 'ghost')}
    </div>
    <ul class="hero__index" aria-label="Services">
      ${pillars.map(p => `<li><a href="${p.path}"><span class="tnum">${p.n}</span><span class="hero__index-t">${esc(p.title)}</span>${ico.right}</a></li>`).join('')}
    </ul>
  </div>
</section>`;

/* ---------- SELECTED WORK ----------
   One client project, presented first and at full width, then the demo
   builds as a secondary row. Labels state each project's real status.
   The client project uses a brand plate (official logo + its sampled
   colours + the project's structure), never a website screenshot. */
export const brandPlate = (p) => `
  <figure class="plate" style="--c1:${p.brand.colours[0][1]};--c2:${p.brand.colours[1][1]}">
    <div class="plate__logo">
      <img src="/${p.brand.logo}" alt="${esc(p.name)} logo" width="${p.brand.w}" height="${p.brand.h}" loading="lazy" decoding="async">
    </div>
    <div class="plate__foot">
      <ul class="plate__verticals" aria-label="Digital verticals">
        ${p.brand.verticals.map(([n, d]) => `<li><strong>${esc(n)}</strong><span>${esc(d)}</span></li>`).join('')}
      </ul>
      <ul class="plate__colours" aria-label="Brand colours">
        ${p.brand.colours.map(([n, hex]) => `<li><i style="background:${hex}"></i><span>${esc(n)}</span><code>${hex}</code></li>`).join('')}
      </ul>
    </div>
  </figure>`;

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
<section class="section section--white" id="work">
  <div class="wrap">
    <div class="shead">
      <p class="label">Selected work</p>
      <div class="shead__main">
        <h2 class="h2">Client work, and products we built ourselves</h2>
        <p class="body">Every project is labelled. A client project was built for a paying client. A demo build is a working product Ostendic designed and built in-house to test an idea end to end.</p>
      </div>
    </div>

    ${client.map(p => `
    <article class="feat">
      ${brandPlate(p)}
      <div class="feat__text">
        <h3 class="h2">${esc(p.name)}</h3>
        <p class="body">${esc(p.what)}</p>
        <p class="body-sm">${esc(p.built)}</p>
        <ul class="scope">${p.scope.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        <div class="wk__links">
          ${alink('Read the project', `/work#${p.slug}`)}
          <a class="alink alink--quiet" href="${p.url}" target="_blank" rel="noopener">vmscareline.com${ico.arrow}</a>
        </div>
      </div>
    </article>`).join('')}

    ${demos.length ? `
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
          <h4 class="h4"><a href="/work#${p.slug}">${esc(p.name)}</a></h4>
          <p class="body-sm">${esc(p.what)}</p>
          ${alink('Open the live demo', p.url)}
        </li>`).join('')}
      </ul>
    </div>` : ''}
  </div>
</section>`;
};

/* ---------- STUDIO NUMBERS ----------
   Rendered only when every figure is verified and has a stated basis.
   `preview` (local design review only) renders unverified figures with a
   visible marker; it is never used by a normal build. */
export const studioNumbers = ({ preview = false } = {}) => {
  const ok = stats.publish && stats.items.every(x => x.verified && x.basis);
  if (!ok && !preview) return '';
  return `
<section class="numbers${ok ? '' : ' numbers--unverified'}" aria-label="Studio numbers">
  <div class="wrap">
    ${ok ? '' : '<p class="numbers__flag">Unverified figures, shown for local design review only. Not published.</p>'}
    <dl class="numbers__row">
      ${stats.items.map(x => `
      <div>
        <dt>${esc(x.label)}</dt>
        <dd><span class="numbers__v tnum">${esc(x.value)}</span>${x.basis ? `<span class="numbers__b">${esc(x.basis)}</span>` : ''}</dd>
      </div>`).join('')}
    </dl>
  </div>
</section>`;
};

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
const facts = (s) => `
  <dl class="facts">
    <div><dt>Who it helps</dt><dd>${esc(s.who)}</dd></div>
    <div><dt>The problem</dt><dd>${esc(s.problem)}</dd></div>
    <div><dt>What we build</dt><dd><ul class="inline-list">${s.build.map(b => `<li>${esc(b)}</li>`).join('')}</ul></dd></div>
    <div><dt>A project can include</dt><dd><ul class="ticks">${s.includes.map(b => `<li>${ico.check}<span>${esc(b)}</span></li>`).join('')}</ul></dd></div>
  </dl>`;

const chapter = (s, link, icon = '') => `
      <div class="chap__main">
        <header class="chap__head">
          ${icon}<span class="chap__n tnum">${s.n}</span>
          <h3 class="chap__t">${esc(s.title)}</h3>
          <p class="body">${esc(s.summary)}</p>
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
   The four steps as nodes on a ring. site.js draws the ring from node to
   node and closes it; without JS, or with reduced motion, the completed
   state is what renders. The ring and icons are decorative (aria-hidden);
   the step texts are real text in an ordered list. Icons are drawn in the
   style of the service icons: 64 viewBox, stroke 3, round caps and joins,
   circles, lines and rounded rects only. */
const nodeIcon = (inner) =>
  `<svg viewBox="0 0 64 64" width="28" height="28" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`;
const NODE_ICONS = [
  /* 01 incoming enquiry: a message card with an arrow entering */
  nodeIcon('<rect x="24" y="16" width="32" height="30" rx="6"/><line x1="34" y1="26" x2="46" y2="26"/><line x1="34" y1="35" x2="42" y2="35"/><line x1="6" y1="31" x2="28" y2="31"/><line x1="21" y1="24" x2="28" y2="31"/><line x1="21" y1="38" x2="28" y2="31"/>'),
  /* 02 agent reads and logs: three lines with one highlighted dot */
  nodeIcon('<line x1="26" y1="20" x2="52" y2="20"/><line x1="26" y1="32" x2="52" y2="32"/><line x1="26" y1="44" x2="44" y2="44"/><circle cx="14" cy="32" r="4.5" fill="currentColor" stroke="none"/>'),
  /* 03 drafted reply awaiting approval: a speech bubble with a small check */
  nodeIcon('<rect x="10" y="12" width="44" height="32" rx="8"/><line x1="20" y1="44" x2="16" y2="53"/><line x1="16" y1="53" x2="29" y2="44"/><line x1="24" y1="28" x2="30" y2="34"/><line x1="30" y1="34" x2="41" y2="22"/>'),
  /* 04 follow-up reminder: a circle with a clock hand and a small dot */
  nodeIcon('<circle cx="30" cy="34" r="20"/><line x1="30" y1="34" x2="30" y2="23"/><line x1="30" y1="34" x2="38" y2="39"/><circle cx="51" cy="13" r="4.5" fill="currentColor" stroke="none"/>'),
];

export const exampleRing = (s) => `
      <aside class="eg eg--ring" aria-labelledby="eg-${s.slug}">
        <p class="eg__t" id="eg-${s.slug}">${esc(s.example.title)}</p>
        <div class="loop" data-loop>
          <div class="loop__stage">
            <div class="loop__box" aria-hidden="true">
              <div class="loop__tilt">
                <svg class="loop__svg" viewBox="0 0 200 200" focusable="false">
                  <circle class="loop__track" cx="100" cy="100" r="80"/>
                  <circle class="loop__draw" cx="100" cy="100" r="80" pathLength="100"/>
                  <circle class="loop__draw loop__draw--done" cx="100" cy="100" r="80" pathLength="100"/>
                </svg>
                <span class="loop__arm"><span class="loop__dot"></span></span>
                ${NODE_ICONS.map((icon, i) => `<span class="loop__shadow loop__at--${i}"></span><span class="loop__node loop__at--${i}">${icon}</span>`).join('')}
              </div>
            </div>
            <button class="loop__replay" type="button" hidden>Replay</button>
          </div>
          <ol class="loop__steps">
            ${s.example.steps.map((t, i) => `<li class="loop__step"><span class="loop__n tnum">${String(i + 1).padStart(2, '0')}</span><p>${esc(t)}</p></li>`).join('')}
          </ol>
        </div>
        <p class="eg__note">An illustration of the kind of workflow we build, not a client case.</p>
      </aside>`;

/* `icons` is on for the homepage only; /services reuses this without them. */
export const serviceChapters = ({ withHead = true, icons = false, ring = false } = {}) => {
  const [web, ai] = pillars;
  return `
<section class="section" id="services">
  <div class="wrap">
    ${withHead ? `
    <div class="shead">
      <p class="label">Services</p>
      <div class="shead__main">
        <h2 class="h2">Two things we do, and do properly</h2>
        <p class="body">Some businesses need one of them. Many need both: a website that brings enquiries in, and a workflow that makes sure each one is answered.</p>
      </div>
    </div>` : ''}
    <article class="chap" id="${web.slug}">${chapter(web, 'More on web development and UI/UX', icons ? WebDevelopmentIcon({ className: 'chap__icon' }) : '')}
    </article>
  </div>
</section>
<section class="section section--dark" id="${ai.slug}">
  <div class="wrap">
    <article class="chap chap--ai">${chapter(ai, 'More on agentic AI workflows', icons ? AgenticWorkflowsIcon({ className: 'chap__icon' }) : '')}
${ring ? exampleRing(ai) : example(ai)}
    </article>
  </div>
</section>`;
};

/* ---------- PROCESS ROADMAP ---------- */
export const processSection = () => `
<section class="section roadmap" id="process">
  <div class="wrap">
    <div class="shead">
      <p class="label">How a project runs</p>
      <div class="shead__main">
        <h2 class="h2">Agreed in writing before anything is built</h2>
        <p class="body">Four stages, the same for a website or a workflow. You always know what happens next and what you will get from it.</p>
      </div>
    </div>
    ${sequence(process.map(([n, title, body, get]) => ({ n, title, body, get })), 'seq--road')}
  </div>
</section>`;

/* ---------- ABOUT TEASER ----------
   Text-led. The founder appears as a small portrait beside his name, the
   same size on every screen, so the section reads as a studio introduction
   rather than a personal profile. */
export const aboutTeaser = () => `
<section class="section" id="about">
  <div class="wrap">
    <div class="shead shead--flush">
      <p class="label">About</p>
      <div class="shead__main">
        <h2 class="h2">Work with the person <em class="em">doing the work</em></h2>
        <div class="about-t">
          ${aboutCopy.teaser.map(p => `<p class="body">${esc(p)}</p>`).join('')}
        </div>
        <div class="sig">
          <span class="sig__img face"><img src="/${site.principalImage}" alt="${esc(site.principal)}" width="800" height="800" loading="lazy" decoding="async"></span>
          <span class="sig__id"><strong>${esc(site.principal)}</strong><span>${esc(site.principalRole)}, ${esc(site.name)}</span></span>
          ${alink('More about Ostendic', '/about')}
        </div>
      </div>
    </div>
  </div>
</section>`;

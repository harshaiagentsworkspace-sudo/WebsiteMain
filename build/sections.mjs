/* ===========================================================================
   OSTENDIC — SECTION LIBRARY
   Homepage narrative, in order:
     hero → selected work → services (two chapters) → process → about → footer CTA
   Each section has one job; no section repeats another's content.
   Everything is static HTML. The only motion is the hero background video,
   which never loads on small screens, data-saver or reduced motion.
   =========================================================================== */
import { site, heroCopy, pillars, process, aboutCopy, published, kindLabel, stats } from './data.mjs';
import { esc, ico, btn, alink, head, startBtn } from './ui.mjs';

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
        <p class="wk__meta"><span class="tag tag--client">${kindLabel.client}</span><span>${esc(p.area)}</span></p>
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
          <p class="wk__meta"><span class="tag tag--demo">${kindLabel.demo}</span><span>${esc(p.area)}</span></p>
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

const chapter = (s, link) => `
      <div class="chap__main">
        <header class="chap__head">
          <span class="chap__n tnum">${s.n}</span>
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

export const serviceChapters = ({ withHead = true } = {}) => {
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
    <article class="chap" id="${web.slug}">${chapter(web, 'More on web development and UI/UX')}
    </article>
  </div>
</section>
<section class="section section--dark" id="${ai.slug}">
  <div class="wrap">
    <article class="chap chap--ai">${chapter(ai, 'More on agentic AI workflows')}
${example(ai)}
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

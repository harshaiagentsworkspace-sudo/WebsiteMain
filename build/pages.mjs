/* ===========================================================================
   OSTENDIC — PAGE COMPOSITIONS
   =========================================================================== */
import {
  site, links, pillars, aboutCopy, published, bookingProvider,
  budgets, interests, interestSlug, pagesCopy as PC, homeCopy,
} from './data.mjs';
import { esc, ico, btn, alink, head, pageHead, startBtn, waBtn, telBtn, principleIcon, brandMark, serviceIconFor } from './ui.mjs';
import * as S from './sections.mjs';
import { mock, heroScene, sidePhoto, stockImg } from './mockups.mjs';
import { posts, readingTime, renderBody, fmtDate, src as mediaSrc } from './blog.mjs';
import { sanitizeInline, SERVICE_SLUGS } from './schema.mjs';

/* ========================= HOME =========================
   AI first: the automation offer, the problems it solves and the three
   core AI services come before the (secondary) website section. The
   closing "Still doing work that could be automated?" invitation is the
   footer CTA, shared by every page. */
export const home = () => `
${S.hero()}
${S.statsBar()}
${S.problemsSection()}
${S.solutionsSection()}
${S.showcaseSection()}
${S.serviceChapters({ icons: true, ring: true, video: true })}
${S.webSection()}
${S.selectedWork()}
${S.audiencesSection()}
${S.processSection({ home: true })}
${S.whySection()}
${S.faqSection(homeCopy.faq.heading, homeCopy.faq.items, { clip: 'hero-vortex' })}
`;

/* ========================= SERVICES ========================= */
export const servicesIndex = () => `
${pageHead({
  label: PC.services.label,
  lines: [PC.services.heading],
  lead: PC.services.lead,
})}
${S.serviceChapters({ slugs: SERVICE_SLUGS, withHead: false })}
${S.processSection()}
`;

/* Service pages: frosted-glass cards over a full-strength clip. The poster
   is the backdrop wherever the clip doesn't play (phones, reduced motion,
   data saver), so the glass always has something to blur.
   [intro + cards, related work, principles, worked example] */
const glassClips = {
  'ai-automation': ['about-hero-bg', 'hero-vortex', 'process-bg', 'agentic-ai-bg'],
  'ai-agent-development': ['agentic-ai-bg', 'process-bg', 'about-hero-bg'],
  'workflow-automation': ['process-bg', 'clients-vortex', 'work-bg', 'hero-vortex'],
  'ai-consulting': ['about-bg', 'clients-vortex', 'work-bg'],
  'web-development': ['work-bg', 'demos-bg', 'clients-vortex'],
};
const glassBg = S.glassBg;

/* Icons for the cards, in card order (workflow-ring-v2/). A page whose card
   count doesn't match its icon list shows a tick instead, so editing the
   cards in the admin can never break the build. */
const CARD_ICONS = {
  'ai-automation': ['ai-03-leads', 'ai-05-support', 'step-2-agent', 'ai-06-automation', 'ai-07-integrations', 'ai-08-internal-systems'],
  'ai-agent-development': ['ai-01-agents', 'ai-02-multi-agent', 'step-3-approve', 'step-2-agent'],
  'workflow-automation': ['principle-1-problem', 'ai-07-integrations', 'ai-03-leads', 'step-1-enquiry', 'ai-08-internal-systems', 'ai-06-automation'],
  'ai-consulting': ['principle-1-problem', 'ai-06-automation', 'ai-01-agents', 'service-06-custom-app',
    'ai-07-integrations', 'principle-3-keep-running', 'step-3-approve', 'principle-4-people'],
  'web-development': ['service-01-website', 'service-02-ui-ux', 'service-03-landing-page', 'service-04-ecommerce',
    'service-05-cms', 'service-06-custom-app', 'service-07-responsive', 'service-08-redesign'],
};
const cardIcon = (slug, i, count) => {
  const list = CARD_ICONS[slug] || [];
  return list.length === count && list[i] ? principleIcon(`${list[i]}.svg`, { size: 28 }) : ico.check;
};
const gridCols = (n) => n % 4 === 0 ? 4 : n % 3 === 0 ? 3 : Math.min(n, 4);

/* the main call to action on each service page; it opens the enquiry form
   with this service already chosen */
const SERVICE_CTA = {
  'ai-automation': 'Discuss Your Workflow',
  'ai-agent-development': 'Discuss an AI Agent Idea',
  'workflow-automation': 'Let’s Discuss Your Business Process',
  'ai-consulting': 'Find Automation Opportunities',
  'web-development': 'Talk About Your Website',
};
const serviceActions = (s) => btn(SERVICE_CTA[s.slug] || 'Tell Us What’s Taking Your Time', S.enquiryHref(s.slug), 'primary', { avatar: true, eager: true })
  + (site.booking ? btn('Book a quick call', '/book', 'ghost', { icon: 'calendar' }) : waBtn('ghost'));

/* longer explanations: heading on the left, text on the right, hairline
   between blocks (the same rhythm as the facts lists) */
const detailBlocks = (details) => `
<section class="section section--white">
  <div class="wrap">
    <div class="details">
      ${details.map(d => `<div class="details__item">
        <h2 class="h3 details__h">${esc(d.heading)}</h2>
        <div class="details__body">
          ${d.paragraphs.map(p => `<p class="body">${esc(p)}</p>`).join('')}
          ${d.points && d.points.length ? `<ul class="ticks ticks--lg">${d.points.map(b => `<li>${ico.check}<span>${esc(b)}</span></li>`).join('')}</ul>` : ''}
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>`;

/* closing call to action and the other services, shared by both layouts */
const serviceTail = (s, others) => `
<section class="section section--sm svc-cta">
  <div class="wrap svc-cta__in">
    <h2 class="h3">${esc(s.slug === 'web-development' ? 'Planning a new website, or a better one?' : 'Tell us what’s taking your team’s time.')}</h2>
    <div class="btn-row">${serviceActions(s)}</div>
  </div>
</section>
<section class="section section--sm section--white">
  <div class="wrap">
    <div class="shead">
      <p class="label">Related services</p>
      <div class="shead__main"><h2 class="h2">Other ways we can help</h2></div>
    </div>
    <ul class="related">
      ${others.map(o => `<li><a class="related__link" href="${o.path}">
        <span class="related__ico">${serviceIconFor(o.slug, { size: 28 })}</span>
        <span class="related__t"><strong class="h4">${esc(o.title)}</strong><span class="body-sm">${esc(o.summary)}</span></span>
        <span class="related__go">${ico.right}</span>
      </a></li>`).join('')}
    </ul>
  </div>
</section>
`;

/* Visual service pages (the AI services). Pictures first, few words:
   hero with a product mockup of the result, before/after scenes, cards
   that each show the thing in use, an example workflow that runs, then
   short steps and promises. The long explanations stay on the page but
   folded away ("In more detail"), after the FAQ. Mockups: mockups.mjs. */
const X_ICO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
const OK_ICO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>';

const relatedWork = (work) => !work.length ? '' : `
<section class="section">
  <div class="wrap">
    <div class="shead">
      <p class="label">Related work</p>
      <div class="shead__main"><h2 class="h2">Where we have applied this</h2></div>
    </div>
    <ul class="mini-work">
      ${work.map(p => `
      <li>
        <a class="glass" href="/work#${p.slug}">
          ${p.brand || p.mark
            ? (({ logo, w, h, bg }) => `<span class="mini-work__logo"${bg ? ` style="background:${bg}"` : ''}><img src="/${logo}" alt="" width="${w}" height="${h}" loading="lazy" decoding="async"></span>`)(p.mark || p.brand)
            : `<img src="/${p.images.desktop}" alt="" width="1600" height="1000" loading="lazy" decoding="async">`}
          <span class="mini-work__t"><strong>${esc(p.name)}</strong><span class="body-sm">${esc(p.what)}</span></span>
        </a>
      </li>`).join('')}
    </ul>
  </div>
</section>`;

const moreDetail = (details) => !details.length ? '' : `
<section class="section section--white section--sm" id="more-detail">
  <div class="wrap">
    <div class="shead">
      <p class="label">In more detail</p>
      <div class="shead__main"><h2 class="h3">For those who like the full picture</h2></div>
    </div>
    <div class="faq faq--plain">
      ${details.map(d => `<details class="faq__item">
        <summary><h3 class="faq__q">${esc(d.heading)}</h3><span class="faq__ico" aria-hidden="true">${ico.caret}</span></summary>
        <div class="faq__a">
          ${d.paragraphs.map(p => `<p class="body">${esc(p)}</p>`).join('')}
          ${d.points && d.points.length ? `<ul class="ticks">${d.points.map(b => `<li>${ico.check}<span>${esc(b)}</span></li>`).join('')}</ul>` : ''}
        </div>
      </details>`).join('')}
    </div>
  </div>
</section>`;

const visualServicePage = (s, tail) => {
  const V = s.visual;
  const work = published.filter(p => p.pillars.includes(s.slug));
  const side = (k) => {
    const b = V[k];
    return `<div class="ba__side ba__side--${k}">
        <p class="ba__tag"><span class="ba__ico">${k === 'before' ? X_ICO : OK_ICO}</span>${esc(b.title)}</p>
        <div class="ba__stage${sidePhoto(s.slug, k) ? ' ba__stage--photo' : ''}" aria-hidden="true">${sidePhoto(s.slug, k)}${mock(b.mock)}</div>
        <ul class="ba__pts">${b.points.map(p => `<li><span class="ba__ico">${k === 'before' ? X_ICO : OK_ICO}</span>${esc(p)}</li>`).join('')}</ul>
      </div>`;
  };
  return `
<section class="svh">
  <div class="wrap svh__in">
    <div class="svh__text">
      <p class="label svh__label"><span class="svh__ico">${serviceIconFor(s.slug, { size: 20 })}</span>${esc(s.title)}</p>
      ${head([s.heading], 'h1', 'h1')}
      <p class="lead">${esc(V.lead)}</p>
      <div class="btn-row">${serviceActions(s)}</div>
    </div>
    <div class="svh__visual">${heroScene(s.slug)}</div>
  </div>
</section>

<section class="section section--white sv-ba">
  <div class="wrap">
    <div class="ba">
      ${side('before')}
      <span class="ba__arrow" aria-hidden="true">${ico.right}</span>
      ${side('after')}
    </div>
  </div>
</section>

<section class="section sv-cards">
  <div class="wrap">
    <div class="shead">
      <p class="label">${esc(s.short.charAt(0).toUpperCase() + s.short.slice(1))}</p>
      <div class="shead__main"><h2 class="h2">${esc(V.cardsHeading)}</h2></div>
    </div>
    <ul class="vcards vcards--${V.cards.length}">
      ${V.cards.map(c => `<li class="vcard">
        <div class="vcard__stage" aria-hidden="true">${mock(c.mock)}</div>
        <div class="vcard__t"><h3 class="h4">${esc(c.title)}</h3><p class="body-sm">${esc(c.text)}</p></div>
      </li>`).join('')}
    </ul>
  </div>
</section>
${V.workflow ? `
<section class="section section--white sv-wf">
  <div class="wrap">
    <div class="shead">
      <p class="label">See it run</p>
      <div class="shead__main"><h2 class="h2">${esc(V.workflow.title)}</h2></div>
    </div>
    ${S.workflowFigure(V.workflow.id, { name: V.workflow.title, title: V.workflow.title, done: V.workflow.done })}
    <p class="wf__note label">Example workflow, shown for illustration. Every build is designed around your own tools and rules.</p>
  </div>
</section>` : ''}

<section class="section sv-how">
  <div class="wrap">
    <div class="shead">
      <p class="label">How it works</p>
      <div class="shead__main"><h2 class="h2">From first call to up and running.</h2></div>
    </div>
    <ol class="how how--${V.steps.length}">
      ${V.steps.map((st, n) => `<li class="how__step"><span class="how__n tnum">${n + 1}</span><h3 class="h4">${esc(st.title)}</h3><p class="body-sm">${esc(st.text)}</p></li>`).join('')}
    </ol>
    <ul class="promises">
      ${V.promises.map(p => `<li><span class="promises__ico">${OK_ICO}</span><span><b>${esc(p.title)}</b><span class="body-sm">${esc(p.text)}</span></span></li>`).join('')}
    </ul>
  </div>
</section>
${relatedWork(work)}
${S.faqSection('Frequently asked questions', s.faq, { clip: 'demos-bg' })}
${moreDetail(s.details)}
${tail}`;
};

export const pillarPage = (s) => {
  const others = pillars.filter(p => p.slug !== s.slug);
  if (s.visual) return visualServicePage(s, serviceTail(s, others));
  const clips = glassClips[s.slug];
  const work = published.filter(p => p.pillars.includes(s.slug));
  return `
${pageHead({
  label: s.title,
  lines: [s.heading],
  lead: s.summary,
  actions: serviceActions(s),
  bg: s.slug === 'web-development' ? S.sectionVideo('/assets/web-development-bg.mp4') : '',
})}

<section class="section section--vid section--glass">${glassBg(clips[0])}
  <div class="wrap">
    <div class="svc-intro">
      <div class="glass"><span class="glass__pill">Who it helps</span><p class="body">${esc(s.who)}</p></div>
      <div class="glass"><span class="glass__pill">The problem</span><p class="body">${esc(s.problem)}</p></div>
    </div>
    <div class="shead">
      <p class="label">Services</p>
      <div class="shead__main"><h2 class="h2">${esc(s.servicesHeading)}</h2></div>
    </div>
    <ul class="glass-grid glass-grid--${gridCols(s.services.length)}">
      ${s.services.map(([t, d], i) => `<li class="glass"><span class="glass__tile">${cardIcon(s.slug, i, s.services.length)}</span><h3 class="h4">${esc(t)}</h3><p class="body-sm">${esc(d)}</p></li>`).join('')}
    </ul>
  </div>
</section>
${s.details.length ? detailBlocks(s.details) : ''}
${s.example ? `
<section class="section section--vid section--glass section--eg">${glassBg(clips[3] || clips[0])}
  <div class="wrap">
    ${S.example(s, false)}
  </div>
</section>` : ''}

<section class="section section--vid section--glass">${glassBg(clips[1])}
  <div class="wrap">
    <div class="shead">
      <p class="label">How we approach it</p>
      <div class="shead__main"><h2 class="h2">What an engagement includes</h2></div>
    </div>
    <ol class="glass-grid glass-grid--${Math.min(s.includes.length, 5)}">
      ${s.includes.map((b, i) => `<li class="glass glass--step"><span class="glass__pill tnum">Step ${String(i + 1).padStart(2, '0')}</span><p class="glass__lead">${esc(b)}</p></li>`).join('')}
    </ol>
    <h3 class="label glass-sub">What we hold to</h3>
    <div class="glass-grid glass-grid--3">
      ${s.principles.map(([t, d]) => `<div class="glass"><span class="glass__ico">${ico.check}</span><h4 class="h4">${esc(t)}</h4><p class="body-sm">${esc(d)}</p></div>`).join('')}
    </div>
  </div>
</section>

${work.length ? `
<section class="section section--vid section--glass">${glassBg(clips[2])}
  <div class="wrap">
    <div class="shead">
      <p class="label">Related work</p>
      <div class="shead__main"><h2 class="h2">Where we have applied this</h2></div>
    </div>
    <ul class="mini-work">
      ${work.map(p => `
      <li>
        <a class="glass" href="/work#${p.slug}">
          ${p.brand || p.mark
            ? (({ logo, w, h, bg }) => `<span class="mini-work__logo"${bg ? ` style="background:${bg}"` : ''}><img src="/${logo}" alt="" width="${w}" height="${h}" loading="lazy" decoding="async"></span>`)(p.mark || p.brand)
            : `<img src="/${p.images.desktop}" alt="" width="1600" height="1000" loading="lazy" decoding="async">`}
          <span class="mini-work__t"><strong>${esc(p.name)}</strong><span class="body-sm">${esc(p.what)}</span></span>
        </a>
      </li>`).join('')}
    </ul>
  </div>
</section>` : ''}
${S.faqSection('Frequently asked questions', s.faq, { clip: 'demos-bg' })}
${serviceTail(s, others)}
`;
};

/* ========================= WORK ========================= */
const workCase = (p) => `
    <article class="case" id="${p.slug}">
      ${S.cardVisual(p)}
      <div class="case__body">
        <h2 class="h2">${esc(p.name)}</h2>
        <dl class="facts facts--case facts--panel">
          <div><dt>What it is</dt><dd>${esc(p.what)}</dd></div>
          <div><dt>The problem</dt><dd>${esc(p.problem)}</dd></div>
          <div><dt>What was built</dt><dd>${esc(p.built)}</dd></div>
        </dl>
        <div class="btn-row">${btn(p.linkLabel, p.url, 'ghost')}</div>
      </div>
    </article>`;

/* The page head and the first case (the client project) sit over the same
   client-work clip the homepage uses. */
export const work = () => `
<div class="work-hero">${S.sectionVideo('/assets/work-bg.mp4')}
${pageHead({
  label: PC.work.label,
  lines: [PC.work.heading],
})}

<section class="section section--flush-t">
  <div class="wrap">
    ${published.slice(0, 1).map(workCase).join('')}
  </div>
</section>
</div>

<section class="section section--flush-t">
  <div class="wrap">
    ${published.slice(1).map(workCase).join('')}

    <div class="note">
      <h2 class="h4">${esc(PC.work.noteTitle)}</h2>
      <p class="body-sm">${esc(PC.work.noteText)}</p>
    </div>
  </div>
</section>
`;

/* ========================= ABOUT ========================= */
/* About: the principles get a photo of the situation each one is about.
   Stock people never stand in for the Ostendic team: the founder is the
   only face of the company; photos show the businesses we build for. */
const ABOUT_PHOTOS = ['about-problem', 'about-cost', 'about-running', 'about-loop'];
const aboutClients = () => {
  const C = PC.about.clients;
  if (!C || !C.items.length) return '';
  return `
<section class="section section--white about-clients">
  <div class="wrap">
    <div class="shead">
      <p class="label">${esc(C.label)}</p>
      <div class="shead__main"><h2 class="h2">${esc(C.heading)}</h2></div>
    </div>
    <ul class="mosaic mosaic--${C.items.length}">
      ${C.items.map(x => `<li class="mosaic__item">${stockImg(x.photo)}<span class="mosaic__cap">${esc(x.label)}</span></li>`).join('')}
    </ul>
    ${C.note ? `<p class="label mosaic__note">${esc(C.note)}</p>` : ''}
  </div>
</section>`;
};

export const about = () => `
<section class="phead phead--vid">${S.sectionVideo('/assets/about-hero-bg.mp4')}
  <div class="wrap about-hero">
    <div class="about-hero__text">
      <p class="label">About</p>
      <h1 class="h1 about-hero__h">${esc(aboutCopy.hero.heading)}</h1>
      <p class="lead">${esc(aboutCopy.hero.lead)}</p>
      ${aboutCopy.hero.body.map(p => `<p class="body">${esc(p)}</p>`).join('\n      ')}
      ${S.founderSig()}
    </div>
    <figure class="about-hero__logo">${brandMark({ eager: true, nav: true })}</figure>
  </div>
</section>
${S.statsBar()}

<section class="section section--vid section--glass">${glassBg('process-bg')}
  <div class="wrap">
    <div class="shead">
      <p class="label">${esc(PC.about.approachLabel)}</p>
      <div class="shead__main"><h2 class="h2">${esc(PC.about.approachHeading)}</h2></div>
    </div>
    <ul class="glass-grid glass-grid--4">
      ${aboutCopy.approach.map(([t, d, icon], n) => `<li class="glass${ABOUT_PHOTOS[n] ? ' glass--photo' : ''}">${ABOUT_PHOTOS[n] ? `<figure class="glass__photo">${stockImg(ABOUT_PHOTOS[n])}</figure>` : ''}<span class="glass-cards__top"><span class="glass__tile">${principleIcon(icon, { size: 28 })}</span></span><h3 class="h4">${esc(t)}</h3><p class="body-sm">${esc(d)}</p></li>`).join('')}
    </ul>
  </div>
</section>

${aboutClients()}

<section class="section section--vid section--glass">${glassBg('demos-bg')}
  <div class="wrap">
    <div class="shead">
      <p class="label">${esc(PC.about.servicesLabel)}</p>
      <div class="shead__main"><h2 class="h2">${esc(PC.about.servicesHeading)}</h2></div>
    </div>
    <ul class="glass-grid glass-grid--${pillars.length % 2 ? 3 : 2}">
      ${pillars.map(p => `<li><a class="glass glass--link" href="${p.path}"><span class="glass__tile">${serviceIconFor(p.slug, { size: 28 })}</span><span class="glass__pill tnum">Service ${p.n}</span><h3 class="h3">${esc(p.title)}</h3><p class="body-sm">${esc(p.summary)}</p><span class="glass__go">Learn more${ico.right}</span></a></li>`).join('')}
    </ul>
    <div class="btn-row">${startBtn('primary')}</div>
  </div>
</section>
`;

/* ========================= CONTACT =========================
   Two routes, side by side: talk now (WhatsApp / call / booking, each shown
   only if configured) and the enquiry form, which is always available. */
export const contact = () => {
  const direct = [
    links.whatsapp && `<li><a href="${links.whatsapp}" target="_blank" rel="noopener">${ico.whatsapp}<span><strong>WhatsApp</strong><span>Send a message</span></span></a></li>`,
    links.tel && `<li><a href="${links.tel}">${ico.phone}<span><strong>Call</strong><span>${esc(site.phone.display)}</span></span></a></li>`,
    `<li><a href="mailto:${site.email}">${ico.mail}<span><strong>Email</strong><span>${site.email}</span></span></a></li>`,
  ].filter(Boolean).join('');
  const form = `
      <form class="form" id="leadForm" novalidate>
        <div class="form__row">
          <div class="field" data-req>
            <label for="f-name">Your name</label>
            <input id="f-name" name="name" type="text" autocomplete="name" required aria-describedby="e-name">
            <span class="err" id="e-name">Please tell us your name.</span>
          </div>
          <div class="field" data-req>
            <label for="f-email">Business email</label>
            <input id="f-email" name="email" type="email" autocomplete="email" inputmode="email" required aria-describedby="e-email">
            <span class="err" id="e-email">That email doesn’t look right.</span>
          </div>
        </div>
        <div class="form__row">
          <div class="field">
            <label for="f-phone">Phone or WhatsApp <span class="opt">(optional)</span></label>
            <input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel">
          </div>
          <div class="field">
            <label for="f-company">Company name <span class="opt">(optional)</span></label>
            <input id="f-company" name="company" type="text" autocomplete="organization">
          </div>
        </div>
        <div class="field">
          <label for="f-help">Service interest</label>
          <select id="f-help" name="help">${interests.map(i => `<option data-svc="${interestSlug(i)}">${esc(i)}</option>`).join('')}</select>
        </div>
        <div class="field">
          <label for="f-budget">Rough budget <span class="opt">(optional)</span></label>
          <select id="f-budget" name="budget">${budgets.map(b => `<option>${esc(b)}</option>`).join('')}</select>
        </div>
        <div class="field" data-req>
          <label for="f-project">Your business challenge</label>
          <textarea id="f-project" name="project" required minlength="10" aria-describedby="e-project"
            placeholder="A few sentences is plenty. Which tasks take up your team’s time, which tools are involved, or what do you need from a website?"></textarea>
          <span class="err" id="e-project">Add a sentence or two so we know where to start.</span>
        </div>
        <!-- Spam trap: hidden from people and assistive tech; bots fill it. -->
        <div class="hp" aria-hidden="true">
          <label for="f-website">Leave this field empty</label>
          <input id="f-website" name="website" type="text" tabindex="-1" autocomplete="off">
        </div>
        <div class="form__status" id="formStatus" role="status" aria-live="polite"></div>
        <div class="form__foot">
          <button class="btn btn--primary" type="submit" id="formSubmit">
            <span class="btn-label">Send message</span><span class="btn__ico">${ico.arrow}</span>
          </button>
          <p class="form__note">We only use these details to reply to you. <a href="/privacy">Privacy</a></p>
        </div>
      </form>`;
  /* Two options as tabs: Send a message (first, default) / Book a call,
     synced with the URL hash (#message, #book). The inline script picks the tab
     from the hash before first paint; site.js handles clicks, arrow keys
     and hash changes. Without JS both panels show, one under the other. */
  const tabs = site.booking ? `
      <script>document.documentElement.setAttribute('data-ctab', location.hash === '#book' ? 'book' : 'message');</script>
      <div class="ctabs" role="tablist" aria-label="How to get in touch">
        <button class="ctabs__tab" type="button" role="tab" id="tab-message" aria-controls="panel-message" aria-selected="true" data-tab="message">Send a message</button>
        <button class="ctabs__tab" type="button" role="tab" id="tab-book" aria-controls="panel-book" aria-selected="false" tabindex="-1" data-tab="book">Book a call</button>
      </div>
      <div class="ctabs__panel" role="tabpanel" id="panel-message" aria-labelledby="tab-message" tabindex="0">
        <div class="contact__form">${form}
        </div>
      </div>
      <div class="ctabs__panel" role="tabpanel" id="panel-book" aria-labelledby="tab-book" tabindex="0">
        <p class="body">Pick a time that suits you.</p>
        ${bookingPanel()}
        <p class="body-sm ctabs__alt"><a class="alink" href="#message" data-tab-link="message">Prefer to write? Send a message${ico.arrow}</a></p>
      </div>` : `
      <div class="contact__form">${form}
      </div>`;
  return `
<section class="phead phead--contact phead--vid section--glass">${glassBg('about-bg')}
  <div class="wrap contact">
    <div class="contact__main">
      <p class="label">Contact</p>
      <h1 class="h2 contact__h">${esc(PC.contact.heading)}</h1>
      ${tabs}
    </div>
    <aside class="contact__side" aria-label="Other ways to reach us">
      <ul class="direct">${direct}</ul>
    </aside>
  </div>
</section>
`;
};

/* Calendly inline URL: the configured URL plus hide_gdpr_banner=1 */
const calendlyUrl = () => {
  const u = new URL(site.booking);
  u.searchParams.set('hide_gdpr_banner', '1');
  return u.toString();
};

/* The scheduler panel (Calendly or Cal.com inline embed plus its loading,
   error and booked states). One component, used on /book and in the
   Contact page's "Book a call" tab; scripts/booking.js drives it. */
const bookingPanel = () => `
    <div class="booking__panel" id="booking" data-provider="${bookingProvider}" data-url="${esc(site.booking || '')}">
      <div class="booking__state" data-state="loading" role="status">
        <span class="spinner" aria-hidden="true"></span>
        <p>Loading available times…</p>
      </div>
      <div class="booking__state" data-state="error" hidden role="alert">
        <h2 class="h4">The calendar didn’t load</h2>
        <p class="body-sm">This can happen with strict privacy settings or a blocked network. You can open the booking page directly, or send a message.</p>
        <div class="btn-row">
          ${btn('Open the booking page', site.booking || '/contact', 'primary')}
          ${btn('Send a message', '/contact#message', 'ghost')}
        </div>
      </div>
      <div class="booking__state booking__state--done" data-state="done" hidden tabindex="-1" role="status">
        <span class="booking__ok" aria-hidden="true">${ico.check}</span>
        <h2 class="h3">Your call is booked</h2>
        <p class="body">The calendar confirmed your booking. A confirmation email with the time and joining details is on its way to you.</p>
        <p class="body-sm">Need to change it? Use the reschedule link in that email.</p>
      </div>
      ${bookingProvider === 'calendly'
        ? `<div class="booking__embed calendly-inline-widget" id="bookingEmbed" data-url="${esc(calendlyUrl())}"></div>`
        : `<div class="booking__embed" id="bookingEmbed"></div>`}
      <noscript><p class="body-sm">The calendar needs JavaScript. <a class="alink" href="${esc(site.booking || '/contact')}">Open the booking page</a></p></noscript>
    </div>`;

/* ========================= BOOK =========================
   Generated only when site.booking is set. Availability, time slots, the
   booking form and the confirmation all come from the scheduling provider
   (Calendly or Cal.com) inside the embed. This page adds nothing it cannot
   verify: the success panel appears only when the provider's own
   "scheduled" event fires. */
export const book = () => `
<section class="phead phead--book">
  <div class="wrap booking">
    <div class="booking__intro">
      <p class="label">Book a call</p>
      <h1 class="h1">${esc(PC.book.heading)}</h1>
      <p class="lead">${esc(PC.book.lead)}</p>
      <div class="sig">
        <span class="sig__img face"><img src="/${site.avatar}" alt="${esc(site.principal)}" width="192" height="192" decoding="async"></span>
        <span class="sig__id"><strong>${esc(site.principal)}</strong><span>${esc(site.principalRole)}, ${esc(site.name)}</span></span>
      </div>
      <div class="btn-row"><p class="body-sm">Prefer to write?</p>${btn('Send an enquiry instead', '/contact', 'primary')}</div>
    </div>

    ${bookingPanel()}
  </div>
</section>
`;

/* ========================= BLOG =========================
   Posts come from content/blog.json (Admin › Blog). */
const postCard = (p) => `
      <li class="post-card glass${p.featuredImage && p.featuredImage.src ? ' post-card--img' : ''}">
        ${p.featuredImage && p.featuredImage.src ? `<a class="post-card__img" href="/blog/${p.slug}" tabindex="-1" aria-hidden="true"><img src="${esc(mediaSrc(p.featuredImage.src))}" alt="" loading="lazy" decoding="async"></a>` : ''}
        <p class="label">${esc(p.category)}</p>
        <h2 class="h4 post-card__t"><a href="/blog/${p.slug}">${esc(p.title)}</a></h2>
        <p class="body-sm">${esc(p.excerpt)}</p>
        <a class="alink post-card__more" href="/blog/${p.slug}" aria-label="Read: ${esc(p.title)}">Read${ico.arrow}</a>
      </li>`;

export const blogIndex = () => `
<div class="work-hero section--glass">${glassBg('blog-bg')}
<section class="phead">
  <div class="wrap">
    <div class="shead shead--flush">
      <p class="label">Blog</p>
      <div class="shead__main"><h1 class="h2">${esc(PC.blog.heading)}</h1></div>
    </div>
  </div>
</section>
<section class="section section--flush-t">
  <div class="wrap">
    <ul class="posts">
      ${posts.map(postCard).join('')}
    </ul>
  </div>
</section>
</div>
`;

export const blogPost = (p) => {
  const { html, toc } = renderBody(p.body);
  const related = posts.filter(x => x.slug !== p.slug && x.category === p.category).slice(0, 2);
  const img = p.featuredImage && p.featuredImage.src;
  const meta = [
    p.author ? esc(p.author) : '',
    p.publishedAt ? `<time datetime="${p.publishedAt}">${fmtDate(p.publishedAt)}</time>` : '',
    p.updatedAt && p.updatedAt > p.publishedAt ? `Updated <time datetime="${p.updatedAt}">${fmtDate(p.updatedAt)}</time>` : '',
    readingTime(p),
  ].filter(Boolean).join('<span aria-hidden="true"> · </span>');
  return `
<article class="post section--glass">${glassBg('blog-bg')}
  <div class="wrap post__in">
    <a class="post__back" href="/blog"><span aria-hidden="true">←</span> Back to all posts</a>
    <div class="post__sheet">
      <p class="label">${esc(p.category)}</p>
      <h1 class="h1 post__t">${esc(p.title)}</h1>
      <p class="post__meta">${meta}</p>
      ${img ? `<figure class="post__hero"><img src="${esc(mediaSrc(img))}" alt="${esc(p.featuredImage.alt || '')}" decoding="async" fetchpriority="high"></figure>` : ''}
      ${p.toc && toc.length > 1 ? `<nav class="post__toc" aria-label="In this article"><p class="label">In this article</p><ol>${toc.map(([l, id, t]) => `<li class="post__toc-${l}"><a href="#${id}">${esc(t)}</a></li>`).join('')}</ol></nav>` : ''}
      <div class="post__body">
        ${html}
      </div>
      ${p.faq && p.faq.length ? `<section class="post__faq" aria-labelledby="faq-h"><h2 id="faq-h">Frequently asked questions</h2>${p.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>` : ''}
      ${p.tags && p.tags.length ? `<ul class="post__tags" aria-label="Tags">${p.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
    </div>
    <aside class="post__cta" aria-label="Get in touch">
      <h2 class="h3">Still doing work that could be automated?</h2>
      <div class="post__cta-row">
        ${btn('Tell Us What’s Taking Your Time', S.enquiryHref(''), 'primary')}
        ${site.booking ? `<a class="alink" href="/contact#book">Or book a quick call${ico.arrow}</a>` : ''}
      </div>
    </aside>
    ${related.length ? `<section class="post__related" aria-label="Related posts"><p class="label">Keep reading</p><ul class="posts">${related.map(postCard).join('')}</ul></section>` : ''}
  </div>
</article>
`;
};

/* ========================= LEGAL ========================= */
export const legalParas = (list) => list.map(t => `<p>${sanitizeInline(t)}</p>`).join('');
export const legal = (title, body) => `
${pageHead({ lines: [title], lead: PC.legal.updated })}
<section class="section section--flush-t">
  <div class="wrap prose">${body}</div>
</section>`;

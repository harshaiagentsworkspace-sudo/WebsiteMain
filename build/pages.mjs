/* ===========================================================================
   OSTENDIC — PAGE COMPOSITIONS
   Section rhythm modelled on the Orbix reference; each page varies its
   composition rather than repeating hero → cards → cards → CTA.
   =========================================================================== */
import {
  site, services, projects, workCategories, engagements, process,
  faqs, resources, resourceCategories, posts, postCategories,
} from './data.mjs';
import {
  esc, ico, eyebrow, btn, alink, head, secHead, statRow, rowList,
  cellGrid, projCard, faqBlock, journeyStrip,
} from './ui.mjs';
import * as S from './sections.mjs';

const clientWork = projects.filter(p => p.kind === 'client');
const flagship = projects[0];

/* ========================= HOME =========================
   Narrative rhythm:
   LIGHT hero → LIGHT trust deck → DARK founder → DARK metrics
   → DARK testimonials → 3D STACK → LIGHT roadmap → GRADIENT collab
   → LIGHT work → LIGHT engagement → LIGHT FAQ → DARK footer
   ======================================================== */
export const home = () => `
${S.hero()}
${S.trustDeck()}
${S.founder()}
${S.credibility()}
${S.testimonialWall()}
${S.stack()}
${S.roadmap()}
${S.collab()}
${S.workStrip()}
${S.insights()}
${S.engagementStrip()}
${faqBlock(faqs.slice(0, 6))}
`;

/* ========================= ABOUT ========================= */
export const about = () => `
<section class="section hero">
  <div class="wrap stack gap-24" style="max-width:var(--max-narrow)">
    ${eyebrow('About Ostendic', 'mark')}
    ${head(['A studio built on', 'showing {the work}'], 'h1', 'h1')}
    <p class="lead">Ostendic takes its name from the Latin <em class="em">ostendere</em> — to show, to hold something out for inspection. That is the whole operating principle: we show what we did and what changed, rather than claiming it.</p>
  </div>
</section>

<section class="section section--flush-t">
  <div class="wrap">
    <div class="grid g2" style="gap:clamp(28px,5vw,64px)">
      <div class="stack gap-16">
        ${head(['What we do'], 'h3', 'h2')}
        <p class="body-sm">${esc(site.sub)}</p>
        <p class="body-sm">${esc(site.differentiator)} A site that looks better but still loses enquiries has not solved anything — so we work across the whole path from first visit to converted customer.</p>
      </div>
      <div class="stack gap-16">
        ${head(['How we work'], 'h3', 'h2')}
        <p class="body-sm">Fixed scope, fixed fee, and a delivery date we commit to. Design and development run in the same team rather than handing off, which is why focused projects land in weeks rather than quarters.</p>
        <p class="body-sm">Every engagement launches with analytics in place and includes two weeks of post-launch tuning, so the first reading of whether it worked is real.</p>
      </div>
    </div>
  </div>
</section>

<section class="section dark">
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'Principles', lines: ['What we will and', 'will {not} do'] })}
    <div class="grid g2" style="gap:24px 48px">
      ${[
        ['Nothing here is invented', 'No borrowed logos, no invented testimonials, no metrics we did not measure. If we cannot stand behind a number, it does not go on the page.'],
        ['Proof before promises', 'Work appears before claims. Client projects are labelled as client projects and demos as demos.'],
        ['AI where it removes work', 'AI earns its place when it takes work away. Everywhere else it adds surface, and we will say so.'],
        ['We will tell you if we are wrong for it', 'If the project is not a fit, you get told early rather than sold to.'],
      ].map(([t, d]) => `
        <div class="stack gap-8">
          <h3 class="h4">${esc(t)}</h3>
          <p class="body-sm">${esc(d)}</p>
        </div>`).join('')}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="grid g2" style="gap:clamp(28px,5vw,64px);align-items:start">
      <div class="stack gap-20">
        ${eyebrow('The principal', 'mark')}
        ${head([site.principal], 'h2', 'h2')}
        <p class="body-sm" style="color:var(--ink-3)">${esc(site.principalRole)}<br>${esc(site.principalBio)}</p>
        <p class="lead">Brand, UI/UX and automation experience across 50+ client engagements. Harsh leads every Ostendic engagement directly — scoping it, designing it and standing behind the result.</p>
        <p class="body-sm">Ostendic works with businesses in ${esc(site.markets.join(', '))}. Delivery is remote, with overlap hours agreed at the start of each engagement.</p>
        <div class="btn-row">${btn('Work with us', '/contact', 'primary')}</div>
      </div>
      <div class="stack gap-20">
        ${rowList([
          { title: 'Brand & UI/UX', meta: 'Positioning, identity, interface' },
          { title: 'Web & product', meta: 'Sites, stores, applications' },
          { title: 'AI & automation', meta: 'The system behind the site' },
          { title: 'Measurement', meta: 'Baseline, launch, tuning' },
        ])}
      </div>
    </div>
  </div>
</section>

${journeyStrip()}
${faqBlock(faqs.slice(0, 5), { eye: 'Questions', lines: ['Things people ask', 'before {starting}'] })}
`;

/* ========================= SERVICES INDEX ========================= */
export const servicesIndex = () => `
<section class="section hero">
  <div class="wrap stack gap-24" style="max-width:var(--max-narrow)">
    ${eyebrow('Services', 'grid')}
    ${head(['Everything between a first', 'visit and a {converted customer}'], 'h1', 'h1')}
    <p class="lead">Ten capabilities across three areas — design, build, and the automation that runs behind them. Most engagements combine several.</p>
    <div class="btn-row">${btn('Start a project', '/contact', 'primary')}${btn('See the work', '/work', 'ghost')}</div>
  </div>
</section>

<section class="section section--flush-t">
  <div class="wrap">
    ${cellGrid(['Brand & identity', 'UI/UX', 'Web development', 'E-commerce', 'SaaS & product', 'MVP builds', 'Dashboards', 'Motion', 'Automation', 'Marketing'], 5)}
  </div>
</section>

<section class="section section--white">
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'Design', lines: ['Making the experience', '{make sense}'], lead: 'Positioning, identity and interface work — the part customers actually judge you on.' })}
    <div class="grid g3">
      ${services.filter(s => ['brand-design', 'ui-ux-design', 'saas-product-design', 'dashboard-design', 'motion-design'].includes(s.slug)).map(s => `
        <a class="card card--link" href="/services/${s.slug}">
          <h3 class="h3">${esc(s.title)}</h3>
          <p class="body-sm" style="color:var(--ink-3)">${esc(s.kicker)}</p>
          <p class="body-sm">${esc(s.lead)}</p>
          <span class="alink mt-8" style="align-self:flex-start">Explore${ico.arrow}</span>
        </a>`).join('')}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'Build', lines: ['Shipping it, on {a date}'], lead: 'Sites, stores and products built fast, measured from launch.' })}
    <div class="grid g3">
      ${services.filter(s => ['web-development', 'ecommerce', 'mvp-development'].includes(s.slug)).map(s => `
        <a class="card card--link" href="/services/${s.slug}">
          <h3 class="h3">${esc(s.title)}</h3>
          <p class="body-sm" style="color:var(--ink-3)">${esc(s.kicker)}</p>
          <p class="body-sm">${esc(s.lead)}</p>
          <span class="alink mt-8" style="align-self:flex-start">Explore${ico.arrow}</span>
        </a>`).join('')}
    </div>
  </div>
</section>

<section class="section dark">
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'Run', lines: ['The system {behind} it'], lead: 'The work that happens after someone fills in the form — and the campaign work that brought them there.' })}
    <div class="grid g2">
      ${services.filter(s => ['ai-automation', 'creative-marketing'].includes(s.slug)).map(s => `
        <a class="card card--link" href="/services/${s.slug}">
          <h3 class="h3">${esc(s.title)}</h3>
          <p class="body-sm" style="color:var(--ink-inv-2)">${esc(s.kicker)}</p>
          <p class="body-sm">${esc(s.lead)}</p>
          <span class="alink mt-8" style="align-self:flex-start">Explore${ico.arrow}</span>
        </a>`).join('')}
    </div>
  </div>
</section>

<section class="section section--white">
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'Process', lines: ['The same four steps,', 'whatever the {service}'], center: true })}
    <div class="grid g4">
      ${process.map(([n, t, d]) => `
        <div class="stack gap-12">
          <span class="body-sm tnum" style="color:var(--ink-3)">${n}</span>
          <h3 class="h4">${esc(t)}</h3>
          <p class="body-sm">${esc(d)}</p>
        </div>`).join('')}
    </div>
  </div>
</section>

${faqBlock(faqs.slice(0, 5), { eye: 'Services FAQ', lines: ['Before you {enquire}'] })}
`;

/* ========================= WORK ========================= */
export const work = () => `
<section class="section hero">
  <div class="wrap stack gap-24" style="max-width:var(--max-narrow)">
    ${eyebrow('Selected work', 'grid')}
    ${head(['What we built, and', 'what {changed}'], 'h1', 'h1')}
    <p class="lead">A small, honest portfolio. Client projects are marked as client projects; demo builds are marked as demos. We do not pad this page.</p>
  </div>
</section>

<section class="section section--flush-t">
  <div class="wrap stack gap-32">
    <div class="chips" role="group" aria-label="Filter work by category" id="workFilter">
      ${workCategories.map((c, i) => `<button class="chip" data-filter="${esc(c)}" aria-pressed="${i === 0}">${esc(c)}</button>`).join('')}
    </div>
    <div class="grid g3" id="workGrid">
      ${projects.map(p => `<div data-cat="${esc(p.category)}">${projCard(p)}</div>`).join('')}
    </div>
    <p class="body-sm" id="workEmpty" style="display:none">No projects in that category yet.</p>
  </div>
</section>

<section class="section dark">
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'Case 01', lines: ['VMS Careline'], lead: flagship.summary })}
    <div class="grid g4">
      ${[['Sector', flagship.sector], ['Market', flagship.market], ['Year', flagship.year], ['Scope', flagship.disciplines.join(', ')]]
        .map(([k, v]) => `<div class="stack gap-8"><span class="body-sm" style="color:var(--ink-inv-2)">${esc(k)}</span><span class="h4">${esc(v)}</span></div>`).join('')}
    </div>
    <hr class="divider">
    <div class="grid g2" style="gap:clamp(28px,4vw,56px)">
      <div class="stack gap-24">
        <div class="stack gap-8"><span class="body-sm" style="color:var(--warn);font-weight:500">01 — Before</span><p class="body-sm">${esc(flagship.before)}</p></div>
        <div class="stack gap-8"><span class="body-sm" style="color:var(--ink-inv-2);font-weight:500">02 — Decision</span><p class="body-sm">${esc(flagship.decision)}</p></div>
      </div>
      <div class="stack gap-24">
        <div class="stack gap-8"><span class="body-sm" style="color:var(--ink-inv-2);font-weight:500">03 — After</span><p class="body-sm">${esc(flagship.after)}</p></div>
        <div class="card" style="border-color:var(--line-dark)">
          <span class="tag" style="align-self:flex-start;border-color:#7FD3C4;color:#7FD3C4">04 — Client-reported</span>
          <p class="body-sm" style="color:var(--ink-inv)">${esc(flagship.result)}</p>
          <p class="body-sm" style="font-size:var(--t-xs)">${esc(flagship.resultNote)}</p>
        </div>
      </div>
    </div>
    <div class="btn-row">${btn('Visit the live site', flagship.url, 'primary')}</div>
  </div>
</section>

${faqBlock(faqs.slice(0, 4), { eye: 'Working together', lines: ['How a project {starts}'] })}
`;

/* ========================= PRICING ========================= */
export const pricing = () => `
<section class="section hero hero--center">
  <div class="wrap stack gap-24" style="align-items:center">
    ${eyebrow('Engagement', 'check')}
    ${head(['Fixed scope. Fixed fee.', 'A date we {hold}.'], 'h1', 'h1')}
    <p class="lead center" style="text-align:center">We scope and price each project rather than publishing a menu. You get the number before you commit, and it does not move unless the scope does.</p>
    <div class="btn-row center">${btn('Get a scope and a price', '/contact', 'primary')}</div>
  </div>
</section>

<section class="section section--flush-t">
  <div class="wrap grid g3">
    ${engagements.map(e => `
      <div class="card"${e.featured ? ' style="border-color:var(--ink);box-shadow:var(--shadow)"' : ''}>
        ${e.featured ? '<span class="tag" style="align-self:flex-start;border-color:var(--ink);color:var(--ink)">Most common</span>' : ''}
        <h3 class="h3">${esc(e.name)}</h3>
        <span class="body-sm" style="color:var(--ink-3)">${esc(e.price)} · ${esc(e.unit)}</span>
        <p class="body-sm">${esc(e.desc)}</p>
        <hr class="divider mt-8">
        <ul class="stack gap-8 mt-8">
          ${e.includes.map(i => `<li class="body-sm" style="display:flex;gap:10px;align-items:flex-start"><span style="color:var(--accent);flex:none;width:15px;margin-top:3px">${ico.check}</span>${esc(i)}</li>`).join('')}
        </ul>
        <div class="btn-row mt-16">${btn(e.cta, '/contact', e.featured ? 'primary' : 'ghost')}</div>
      </div>`).join('')}
  </div>
</section>

<section class="section section--white">
  <div class="wrap stack gap-32">
    ${secHead({ eye: 'What you get', lines: ['What is included, and', 'what {is not}'], center: true })}
    <div class="cellgrid c3" style="border-radius:var(--r-card)">
      ${[
        'Fixed scope, agreed in writing', 'A delivery date we commit to', 'Design and build in one team',
        'Analytics in place at launch', 'Two weeks of post-launch tuning', 'Handover documentation',
        'Direct access to the principal', 'Accessibility-conscious build', 'No hourly billing, ever',
      ].map(t => `<div style="min-height:96px">${esc(t)}</div>`).join('')}
    </div>
    <p class="body-sm center" style="margin-inline:auto;max-width:56ch">Third-party costs — hosting, domains, paid APIs, stock licences — are billed at cost and listed separately in the scope.</p>
  </div>
</section>

${faqBlock(faqs, { eye: 'Pricing FAQ', lines: ['Money, dates', 'and {the small print}'] })}
`;

/* ========================= CONTACT ========================= */
export const contact = () => `
<section class="section hero">
  <div class="wrap">
    <div class="grid g2" style="gap:clamp(32px,5vw,72px);align-items:start">
      <div class="stack gap-24">
        ${eyebrow('Start a project', 'flow')}
        ${head(['Tell us what is', 'not {working}'], 'h1', 'h1')}
        <p class="lead">Share a few details and we will reply within one business day with a scope, a price and an honest answer about whether we are the right fit.</p>
        <hr class="divider">
        <div class="stack gap-16">
          <div class="stack gap-8">
            <span class="body-sm" style="color:var(--ink-3)">Email</span>
            <a class="alink" style="align-self:flex-start" href="mailto:${site.email}">${site.email}${ico.arrow}</a>
          </div>
          <div class="stack gap-8">
            <span class="body-sm" style="color:var(--ink-3)">Working with</span>
            <span class="body-sm" style="color:var(--ink)">${esc(site.markets.join(' · '))}</span>
          </div>
          <div class="stack gap-8">
            <span class="body-sm" style="color:var(--ink-3)">Response time</span>
            <span class="body-sm" style="color:var(--ink)">One business day</span>
          </div>
        </div>
      </div>

      <div class="card" style="padding:clamp(22px,3vw,34px)">
        <h2 class="h3">Project enquiry</h2>
        <p class="body-sm">No sales pitch. We reply within 24 hours.</p>
        <form class="form mt-16" id="leadForm" novalidate>
          <div class="form__row">
            <div class="field" data-req>
              <label for="f-name">Full name *</label>
              <input id="f-name" name="name" type="text" autocomplete="name" placeholder="Your name" required>
              <span class="err">Please enter your name.</span>
            </div>
            <div class="field" data-req>
              <label for="f-email">Email *</label>
              <input id="f-email" name="email" type="email" autocomplete="email" placeholder="you@company.com" required>
              <span class="err">Please enter a valid email address.</span>
            </div>
          </div>
          <div class="form__row">
            <div class="field">
              <label for="f-company">Company</label>
              <input id="f-company" name="company" type="text" autocomplete="organization" placeholder="Company or role">
            </div>
            <div class="field">
              <label for="f-budget">Budget range</label>
              <select id="f-budget" name="budget">
                <option>Not sure yet</option><option>Under $5k</option><option>$5k – $15k</option>
                <option>$15k – $40k</option><option>$40k+</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label for="f-help">What do you need help with?</label>
            <select id="f-help" name="help">
              <option>Not sure — start with a diagnostic</option>
              ${services.map(s => `<option>${esc(s.title)}</option>`).join('')}
            </select>
          </div>
          <div class="field" data-req>
            <label for="f-project">Project details *</label>
            <textarea id="f-project" name="project" placeholder="What is happening now, and what would a good outcome look like?" required minlength="10"></textarea>
            <span class="err">A sentence or two helps a lot.</span>
          </div>
          <div class="form__status" id="formStatus" role="status" aria-live="polite"></div>
          <div class="btn-row">
            <button class="btn btn--primary" type="submit" id="formSubmit">
              <span class="btn-label">Send enquiry</span><span class="btn__ico">${ico.arrow}</span>
            </button>
          </div>
          <p class="form__note">We use your details only to reply to this enquiry.</p>
        </form>
      </div>
    </div>
  </div>
</section>

${journeyStrip()}
${faqBlock(faqs.slice(0, 5), { eye: 'Before you write', lines: ['Common {questions}'] })}
`;

/* ========================= BLOG ========================= */
export const blog = () => `
<section class="section hero">
  <div class="wrap stack gap-24" style="max-width:var(--max-narrow)">
    ${eyebrow('Insights', 'spark')}
    ${head(['Notes on building', 'things that {work}'], 'h1', 'h1')}
    <p class="lead">Working notes on design, build and automation — published as we go rather than written to a content calendar.</p>
  </div>
</section>

<section class="section section--flush-t">
  <div class="wrap stack gap-32">
    <div class="chips" role="group" aria-label="Filter articles">
      ${postCategories.map((c, i) => `<button class="chip" data-filter="${esc(c)}" aria-pressed="${i === 0}" disabled>${esc(c)}</button>`).join('')}
    </div>
    ${posts.length ? `<div class="grid g3">${posts.map(p => `<article class="card"><h3 class="h3">${esc(p.title)}</h3></article>`).join('')}</div>` : `
    <div class="card" style="align-items:flex-start;padding:clamp(28px,4vw,48px)">
      <span class="tag">Nothing published yet</span>
      <h2 class="h3 mt-8">The first articles are being written</h2>
      <p class="body-sm" style="max-width:56ch">We would rather publish nothing than publish filler. When the first pieces are ready they will appear here — starting with the working notes from the VMS Careline rebuild.</p>
      <div class="btn-row mt-16">${btn('See the work instead', '/work', 'ghost')}</div>
    </div>`}
  </div>
</section>

<section class="section section--white">
  <div class="wrap stack gap-32">
    ${secHead({ eye: 'Meanwhile', lines: ['Take something {useful}'], lead: 'The resource library has practical material you can use today.' , cta: btn('Browse resources', '/resources', 'ghost')})}
  </div>
</section>
`;

/* ========================= CAREERS ========================= */
export const careers = () => `
<section class="section hero">
  <div class="wrap stack gap-24" style="max-width:var(--max-narrow)">
    ${eyebrow('Careers', 'mark')}
    ${head(['Small studio.', 'High {standards}.'], 'h1', 'h1')}
    <p class="lead">Ostendic is principal-led and deliberately small. We are not running an open hiring process right now — but we do work with a short list of trusted collaborators.</p>
  </div>
</section>

<section class="section section--flush-t">
  <div class="wrap">
    <div class="card" style="align-items:flex-start;padding:clamp(28px,4vw,48px)">
      <span class="tag">Not actively hiring</span>
      <h2 class="h3 mt-8">No open positions at the moment</h2>
      <p class="body-sm" style="max-width:60ch">We would rather say that plainly than list roles that do not exist. If you are a designer, developer or automation specialist whose work would stand up next to ours, send it anyway — collaborator briefs come up regularly and we keep a real list.</p>
      <div class="btn-row mt-16">${btn('Send your work', '/contact', 'primary')}</div>
    </div>
  </div>
</section>

<section class="section section--white">
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'How we work', lines: ['What it is like', 'to {work with us}'] })}
    <div class="grid g3">
      ${[
        ['Direct, not layered', 'You work with the person making decisions. No account managers, no relayed feedback.'],
        ['Scoped, not open-ended', 'Every brief has a defined outcome and a date. Nobody is asked to guess what "done" means.'],
        ['Evidence over opinion', 'Work is judged against what it was supposed to change, not against taste.'],
        ['Remote, with overlap', 'Distributed across our markets, with agreed overlap hours rather than a fixed timezone.'],
        ['Credited properly', 'Collaborators are named in case studies. We do not pass off other people’s work as ours.'],
        ['Paid on time', 'Agreed rate, agreed date, no chasing.'],
      ].map(([t, d]) => `<div class="card"><h3 class="h4">${esc(t)}</h3><p class="body-sm">${esc(d)}</p></div>`).join('')}
    </div>
  </div>
</section>
`;

/* ========================= RESOURCES ========================= */
export const resourcesPage = () => `
<section class="section hero">
  <div class="wrap stack gap-24" style="max-width:var(--max-narrow)">
    ${eyebrow('Resources', 'grid')}
    ${head(['Practical material,', 'free to {take}'], 'h1', 'h1')}
    <p class="lead">Frameworks and templates we actually use. No email wall on the free material.</p>
  </div>
</section>

<section class="section section--flush-t">
  <div class="wrap stack gap-32">
    <div class="chips" role="group" aria-label="Filter resources" id="resFilter">
      ${resourceCategories.map((c, i) => `<button class="chip" data-filter="${esc(c)}" aria-pressed="${i === 0}">${esc(c)}</button>`).join('')}
    </div>
    <div class="grid g3" id="resGrid">
      ${resources.map(r => `
        <div data-cat="${esc(r.cat)}">
          <a class="card card--link" href="/${encodeURI(r.href)}" download style="height:100%">
            <div class="proj__meta">
              <span class="tag tag--live">${esc(r.price)}</span>
              <span>${esc(r.cat)}</span><span class="dot"></span><span>${esc(r.format)}</span>
            </div>
            <h3 class="h3">${esc(r.title)}</h3>
            <p class="body-sm">${esc(r.desc)}</p>
            <span class="alink mt-8" style="align-self:flex-start">Download${ico.arrow}</span>
          </a>
        </div>`).join('')}
      <div class="card is-placeholder" style="border-style:dashed;justify-content:center;align-items:flex-start">
        <span class="tag">In progress</span>
        <h3 class="h4 mt-8">More resources coming</h3>
        <p class="body-sm">Templates and checklists from live engagements are added as they are cleared for publication.</p>
      </div>
    </div>
    <p class="body-sm" id="resEmpty" style="display:none">Nothing in that category yet.</p>
  </div>
</section>

${faqBlock(faqs.slice(0, 4), { eye: 'Resources', lines: ['About these {materials}'] })}
`;

/* ========================= SERVICE DETAIL (reusable) ========================= */
export const serviceDetail = (s) => {
  const related = services.filter(x => x.slug !== s.slug).slice(0, 3);
  return `
<section class="section hero">
  <div class="wrap">
    <div class="hero__grid">
      <div class="hero__stack">
        ${eyebrow(s.title, 'spark')}
        ${head(s.hero.map((l, i) => i === 1 ? `{${l}}` : l), 'h1', 'h1')}
        <p class="lead">${esc(s.lead)}</p>
        <div class="btn-row">
          ${btn('Start a project', '/contact', 'primary')}
          ${btn('See the work', '/work', 'ghost')}
        </div>
        <p class="body-sm">${esc(s.kicker)} · Led by ${esc(site.principal)}</p>
      </div>
      <div class="hero__media">
        <img src="/${flagship.image}" alt="Example of Ostendic ${esc(s.title.toLowerCase())} work" loading="lazy" width="1200" height="750">
      </div>
    </div>
  </div>
</section>

<section class="section section--flush-t section--sm">
  <div class="wrap">${cellGrid(s.capabilities, 3)}</div>
</section>

<section class="section section--white">
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'The problem', lines: ['Signs this is', 'what is {holding you back}'], center: true })}
    <div class="grid g2" style="gap:24px 48px">
      ${s.problems.map(([t, d]) => `
        <div class="stack gap-8">
          <h3 class="h4">${esc(t)}</h3>
          <p class="body-sm">${esc(d)}</p>
        </div>`).join('')}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="grid g2" style="gap:clamp(28px,5vw,64px);align-items:start">
      <div class="stack gap-20">
        ${eyebrow('What we do', 'grid')}
        ${head(['What is {included}'], 'h2', 'h2')}
        <p class="lead">${esc(s.outcome)}</p>
        <div class="btn-row">${btn('Scope this work', '/contact', 'primary')}</div>
      </div>
      ${rowList(s.capabilities.map(c => ({ title: c })))}
    </div>
  </div>
</section>

<section class="section dark">
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'How we work', lines: ['Four steps, one {team}'] })}
    <div class="grid g4">
      ${process.map(([n, t, d]) => `
        <div class="stack gap-12">
          <span class="body-sm tnum" style="color:var(--ink-inv-2)">${n}</span>
          <h3 class="h4">${esc(t)}</h3>
          <p class="body-sm">${esc(d)}</p>
        </div>`).join('')}
    </div>
  </div>
</section>

<section class="section section--white">
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'Related work', lines: ['Where this has {shipped}'], cta: btn('All work', '/work', 'ghost') })}
    <div class="grid g3">${projects.map(projCard).join('')}</div>
  </div>
</section>

<section class="section">
  <div class="wrap stack gap-32">
    ${secHead({ eye: 'Related services', lines: ['Often {combined with}'] })}
    <div class="grid g3">
      ${related.map(r => `
        <a class="card card--link" href="/services/${r.slug}">
          <h3 class="h4">${esc(r.title)}</h3>
          <p class="body-sm">${esc(r.kicker)}</p>
          <span class="alink mt-8" style="align-self:flex-start">Explore${ico.arrow}</span>
        </a>`).join('')}
    </div>
  </div>
</section>

${faqBlock(faqs.slice(0, 5), { eye: 'Questions', lines: ['Before you {enquire}'] })}
`;
};

/* ========================= CASE DETAIL ========================= */
export const caseDetail = (p) => `
<section class="section hero">
  <div class="wrap stack gap-24" style="max-width:var(--max-narrow)">
    ${eyebrow(p.kind === 'client' ? 'Client project' : 'Demo build', 'mark')}
    ${head([p.name], 'h1', 'h1')}
    <p class="lead">${esc(p.summary)}</p>
    <div class="btn-row">${btn('Visit the live site', p.url, 'primary')}${btn('All work', '/work', 'ghost')}</div>
  </div>
</section>

<section class="section section--flush-t section--sm">
  <div class="wrap">
    ${p.image ? `<div class="proj__media" style="aspect-ratio:16/9;border-radius:var(--r-lg)">
      <img src="/${p.image}" alt="${esc(p.name)} — ${esc(p.summary)}" width="1600" height="900"></div>` : ''}
    <div class="grid g4 mt-32">
      ${[['Sector', p.sector], ['Market', p.market], ['Year', p.year], ['Scope', p.disciplines.join(', ')]]
        .map(([k, v]) => `<div class="stack gap-8"><span class="body-sm" style="color:var(--ink-3)">${esc(k)}</span><span class="h4">${esc(v)}</span></div>`).join('')}
    </div>
  </div>
</section>

${p.before ? `
<section class="section section--white">
  <div class="wrap stack gap-32" style="max-width:var(--max-narrow)">
    <div class="stack gap-8"><span class="body-sm" style="color:var(--warn);font-weight:500">01 — Before</span><p class="lead" style="color:var(--ink)">${esc(p.before)}</p></div>
    <hr class="divider">
    <div class="stack gap-8"><span class="body-sm" style="color:var(--ink-3);font-weight:500">02 — Decision</span><p class="lead" style="color:var(--ink)">${esc(p.decision)}</p></div>
    <hr class="divider">
    <div class="stack gap-8"><span class="body-sm" style="color:var(--ink-3);font-weight:500">03 — After</span><p class="lead" style="color:var(--ink)">${esc(p.after)}</p></div>
  </div>
</section>

<section class="section dark">
  <div class="wrap stack gap-24" style="max-width:var(--max-narrow)">
    <span class="tag" style="align-self:flex-start;border-color:#7FD3C4;color:#7FD3C4">04 — Result · Client-reported</span>
    ${head([p.result], 'h3', 'h2')}
    <p class="body-sm">${esc(p.resultNote)}</p>
  </div>
</section>` : `
<section class="section section--white">
  <div class="wrap" style="max-width:var(--max-narrow)">
    <div class="card is-placeholder" style="border-style:dashed">
      <span class="tag tag--demo">Demo build</span>
      <p class="body-sm">This is a demonstration project rather than client work — built to show the approach. It is labelled as such deliberately.</p>
    </div>
  </div>
</section>`}

${faqBlock(faqs.slice(0, 4), { eye: 'Working together', lines: ['How a project {starts}'] })}
`;

/* ========================= LEGAL ========================= */
export const legal = (title, body) => `
<section class="section hero">
  <div class="wrap stack gap-20" style="max-width:var(--max-narrow)">
    ${eyebrow('Legal', 'mark')}
    ${head([title], 'h1', 'h1')}
    <p class="body-sm">Last updated 15 September 2026.</p>
  </div>
</section>
<section class="section section--flush-t">
  <div class="wrap stack gap-20" style="max-width:var(--max-narrow)">${body}</div>
</section>`;

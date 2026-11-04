/* ===========================================================================
   OSTENDIC — PAGE COMPOSITIONS
   Section rhythm modelled on the Orbix reference; each page varies its
   composition rather than repeating hero → cards → cards → CTA.
   =========================================================================== */
import {
  site, cta, pillars, process, processHead, pov, aboutCopy, finalCta, signature,
  audiences, projects, workCategories, engagements,
  resources, resourceCategories, posts, postCategories,
} from './data.mjs';
import { esc, ico, eyebrow, btn, head, secHead, rowList } from './ui.mjs';
import * as S from './sections.mjs';

/* ========================= HOME =========================
   Narrative rhythm:
   LIGHT hero → DARK client deck → WHITE intro → 3D PILLAR STACK
   → WHITE what we build → GRADIENT signature outcome → WHITE process
   → DARK point of view → DARK founder / about → WHITE insights
   → DARK footer with the final CTA and founder card

   Point of view and the founder run flush into one another so the
   position and the person behind it read as one passage.
   ======================================================== */
export const home = () => `
${S.hero()}
${S.logoWall()}
${S.introBlock()}
${S.servicesStack()}
${S.whoWeHelp()}
${S.signatureOutcome()}
${S.roadmap()}
${S.pointOfView()}
${S.founderSignature()}
${S.insights()}
`;

/* ========================= ABOUT ========================= */
export const about = () => `
<section class="section hero">
  <div class="wrap stack gap-24" style="max-width:var(--max-narrow)">
    ${eyebrow('About Ostendic', 'mark')}
    ${head(aboutCopy.lines, 'h1', 'h1')}
    <p class="lead">${esc(aboutCopy.body[0])}</p>
  </div>
</section>

<section class="section section--flush-t">
  <div class="wrap">
    <div class="grid g2" style="gap:clamp(28px,5vw,64px)">
      <div class="stack gap-16">
        ${head(['The goal'], 'h3', 'h2')}
        <p class="body-sm">${esc(aboutCopy.body[1])}</p>
        <p class="body-sm">${esc(aboutCopy.body[2])}</p>
      </div>
      <div class="stack gap-16">
        ${head(['The approach'], 'h3', 'h2')}
        <p class="body-sm">${esc(site.sub)}</p>
        <p class="body-sm">${esc(site.approach)}</p>
      </div>
    </div>
  </div>
</section>

<section class="section dark">
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'Point of view', lines: pov.lines })}
    <div class="grid g3" style="gap:24px 48px">
      ${pov.body.map(p => `<p class="body-sm">${esc(p)}</p>`).join('')}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="grid g2" style="gap:clamp(28px,5vw,64px);align-items:start">
      <div class="stack gap-20">
        ${eyebrow('The founder', 'mark')}
        ${head([site.principal], 'h2', 'h2')}
        <p class="body-sm" style="color:var(--ink-3)">${esc(site.principalRole)}<br>${esc(site.principalBio)}</p>
        <p class="lead">${esc(aboutCopy.body[0])}</p>
        <p class="body-sm">Ostendic works with businesses in ${esc(site.markets.join(', '))}. Delivery is remote, with overlap hours agreed at the start of each engagement.</p>
        <div class="btn-row">${btn(cta.primary, '/contact', 'primary', { avatar: true })}</div>
      </div>
      <div class="stack gap-20">
        ${rowList([...pillars.map(s => ({ title: s.title, href: s.path })), { title: 'Selected work', href: '/work' }])}
      </div>
    </div>
  </div>
</section>

<section class="section section--white">
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'How we work', lines: processHead, center: true })}
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
`;

/* ========================= CONTACT ========================= */
export const contact = () => `
<section class="section hero">
  <div class="wrap">
    <div class="grid g2" style="gap:clamp(32px,5vw,72px);align-items:start">
      <div class="stack gap-24">
        ${eyebrow('Contact us', 'flow')}
        ${head(['Tell us what you', 'want to {build.}'], 'h1', 'h1')}
        <p class="lead">${esc(finalCta.body[0])} ${esc(finalCta.body[1])}</p>
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
        <h2 class="h3">${esc(cta.primary)}</h2>
        <p class="body-sm">A website, a product, an AI workflow or a mix — no sales pitch. We reply within one business day.</p>
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
            <label for="f-help">What would you like help with?</label>
            <select id="f-help" name="help">
              <option>Not sure yet — start with a conversation</option>
              ${pillars.map(s => `<option>${esc(s.title)}</option>`).join('')}
              <option>Both — a website or product with AI workflows</option>
            </select>
          </div>
          <div class="field" data-req>
            <label for="f-project">What would you like to talk about? *</label>
            <textarea id="f-project" name="project" placeholder="What would you like to build or improve, and what would a good outcome look like?" required minlength="10"></textarea>
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
`;

/* ========================= BLOG ========================= */
export const blog = () => `
<section class="section hero">
  <div class="wrap stack gap-24" style="max-width:var(--max-narrow)">
    ${eyebrow('Insights', 'spark')}
    ${head(['Notes on better websites', 'and {smarter systems}'], 'h1', 'h1')}
    <p class="lead">Working notes on web development, UI/UX design and agentic AI workflows — published as we go rather than written to a content calendar.</p>
  </div>
</section>

<section class="section section--flush-t">
  <div class="wrap stack gap-32">
    <div class="chips" role="group" aria-label="Filter articles">
      ${postCategories.map((c, i) => `<button class="chip" data-filter="${esc(c)}" aria-pressed="${i === 0}" disabled>${esc(c)}</button>`).join('')}
    </div>
    ${posts.length ? `<div class="grid g3">${posts.map(p => `<article class="card"><span class="tag" style="align-self:flex-start">${esc(p.cat)}</span><h3 class="h3">${esc(p.title)}</h3><p class="body-sm">${esc(p.desc)}</p></article>`).join('')}</div>` : `
    <div class="card" style="align-items:flex-start;padding:clamp(28px,4vw,48px)">
      <span class="tag">Nothing published yet</span>
      <h2 class="h3 mt-8">The first articles are being written</h2>
      <p class="body-sm" style="max-width:56ch">We would rather publish nothing than publish filler. When the first pieces are ready they will appear here.</p>
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
    ${head(['Small team.', 'High {standards}.'], 'h1', 'h1')}
    <p class="lead">Ostendic is founder-led and deliberately small. We are not running an open hiring process right now — but we do work with a short list of trusted collaborators.</p>
  </div>
</section>

<section class="section section--flush-t">
  <div class="wrap">
    <div class="card" style="align-items:flex-start;padding:clamp(28px,4vw,48px)">
      <span class="tag">Not actively hiring</span>
      <h2 class="h3 mt-8">No open positions at the moment</h2>
      <p class="body-sm" style="max-width:60ch">We would rather say that plainly than list roles that do not exist. If you work in UI/UX design, web development or AI workflow engineering and your work would stand up next to ours, send it anyway — collaborator briefs come up regularly and we keep a real list.</p>
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
        ['Scoped, not open-ended', 'Every brief has a defined outcome. Nobody is asked to guess what "done" means.'],
        ['Evidence over opinion', 'Work is judged against what it was supposed to change, not against taste.'],
        ['Remote, with overlap', 'Distributed across our markets, with agreed overlap hours rather than a fixed timezone.'],
        ['Credited properly', 'Collaborators are credited for their work. We do not pass off other people’s work as ours.'],
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
      <div class="card" style="border-style:dashed;justify-content:center;align-items:flex-start">
        <span class="tag">In progress</span>
        <h3 class="h4 mt-8">More resources coming</h3>
        <p class="body-sm">Templates and checklists from live engagements are added as they are cleared for publication.</p>
      </div>
    </div>
    <p class="body-sm" id="resEmpty" style="display:none">Nothing in that category yet.</p>
  </div>
</section>
`;

/* ========================= WORK CARD =========================
   Client projects link to their case section on /work; Ostendic-built
   demonstrations link to the live demo and are labelled as demo builds. */
const projCard = (p) => {
  const client = p.kind === 'client';
  const href = client ? `/work#${p.slug}` : p.url;
  return `
  <a class="proj card--link" href="${href}"${client ? '' : ' target="_blank" rel="noopener"'} style="background:none;border:0;padding:0">
    <div class="proj__media"><img src="/${p.image}" alt="${esc(p.name)} — ${esc(p.summary)}" loading="lazy" width="1200" height="750"></div>
    <div class="stack gap-8">
      <div class="proj__meta">
        <span class="tag${client ? ' tag--live' : ''}">${client ? 'Client project' : 'Demo build'}</span>
        <span>${esc(p.category)}</span><span class="dot"></span><span>${esc(p.year)}</span>
      </div>
      <h3 class="h3">${esc(p.name)}</h3>
      <p class="body-sm">${esc(p.summary)}</p>
      <div class="proj__tags">${p.disciplines.map(d => `<span class="tag">${esc(d)}</span>`).join('')}</div>
    </div>
  </a>`;
};

/* ========================= SERVICES =========================
   Overview of both pillars, then one page per pillar. */
const pillarCard = (s) => `
  <a class="card card--link pillar pillar--${s.slug}" href="${s.path}">
    <span class="pillar__n tnum">Pillar ${s.n}</span>
    <h3 class="h3">${esc(s.title)}</h3>
    <p class="body-sm">${esc(s.desc)}</p>
    <ul class="pillar__list">${s.focus.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
    <span class="alink mt-8" style="align-self:flex-start">Explore ${esc(s.short)}${ico.arrow}</span>
  </a>`;

const processGrid = () => `
<section class="section section--white">
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'How we work', lines: processHead, center: true })}
    <div class="grid g4">
      ${process.map(([n, t, d]) => `
        <div class="stack gap-12">
          <span class="body-sm tnum" style="color:var(--ink-3)">${n}</span>
          <h3 class="h4">${esc(t)}</h3>
          <p class="body-sm">${esc(d)}</p>
        </div>`).join('')}
    </div>
  </div>
</section>`;

export const servicesIndex = () => `
<section class="section hero">
  <div class="wrap stack gap-24" style="max-width:var(--max-narrow)">
    ${eyebrow('Services', 'grid')}
    ${head(['Web development, UI/UX design', 'and {agentic AI workflows.}'], 'h1', 'h1')}
    <p class="lead">${esc(site.sub)}</p>
    <div class="btn-row">${btn(cta.primary, '/contact', 'primary', { avatar: true })}${btn('See our work', '/work', 'ghost')}</div>
  </div>
</section>

<section class="section section--flush-t">
  <div class="wrap grid g2" style="gap:clamp(16px,2vw,28px)">
    ${pillars.map(pillarCard).join('')}
  </div>
</section>

<section class="section collab">
  <div class="wrap">
    <div class="grid g2" style="gap:clamp(32px,5vw,72px);align-items:center">
      <div class="stack gap-24">
        ${eyebrow('Better together', 'flow')}
        ${head(signature.lines, 'h2', 'h2')}
        <p class="lead">${esc(site.approach)}</p>
      </div>
      <div class="chatwin">
        <div class="chatwin__bar"><i></i><i></i><i></i><span>What you can come to us for</span></div>
        ${audiences.map((a, i) => `<p class="msg ${i % 2 ? 'msg--us' : 'msg--them'}"><strong>${esc(a.title)}.</strong> ${esc(a.desc)}</p>`).join('')}
      </div>
    </div>
  </div>
</section>

${processGrid()}
`;

export const pillarPage = (s) => {
  const other = pillars.find(p => p.slug !== s.slug);
  const work = projects.filter(p => p.pillars.includes(s.slug));
  return `
<section class="section hero">
  <div class="wrap stack gap-24" style="max-width:var(--max-narrow)">
    ${eyebrow(`Pillar ${s.n} · Services`, s.icon)}
    ${head([s.title], 'h1', 'h1')}
    <p class="lead">${esc(s.desc)}</p>
    <div class="btn-row">${btn(cta.primary, '/contact', 'primary', { avatar: true })}${btn('All services', '/services', 'ghost')}</div>
  </div>
</section>

<section class="section section--flush-t">
  <div class="wrap">
    <div class="grid g2" style="gap:clamp(28px,5vw,64px)">
      <p class="xpt__say">${esc(s.kicker)}.</p>
      <div class="stack gap-16">${s.long.map(p => `<p class="body-sm">${esc(p)}</p>`).join('')}</div>
    </div>
  </div>
</section>

<section class="section section--white">
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'What we do', lines: ['What this pillar {covers}'] })}
    <div class="grid g2">
      ${s.services.map(([t, d], i) => `
        <article class="card">
          <span class="body-sm tnum" style="color:var(--ink-3)">${String(i + 1).padStart(2, '0')}</span>
          <h3 class="h4">${esc(t)}</h3>
          <p class="body-sm">${esc(d)}</p>
        </article>`).join('')}
    </div>
  </div>
</section>

<section class="section dark">
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'How we approach it', lines: pov.lines })}
    <div class="grid g3" style="gap:24px 48px">
      ${s.principles.map(([t, d]) => `<div class="stack gap-12"><h3 class="h4" style="color:var(--ink-inv)">${esc(t)}</h3><p class="body-sm">${esc(d)}</p></div>`).join('')}
    </div>
  </div>
</section>

${work.length ? `
<section class="section">
  <div class="wrap stack gap-32">
    ${secHead({ eye: 'Related work', lines: ['Where we have {applied this}'], cta: btn('All work', '/work', 'ghost') })}
    <div class="grid g3">${work.map(projCard).join('')}</div>
  </div>
</section>` : ''}

${processGrid()}

<section class="section section--sm">
  <div class="wrap stack gap-24">
    ${eyebrow('The other pillar', 'flow')}
    ${pillarCard(other)}
  </div>
</section>
`;
};

/* ========================= WORK =========================
   Client projects are marked as client projects; Ostendic-built
   demonstrations are marked as demo builds. Nothing is padded. */
export const work = () => {
  const f = projects.find(p => p.kind === 'client');
  return `
<section class="section hero">
  <div class="wrap stack gap-24" style="max-width:var(--max-narrow)">
    ${eyebrow('Selected work', 'grid')}
    ${head(['What we built, and', 'what it {does}'], 'h1', 'h1')}
    <p class="lead">A small, honest portfolio across website development, e-commerce, UI/UX design and automation. Client projects are marked as client projects; demo builds are marked as demos.</p>
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

<section class="section dark" id="${f.slug}">
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'Client project', lines: [f.name], lead: f.summary })}
    <div class="grid g4">
      ${[['Sector', f.sector], ['Market', f.market], ['Year', f.year], ['Scope', f.disciplines.join(', ')]]
        .map(([k, v]) => `<div class="stack gap-8"><span class="body-sm" style="color:var(--ink-inv-2)">${esc(k)}</span><span class="h4">${esc(v)}</span></div>`).join('')}
    </div>
    <hr class="divider">
    <div class="grid g3" style="gap:clamp(28px,4vw,56px)">
      <div class="stack gap-8"><span class="body-sm" style="color:var(--ink-inv-2);font-weight:500">01 — Before</span><p class="body-sm">${esc(f.before)}</p></div>
      <div class="stack gap-8"><span class="body-sm" style="color:var(--ink-inv-2);font-weight:500">02 — Approach</span><p class="body-sm">${esc(f.decision)}</p></div>
      <div class="stack gap-8"><span class="body-sm" style="color:var(--ink-inv-2);font-weight:500">03 — Delivered</span><p class="body-sm">${esc(f.after)}</p></div>
    </div>
    <div class="btn-row">${btn('Visit the live site', f.url, 'primary')}</div>
  </div>
</section>

<section class="section section--white">
  <div class="wrap stack gap-32">
    ${secHead({ eye: 'Your project', lines: ['Have something', 'in mind to {build?}'], lead: finalCta.body[0], cta: btn(cta.primary, '/contact', 'primary', { avatar: true }) })}
  </div>
</section>
`;
};

/* ========================= PRICING =========================
   Engagement models only. No figures, durations or guarantees are
   published — every engagement is scoped and priced before it starts. */
export const pricing = () => `
<section class="section hero hero--center">
  <div class="wrap stack gap-24" style="align-items:center">
    ${eyebrow('Pricing', 'check')}
    ${head(['Scoped to the work.', 'Priced {before you commit.}'], 'h1', 'h1')}
    <p class="lead" style="text-align:center;max-width:62ch">Every project is different, so we scope and price each one rather than publishing a menu. Whether you need a website, UI/UX design, an agentic AI workflow or a combination, you get a clear scope and a fixed price before anything starts.</p>
    <div class="btn-row center">${btn(cta.primary, '/contact', 'primary', { avatar: true })}</div>
  </div>
</section>

<section class="section section--flush-t">
  <div class="wrap grid g3">
    ${engagements.map(e => `
      <div class="card"${e.featured ? ' style="border-color:var(--ink);box-shadow:var(--shadow)"' : ''}>
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
    ${secHead({ eye: 'What you can come to us for', lines: ['A website, a workflow,', '{or both.}'], center: true })}
    <div class="grid g4">
      ${audiences.map(a => `<div class="card"><span class="pillar__ico">${ico[a.icon]}</span><h3 class="h4">${esc(a.title)}</h3><p class="body-sm">${esc(a.desc)}</p></div>`).join('')}
    </div>
    <p class="body-sm" style="margin-inline:auto;max-width:56ch;text-align:center">Third-party costs — hosting, domains, platform subscriptions and paid APIs — are listed separately in the scope.</p>
  </div>
</section>
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

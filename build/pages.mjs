/* ===========================================================================
   OSTENDIC — PAGE COMPOSITIONS
   Section rhythm modelled on the Orbix reference; each page varies its
   composition rather than repeating hero → cards → cards → CTA.
   =========================================================================== */
import {
  site, cta, services, process, pov, aboutCopy, finalCta,
  resources, resourceCategories, posts, postCategories,
} from './data.mjs';
import { esc, ico, eyebrow, btn, head, secHead, rowList } from './ui.mjs';
import * as S from './sections.mjs';

/* ========================= HOME =========================
   Narrative rhythm:
   LIGHT hero → DARK client deck → WHITE intro → 3D SERVICES STACK
   → WHITE who we help → GRADIENT signature outcome → WHITE process
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
        <p class="body-sm">${esc(site.mechanism)}</p>
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
        ${rowList(services.map(s => ({ title: s.title, href: '/#what-we-do' })))}
      </div>
    </div>
  </div>
</section>

<section class="section section--white">
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'How it works', lines: ['A practical approach', 'to {AI adoption.}'], center: true })}
    <div class="grid g5">
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
        ${eyebrow('Book a conversation', 'flow')}
        ${head(['Start an AI', '{conversation.}'], 'h1', 'h1')}
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
        <p class="body-sm">No sales pitch. We reply within one business day.</p>
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
              ${services.map(s => `<option>${esc(s.title)}</option>`).join('')}
            </select>
          </div>
          <div class="field" data-req>
            <label for="f-project">What would you like to talk about? *</label>
            <textarea id="f-project" name="project" placeholder="Where is time being lost, and what would a good outcome look like?" required minlength="10"></textarea>
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
    ${head(['Notes on using', 'AI {with purpose}'], 'h1', 'h1')}
    <p class="lead">Working notes on AI strategy, team training and workflow design — published as we go rather than written to a content calendar.</p>
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
      <p class="body-sm" style="max-width:60ch">We would rather say that plainly than list roles that do not exist. If you work in AI strategy, training or workflow design and your work would stand up next to ours, send it anyway — collaborator briefs come up regularly and we keep a real list.</p>
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

/* ===========================================================================
   OSTENDIC — MOTION-LED SECTION LIBRARY
   Scroll-driven and depth components used by the homepage narrative.
   Everything renders readable without JS; motion.js enhances it.
   =========================================================================== */
import { site, services, projects, process, engagements, testimonials, posts } from './data.mjs';
import { esc, ico, eyebrow, btn, head, secHead } from './ui.mjs';

const flagship = projects[0];

/* faint structural guides at the container edges */
export const guides = () => '<span class="gline" style="left:max(var(--pad-x),calc((100% - var(--max))/2 + var(--pad-x)))"></span>' +
  '<span class="gline" style="right:max(var(--pad-x),calc((100% - var(--max))/2 + var(--pad-x)))"></span>';

/* ---------- 1. HERO ---------- */
export const hero = () => `
<section class="section hero hero--center guides" style="padding-top:clamp(56px,7vw,110px)">
  ${guides()}
  <div class="wrap stack gap-24" style="align-items:center;position:relative;z-index:1">
    ${eyebrow('Digital studio · Brand, web & automation', 'spark')}
    ${head(['Ostendic builds better digital', 'experiences for businesses', '{ready to grow}'], 'display', 'h1')}
    <p class="lead" style="text-align:center;max-width:52ch">${esc(site.sub)}</p>
    <div class="btn-row center" style="margin-top:8px">
      ${btn('Book a 30-minute call', '/contact', 'primary')}
      <a class="btn btn--ghost" href="${site.whatsapp}" target="_blank" rel="noopener">
        <span class="btn__lead">${ico.whatsapp}</span>
        <span class="btn-label">Chat on WhatsApp</span>
        <span class="btn__ico">${ico.arrow}</span>
      </a>
    </div>
    <p class="body-sm" style="margin-top:10px">Led by ${esc(site.principal)} · ${esc(site.principalBio)} · ${esc(site.markets.join(' · '))}</p>
  </div>
</section>`;

/* ---------- 2. TRUST DECK (infinite staggered flip) ---------- */
export const trustDeck = () => {
  /* Every face below is true. Fronts are disciplines we deliver; backs say
     where that discipline has actually shipped. No invented client logos. */
  const cards = [
    ['Brand &amp; identity', 'Structure + system', 'Shipped', 'VMS Careline'],
    ['UI/UX design', 'Journeys + interfaces', 'Shipped', 'VMS Careline'],
    ['Web development', 'Fast, measured builds', 'Shipped', 'VMS Careline'],
    ['E-commerce', 'Discovery → checkout', 'Shipped', 'VMS Cart'],
    ['AI &amp; automation', 'Enquiry → follow-up', 'Live', 'Lead handling'],
  ];
  return `
<section class="section section--sm section--white" data-deck>
  <div class="wrap stack gap-32">
    <p class="body-sm center" style="text-align:center;margin-inline:auto">What we do, and where it has shipped</p>
    <div class="deck">
      ${cards.map(([k, s, bk, bs]) => `
        <div class="flip">
          <div class="flip__f"><span class="flip__k">${k}</span><span class="flip__s">${s}</span></div>
          <div class="flip__b"><span class="flip__k">${bk}</span><span class="flip__s">${bs}</span></div>
        </div>`).join('')}
    </div>
  </div>
</section>`;
};

/* ---------- 3. FOUNDER / POSITIONING ---------- */
export const founder = () => `
<section class="section dark" data-rv>
  <div class="wrap founder">
    <div class="founder__media">
      <img src="/${site.principalImage}" alt="${esc(site.principal)}, ${esc(site.principalRole)} of ${esc(site.name)}"
           width="800" height="800" loading="lazy">
      <div class="founder__badge">
        <div class="h4" style="color:var(--ink-inv)">${esc(site.principal)}</div>
        <div class="body-sm" style="color:var(--ink-inv-2);margin-top:2px">${esc(site.principalRole)} · ${esc(site.principalBio)}</div>
      </div>
    </div>
    <div class="stack gap-24">
      ${eyebrow('Who you are working with', 'mark')}
      <p class="founder__q">${esc(site.differentiator.split('. ')[0])}. <em class="em">We make the system around it work better.</em></p>
      <p class="lead">A website that looks better but still loses enquiries has not solved anything. Ostendic works across the whole path — positioning, interface, build, and the automation that runs after someone fills in the form.</p>
      <p class="body-sm">Every engagement is led directly by ${esc(site.principal)}. You talk to the person making the decisions, not an account manager relaying them.</p>
      <div class="btn-row">${btn('About the studio', '/about', 'ghost')}</div>
    </div>
  </div>
</section>`;

/* ---------- 4. CREDIBILITY (qualitative — no invented numbers) ---------- */
export const credibility = () => {
  const items = [
    [ico.mark, '50+', 'Client engagements across Harsh’s career in brand, UI/UX and automation'],
    [ico.flow, 'End to end', 'Brand, interface, build and automation delivered by one team'],
    [ico.check, 'Fixed date', 'Scope, fee and delivery date agreed before work starts'],
    [ico.spark, '4 markets', site.markets.join(', ')],
  ];
  return `
<section class="section dark section--flush-t" data-rv>
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'Credibility', lines: ['What we can', 'actually {stand behind}'],
      lead: 'No borrowed logos and no invented metrics. These are the things we will put in writing.' })}
    <div class="metrics">
      ${items.map(([i, n, l], k) => {
        /* same component family, four deliberate emphases:
           0 metric-led · 1 phrase-led · 2 commitment-led · 3 coverage-led */
        const mod = ['metric--figure', 'metric--phrase', 'metric--rule', 'metric--list'][k];
        if (k === 3) return `
        <div class="metric ${mod}">
          <span class="metric__i">${i}</span>
          <span class="metric__k">Working across</span>
          <ul class="metric__markets">${site.markets.map(m => `<li>${esc(m)}</li>`).join('')}</ul>
        </div>`;
        return `
        <div class="metric ${mod}">
          <span class="metric__i">${i}</span>
          ${k === 1 ? `<span class="metric__k">How we deliver</span>` : ''}
          <span class="metric__n">${n}</span>
          <span class="metric__l">${esc(l)}</span>
        </div>`;
      }).join('')}
    </div>
    <p class="body-sm" style="color:var(--ink-inv-2)">The 50+ figure is ${esc(site.principal)}’s personal track record, not a studio claim — stated that way deliberately.</p>
  </div>
</section>`;
};

/* ---------- 5. PROOF CARDS (real outcome + real commitments) ---------- */
export const proof = () => {
  /* TEMP-PLACEHOLDER: the first card is a real client-reported outcome.
     The other two are commitments, not testimonials. Replace with real
     attributed client quotes as they are cleared for publication. */
  const cards = [
    { q: flagship.result, n: flagship.name, r: `${flagship.sector} · ${flagship.market}`, av: 'VC', tag: 'Client-reported' },
    { q: 'Fixed scope, fixed fee and a date we commit to. If we miss it and it is our fault, we absorb it.', n: 'How we engage', r: 'Written into every scope', av: '01', tag: 'Commitment' },
    { q: 'Every build launches with analytics in place and two weeks of post-launch tuning, so the first reading is real.', n: 'How we measure', r: 'Included as standard', av: '02', tag: 'Commitment' },
  ];
  return `
<section class="section dark section--flush-t" data-rv>
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'Proof', lines: ['Evidence, not {promises}'],
      lead: 'One client-reported outcome and two commitments you can hold us to. When more results are cleared for publication they replace these.' })}
    <div class="reviews">
      ${cards.map(c => `
        <article class="review">
          <span class="tag" style="border-color:#7FD3C4;color:#7FD3C4">${esc(c.tag)}</span>
          <p class="review__q">${esc(c.q)}</p>
          <div class="review__by">
            <span class="review__av">${esc(c.av)}</span>
            <span><span class="review__n">${esc(c.n)}</span><br><span class="review__r">${esc(c.r)}</span></span>
          </div>
        </article>`).join('')}
    </div>
  </div>
</section>`;
};

/* ---------- 5b. TESTIMONIALS (visibly marked sample content) ---------- */
const stars = (n) =>
  `<span class="stars" role="img" aria-label="${n} out of 5">` +
  Array.from({ length: 5 }, (_, i) =>
    `<svg viewBox="0 0 24 24" aria-hidden="true" class="${i < n ? 'on' : ''}"><path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.45 6.19 20.5 7.3 14.03 2.6 9.45l6.5-.95z"/></svg>`
  ).join('') + '</span>';

export const testimonialWall = () => `
<section class="section dark section--flush-t" data-rv>
  <div class="wrap stack gap-40">
    <div class="tm__head">
      ${secHead({ eye: 'What clients say', lines: ['Working with a studio', 'that {shows its work}'] })}
      <span class="tm__flag">Sample layout · awaiting real quotes</span>
    </div>
    <div class="reviews">
      ${testimonials.map(t => `
        <article class="review">
          ${stars(t.stars)}
          <p class="review__q">${esc(t.quote)}</p>
          <div class="review__by">
            <span class="review__av">${esc(t.initials)}</span>
            <span><span class="review__n">${esc(t.name)}</span><br><span class="review__r">${esc(t.role)}</span></span>
          </div>
        </article>`).join('')}
    </div>
    <p class="body-sm" style="color:var(--ink-inv-2)">These are placeholder entries used to complete the layout — not client endorsements. They are replaced as real, attributed quotes are cleared for publication.</p>
  </div>
</section>`;

/* ---------- 9b. INSIGHTS (editorial) ---------- */
export const insights = () => `
<section class="section section--white" data-rv>
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'Insights', center: true,
      lines: ['Deeper notes, practical tips', 'and {real talk from the studio}'],
      lead: 'Working notes on design, build and automation — written from live engagements rather than to a content calendar.' })}
    <div class="posts">
      ${posts.map(p => `
        <a class="post" href="/blog">
          <div class="post__media">
            <img src="/${p.art}" alt="${esc(p.title)}" loading="lazy" width="1200" height="900">
          </div>
          <div class="post__meta">
            <span class="tag">${esc(p.cat)}</span>
            <span class="dot"></span><span>${esc(p.read)}</span>
            ${p.draft ? '<span class="dot"></span><span class="post__draft">Draft</span>' : ''}
          </div>
          <h3 class="post__t">${esc(p.title)}</h3>
          <p class="body-sm">${esc(p.desc)}</p>
          <span class="alink" style="align-self:flex-start">Read the note${ico.arrow}</span>
        </a>`).join('')}
    </div>
    <div class="btn-row center">${btn('View all insights', '/blog', 'primary')}</div>
  </div>
</section>`;

/* ---------- 6. GRADIENT COLLABORATION ---------- */
export const collab = () => `
<section class="section collab" data-rv>
  <div class="wrap">
    <div class="grid g2" style="gap:clamp(32px,5vw,72px);align-items:center">
      <div class="stack gap-24">
        ${eyebrow('How it actually works', 'flow')}
        ${head(['Close enough to', 'change things {mid-build}'], 'h2', 'h2')}
        <p class="lead">No account managers, no ticket queue, no waiting a week for a reply. You send a note and it reaches the person building the thing.</p>
        <div class="btn-row">${btn('Start a conversation', '/contact', 'primary')}</div>
      </div>
      <div class="chatwin">
        <div class="chatwin__bar"><i></i><i></i><i></i><span>Project channel</span></div>
        <div class="msg msg--them">The category page is live — can we make the product filters clearer?<span class="msg__t">Client · 09:14</span></div>
        <div class="msg msg--us">Yes. I will restructure the filters around the two questions customers actually ask first.<span class="msg__t">Ostendic · 09:21</span></div>
        <div class="msg msg--them">How long?<span class="msg__t">Client · 09:22</span></div>
        <div class="msg msg--us">In the build by Thursday, measured from the following Monday.<span class="msg__t">Ostendic · 09:23</span></div>
      </div>
    </div>
  </div>
</section>`;

/* ---------- 7. 3D CATEGORY STACK ---------- */
export const stack = () => {
  const cats = services.slice(0, 6);
  return `
<section class="section section--flush-b">
  <div class="wrap stack gap-24">
    ${secHead({ eye: 'What we build', lines: ['Six capabilities,', 'one {team}'],
      lead: 'Most engagements combine several. Scroll through them.' })}
  </div>
</section>
<div class="stage" data-stack>
  <div class="stage__pin">
    <div class="stage__inner">
      ${cats.map((s, i) => {
        /* three grid areas so mobile can reorder to head → media → body
           without duplicating the component */
        const kicker = s.kicker.split(' ');
        return `
        <article class="panel">
          <div class="panel__head">
            <span class="panel__n">${String(i + 1).padStart(2, '0')} <span class="panel__n-of">/ ${String(cats.length).padStart(2, '0')}</span></span>
            <h3 class="panel__t">${esc(s.title)}</h3>
            <p class="panel__kick">${esc(kicker.slice(0, -1).join(' '))} <em class="em">${esc(kicker.at(-1))}</em></p>
          </div>
          <div class="panel__media">
            <img src="/${s.art}" alt="${esc(s.title)} — illustrative visual" loading="lazy" width="1200" height="900">
          </div>
          <div class="panel__body">
            <p class="panel__lead">${esc(s.lead)}</p>
            <div class="panel__caps">
              ${s.capabilities.slice(0, 4).map(c => `<span class="tag">${esc(c)}</span>`).join('')}
            </div>
            <div class="btn-row">${btn('Explore ' + s.nav, '/services/' + s.slug, 'ghost')}</div>
          </div>
        </article>`;
      }).join('')}
    </div>
  </div>
</div>`;
};

/* ---------- 8. PROCESS ROADMAP ---------- */
export const roadmap = () => {
  const phases = ['Understand', 'Agree', 'Make', 'Prove'];
  return `
<section class="section section--white" data-road>
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'Our process', lines: ['A short path, because', 'the date is {the product}'],
      lead: 'Four stages. You always know which one you are in and what happens next.' })}
    <div class="road">
      <div class="road__steps">
        <div class="road__rail"><span class="road__fill"></span></div>
        ${process.map(([n, t, d], i) => `
          <div class="step${i === 0 ? ' is-on' : ''}">
            <span class="step__dot"><i></i></span>
            <span class="eyebrow" style="margin-bottom:10px">Step ${n}</span>
            <div class="step__ph">${esc(phases[i] || '')}</div>
            <h3 class="step__t">${esc(t)}</h3>
            <p class="body-sm" style="max-width:48ch">${esc(d)}</p>
          </div>`).join('')}
      </div>
      <div class="road__visuals">
        <div class="road__vwrap">
          ${process.map(([n, t], i) => `
            <div class="road__v${i === 0 ? ' is-on' : ''}">
              <div class="road__frame">
                <span class="panel__n">Step ${n} · ${esc(phases[i] || '')}</span>
                <h3 class="h3">${esc(t)}</h3>
                <hr class="divider">
                <p class="body-sm">${i === 0 ? 'Analytics review, funnel walk-through and a measured baseline before anything is proposed.'
                  : i === 1 ? 'A written scope: what is included, what is not, the fee, and the date we hold.'
                  : i === 2 ? 'Design and build run together, with reviews at the points where a decision actually changes something.'
                  : 'Launch with tracking in place, then two weeks of tuning against what real traffic reveals.'}</p>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>
  </div>
</section>`;
};

/* ---------- 9. EDITORIAL WORK / INSIGHTS ---------- */
export const workStrip = () => `
<section class="section" data-rv>
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'Selected work', lines: ['What we built, and', 'what {changed}'],
      lead: 'Client projects are labelled as client projects. Demo builds are labelled as demos.',
      cta: btn('All work', '/work', 'ghost') })}
    <div class="posts">
      ${projects.map(p => `
        <a class="post" href="/work/${p.slug}">
          <div class="post__media">
            ${p.image
              ? `<img src="/${p.image}" alt="${esc(p.name)} — ${esc(p.summary)}" loading="lazy" width="900" height="620">`
              : `<div style="display:grid;place-items:center;height:100%;color:var(--ink-3);font-size:var(--t-sm)">${esc(p.name)}</div>`}
          </div>
          <div class="post__meta">
            <span class="tag ${p.kind === 'client' ? 'tag--live' : 'tag--demo'}">${p.kind === 'client' ? 'Client project' : 'Demo build'}</span>
            <span>${esc(p.category)}</span><span class="dot"></span><span>${esc(p.year)}</span>
          </div>
          <h3 class="post__t">${esc(p.name)}</h3>
          <p class="body-sm">${esc(p.summary)}</p>
          <span class="alink" style="align-self:flex-start">Read the case${ico.arrow}</span>
        </a>`).join('')}
    </div>
  </div>
</section>`;

/* ---------- 10. ENGAGEMENT ---------- */
export const engagementStrip = () => `
<section class="section section--white" data-rv>
  <div class="wrap stack gap-32">
    ${secHead({ eye: 'Engagement', lines: ['Fixed scope. Fixed fee.', 'A date we {hold}.'],
      lead: 'Three ways to work together. Pricing is scoped per project rather than published as a menu.',
      cta: btn('How engagement works', '/pricing', 'ghost') })}
    <div class="grid g3">
      ${engagements.map(e => `
        <div class="card"${e.featured ? ' style="border-color:var(--ink)"' : ''}>
          <div class="stack gap-8">
            <h3 class="h3">${esc(e.name)}</h3>
            <span class="body-sm" style="color:var(--ink-3)">${esc(e.price)} · ${esc(e.unit)}</span>
          </div>
          <p class="body-sm">${esc(e.lead)}</p>
          <a class="alink mt-8" style="align-self:flex-start" href="/pricing">Details${ico.arrow}</a>
        </div>`).join('')}
    </div>
  </div>
</section>`;

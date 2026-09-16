/* ===========================================================================
   OSTENDIC — MOTION-LED SECTION LIBRARY
   Scroll-driven and depth components used by the homepage narrative.
   Everything renders readable without JS; motion.js enhances it.
   =========================================================================== */
import {
  site, services, projects, process, engagements, testimonials, posts,
  clients, placeholderLogos, homeCapabilities, rating,
} from './data.mjs';
import { esc, ico, eyebrow, btn, head, secHead, logoLockup } from './ui.mjs';


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
      ${btn('Book a 30-minute call', '/contact', 'primary', { avatar: true })}
      <a class="btn btn--ghost" href="${site.whatsapp}" target="_blank" rel="noopener">
        <span class="btn__lead">${ico.whatsapp}</span>
        <span class="btn-label">Chat on WhatsApp</span>
        <span class="btn__ico">${ico.arrow}</span>
      </a>
    </div>
    <p class="body-sm" style="margin-top:10px">Led by ${esc(site.principal)} · ${esc(site.principalBio)} · ${esc(site.markets.join(' · '))}</p>
  </div>
</section>`;

/* ---------- 2. CLIENT / LOGO DECK ----------
   Two rows of cards, not a directory. Ten slots hold the wall at a compact
   height; the rest of the roster cycles through them on the flip mechanism
   rather than being laid out as another five rows of static grid.

   One sequence, no special cases: every slot flips, starting at the first
   card of the first row and running through both rows in order. The real
   clients open the deck and then rotate with everything else, so no card is
   excluded from the effect and none is treated differently.

   HONESTY: only the entries in `clients` are real. The rest are fictitious
   placeholder marks completing the layout, and the copy around the deck says
   so in as many words — nothing here claims work we have not done. */
const SLOTS = 10;

export const logoWall = () => {
  /* the first slots-worth of placeholders start face-up; the remainder wait
     in a <template> and are dealt into the back faces by motion.js */
  const onDeck = placeholderLogos.slice(0, SLOTS - clients.length);
  const queued = placeholderLogos.slice(SLOTS - clients.length);

  const slot = (lockup) => `
    <div class="lw__card">
      <div class="lw__slot">
        <div class="lw__f">${lockup}</div>
        <div class="lw__b" aria-hidden="true"></div>
      </div>
    </div>`;

  const cards =
    clients.map((c, i) => slot(logoLockup(c.name, { mark: c.mark, src: c.src, client: true, i }))).join('') +
    onDeck.map((n, i) => slot(logoLockup(n, { i }))).join('');

  return `
<section class="section section--sm logowall" data-deck>
  <div class="wrap stack gap-32">
    <div class="lw__head">
      <p class="lw__lede">Live client brands, and the shape of the teams <em class="em">Ostendic is built for</em></p>
      <span class="lw__flag">${clients.length} live client${clients.length === 1 ? '' : 's'} · ${placeholderLogos.length} placeholder marks</span>
    </div>
    <div class="lw">${cards}</div>
    <template data-pool>${queued.map((n, i) => logoLockup(n, { i: i + onDeck.length })).join('')}</template>
    <p class="lw__note">The unmarked logos are placeholder companies used to complete this layout. They are not Ostendic clients and are replaced as real, cleared logos become available.</p>
  </div>
</section>`;
};

/* ---------- 3. EXPERTISE + FOUR CAPABILITY BLOCKS ----------
   The major transition after the logo wall: what the studio actually does.
   Every word in the four blocks is pulled from `services` in data.mjs, so
   the homepage cannot drift from the service pages it links to. */
const capIcons = { 'ui-ux-design': 'layers', 'web-development': 'code', 'mvp-development': 'rocket', 'ai-automation': 'bolt' };

export const expertise = () => {
  const caps = homeCapabilities.map(slug => services.find(s => s.slug === slug)).filter(Boolean);
  const spans = [
    'Brand structure and visual identity',
    'UI/UX design and product interfaces',
    'Websites, e-commerce and web apps',
    'MVP and product builds to a date',
    'AI and workflow automation',
  ];
  return `
<section class="section section--white" data-rv>
  <div class="wrap">
    <div class="xpt">
      <div class="stack gap-24">
        ${eyebrow('What we do', 'grid')}
        ${head(['We do not just build websites.', 'We build the {system around them}'], 'h2', 'h2')}
        <p class="lead">${esc(site.sub)}</p>
        <div class="btn-row">${btn('Explore every capability', '/services', 'primary')}</div>
      </div>
      <ul class="xpt__list">
        ${spans.map(t => `<li>${ico.right}<span>${esc(t)}</span></li>`).join('')}
      </ul>
    </div>

    <div class="caps">
      ${caps.map((c, i) => `
        <article class="cap">
          <span class="cap__n tnum">${String(i + 1).padStart(2, '0')}</span>
          <span class="cap__eye">${esc(c.kicker)}</span>
          <span class="cap__i">${ico[capIcons[c.slug]] || ico.spark}</span>
          <h3 class="cap__t">${esc(c.title)}</h3>
          <p class="cap__d">${esc(c.outcome)}</p>
          <a class="alink cap__link" href="/services/${c.slug}" aria-label="Explore ${esc(c.title)}">Explore${ico.arrow}</a>
        </article>`).join('')}
    </div>
  </div>
</section>`;
};

/* ---------- 3b. FOUNDER SIGNATURE ----------
   Deliberately small. The founder is a human signature on the studio's
   position, not the hero image of the page. The full founder presentation
   lives on /about. */
export const founderSignature = () => `
<section class="section dark" data-rv>
  <div class="wrap fsig">
    <div class="fsig__by">
      <img class="fsig__img" src="/${site.principalImage}"
           alt="${esc(site.principal)}, ${esc(site.principalRole)} of ${esc(site.name)}"
           width="240" height="240" loading="lazy">
      <div class="fsig__id">
        <span class="fsig__lbl">By the founder</span>
        <p class="fsig__name">${esc(site.principal)}</p>
        <p class="fsig__role">${esc(site.principalRole)}</p>
        <p class="fsig__disc">${esc(site.principalBio)}</p>
      </div>
    </div>
    <div class="fsig__say">
      <p class="fsig__q">${esc(site.differentiator.split('. ')[0])}. <em class="em">We make the system around it work better.</em></p>
      <p class="body-sm">A website that looks better but still loses enquiries has not solved anything. Every engagement is led directly by ${esc(site.principal)} — you talk to the person making the decisions, not an account manager relaying them.</p>
      <div class="btn-row">${btn('About the studio', '/about', 'ghost')}</div>
    </div>
  </div>
</section>`;

/* ---------- 4. PROOF POINTS ----------
   Four figures, each traceable to something already in this project:
   the principal's stated track record, services.length, site.markets.length,
   and the two weeks of post-launch tuning included in every engagement.
   Nothing here is manufactured. If a figure cannot be sourced, it does not
   appear — which is why there is no client count and no revenue claim. */
export const proof = () => {
  const items = [
    [ico.mark,  '50+',     'Client engagements across ' + site.principal + '’s career'],
    [ico.grid,  String(services.length), 'Capabilities delivered by one team'],
    [ico.globe, String(site.markets.length), 'Markets served: ' + site.markets.join(', ')],
    [ico.clock, '2 weeks', 'Post-launch tuning included in every project'],
  ];
  return `
<section class="section dark section--flush-t" data-rv>
  <div class="wrap stack gap-40">
    ${secHead({ eye: 'Proof', center: true, lines: ['What we can', 'actually {stand behind}'],
      lead: 'No borrowed logos and no invented metrics. Scope, fee and delivery date are agreed before work starts — these are the things we will put in writing.' })}
    <div class="proof">
      ${items.map(([i, n, l]) => `
        <div class="pf">
          <span class="pf__i">${i}</span>
          <span class="pf__n">${esc(n)}</span>
          <span class="pf__l">${esc(l)}</span>
        </div>`).join('')}
    </div>
    <p class="body-sm center" style="color:var(--ink-inv-2);max-width:66ch;margin-inline:auto">The 50+ figure is ${esc(site.principal)}’s personal track record, not a studio claim — stated that way deliberately.</p>
  </div>
</section>`;
};

/* ---------- 5. TESTIMONIALS (visibly marked sample content) ---------- */
const stars = (n) =>
  `<span class="stars" role="img" aria-label="${n} out of 5">` +
  Array.from({ length: 5 }, (_, i) =>
    `<svg viewBox="0 0 24 24" aria-hidden="true" class="${i < n ? 'on' : ''}"><path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.45 6.19 20.5 7.3 14.03 2.6 9.45l6.5-.95z"/></svg>`
  ).join('') + '</span>';

/* The rating headline renders the figures from data.mjs. While
   `rating.verified` is false they are placeholders, and the section says so
   on the page as well as in the source. Flipping that flag removes both the
   marker and the footnote — it is the only switch to change. */
export const testimonialWall = () => `
<section class="section dark section--flush-t" data-rv>
  <div class="wrap stack gap-40">
    <div class="tm__head">
      ${eyebrow('What clients say', 'spark')}
      <p class="tm__rate">
        <span class="tm__score tnum">${esc(rating.score)}</span>
        <span class="tm__star" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.45 6.19 20.5 7.3 14.03 2.6 9.45l6.5-.95z"/></svg></span>
        <span class="tm__rate-a">Average rating from</span>
        <em class="em tm__rate-b">${esc(rating.reviews)} client reviews</em>
      </p>
      ${rating.verified ? '' : '<span class="tm__flag">Placeholder figures · not yet verified</span>'}
    </div>
    <div class="reviews">
      ${testimonials.map(t => `
        <article class="review">
          ${stars(t.stars)}
          <p class="review__q">${esc(t.quote)}</p>
          <div class="review__by">
            ${t.avatar
              ? `<img class="review__av" src="/${t.avatar}" alt="" width="44" height="44" loading="lazy">`
              : `<span class="review__av review__av--txt">${esc(t.initials)}</span>`}
            <span><span class="review__n">${esc(t.name)}</span><br><span class="review__r">${esc(t.role)}</span></span>
          </div>
        </article>`).join('')}
    </div>
    ${rating.verified ? '' : `<p class="body-sm center" style="color:var(--ink-inv-2);max-width:72ch;margin-inline:auto">Placeholder content. The rating, the review count and the three quotes above are sample entries used to complete the layout — not client endorsements. They are replaced as real, attributed reviews are cleared for publication.</p>`}
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
        <article class="panel" style="--i:${i}">
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

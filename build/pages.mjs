/* ===========================================================================
   OSTENDIC — PAGE COMPOSITIONS
   =========================================================================== */
import {
  site, links, pillars, aboutCopy, published, kindLabel, bookingProvider,
  budgets, interests,
} from './data.mjs';
import { esc, ico, btn, alink, head, pageHead, startBtn, waBtn, telBtn, principleIcon } from './ui.mjs';
import * as S from './sections.mjs';

/* ========================= HOME ========================= */
export const home = () => `
${S.hero()}
${S.statsBar()}
${S.selectedWork()}
${S.serviceChapters({ icons: true, ring: true, video: true })}
${S.processSection({ home: true })}
${S.aboutTeaser()}
`;

/* ========================= SERVICES ========================= */
export const servicesIndex = () => `
${pageHead({
  label: 'Services',
  lines: ['Websites and web applications, and the AI workflows behind them'],
  lead: 'Ostendic works in two areas. They are often used together, but each stands on its own.',
})}
${S.serviceChapters({ withHead: false })}
${S.processSection()}
`;

export const pillarPage = (s) => {
  const other = pillars.find(p => p.slug !== s.slug);
  const work = published.filter(p => p.pillars.includes(s.slug));
  return `
${pageHead({
  label: `Service ${s.n}`,
  lines: [s.title],
  lead: s.summary,
  actions: startBtn('primary') + waBtn('ghost'),
})}

<section class="section section--white">
  <div class="wrap">
    <div class="split">
      <div class="split__a">
        <p class="label">Who it helps</p>
        <p class="body">${esc(s.who)}</p>
        <p class="label mt-24">The problem</p>
        <p class="body">${esc(s.problem)}</p>
      </div>
      <div class="split__b">
        <h2 class="h3">What we build</h2>
        <dl class="rows">
          ${s.services.map(([t, d]) => `<div><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join('')}
        </dl>
      </div>
    </div>
  </div>
</section>

${s.example ? `
<section class="section">
  <div class="wrap">
    ${S.example(s, false)}
  </div>
</section>` : ''}

<section class="section section--dark">
  <div class="wrap">
    <div class="shead">
      <p class="label">How we approach it</p>
      <div class="shead__main"><h2 class="h2">What an engagement includes</h2></div>
    </div>
    <div class="split">
      <ul class="ticks ticks--lg split__a">${s.includes.map(b => `<li>${ico.check}<span>${esc(b)}</span></li>`).join('')}</ul>
      <div class="split__b principles">
        ${s.principles.map(([t, d]) => `<div><h3 class="h4">${esc(t)}</h3><p class="body-sm">${esc(d)}</p></div>`).join('')}
      </div>
    </div>
  </div>
</section>

${work.length ? `
<section class="section section--white">
  <div class="wrap">
    <div class="shead">
      <p class="label">Related work</p>
      <div class="shead__main"><h2 class="h2">Where we have applied this</h2></div>
    </div>
    <ul class="mini-work">
      ${work.map(p => `
      <li>
        <a href="/work#${p.slug}">
          ${p.brand
            ? `<span class="mini-work__logo"><img src="/${p.brand.logo}" alt="" width="${p.brand.w}" height="${p.brand.h}" loading="lazy" decoding="async"></span>`
            : `<img src="/${p.images.desktop}" alt="" width="1600" height="1000" loading="lazy" decoding="async">`}
          <span class="mini-work__t"><span class="tag tag--${p.kind}">${kindLabel[p.kind]}</span><strong>${esc(p.name)}</strong><span class="body-sm">${esc(p.what)}</span></span>
        </a>
      </li>`).join('')}
    </ul>
  </div>
</section>` : ''}

<section class="section section--sm">
  <div class="wrap other">
    <p class="label">The other service</p>
    <a class="other__link" href="${other.path}"><span class="tnum">${other.n}</span><span>${esc(other.title)}</span>${ico.right}</a>
    <p class="body-sm">${esc(other.summary)}</p>
  </div>
</section>
`;
};

/* ========================= WORK ========================= */
export const work = () => `
${pageHead({
  label: 'Work',
  lines: ['What we’ve built, and what it does'],
})}

<section class="section section--flush-t">
  <div class="wrap">
    ${published.map(p => `
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
    </article>`).join('')}

    <div class="note">
      <h2 class="h4">About client work</h2>
      <p class="body-sm">Client projects are shown here only with the client’s agreement, and with an exact description of what Ostendic did. We don’t publish client results or figures we can’t verify.</p>
    </div>
  </div>
</section>
`;

/* ========================= ABOUT ========================= */
export const about = () => `
<section class="phead">
  <div class="wrap about-hero">
    <div class="about-hero__text">
      <p class="label">About</p>
      <h1 class="h1 about-hero__h">Small businesses deserve to show up like the big ones.</h1>
      <p class="lead">${esc(aboutCopy.hero.lead)}</p>
      ${aboutCopy.hero.body.map(p => `<p class="body">${esc(p)}</p>`).join('\n      ')}
    </div>
    <figure class="about-hero__img">
      <img src="/${site.principalImage}" alt="${esc(site.principal)}, ${esc(site.principalRole)} of ${esc(site.name)}"
           width="800" height="800" decoding="async" fetchpriority="high">
    </figure>
    <div class="btn-row about-hero__cta">${startBtn('primary')}</div>
  </div>
</section>
${S.statsBar()}

<section class="section section--white">
  <div class="wrap">
    <div class="shead">
      <p class="label">How we work</p>
      <div class="shead__main"><h2 class="h2">Four things we hold to on every project</h2></div>
    </div>
    <dl class="rows rows--2 principles-hover">
      ${aboutCopy.approach.map(([t, d, icon]) => `<div tabindex="0"><dt>${principleIcon(icon, { size: 44, className: 'principle__icon' })}${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join('')}
    </dl>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="shead">
      <p class="label">What Ostendic does</p>
      <div class="shead__main"><h2 class="h2">Two services</h2></div>
    </div>
    <ul class="svc-links">
      ${pillars.map(p => `<li><a href="${p.path}"><span class="tnum">${p.n}</span><span class="svc-links__t">${esc(p.title)}</span><span class="body-sm">${esc(p.summary)}</span>${ico.right}</a></li>`).join('')}
    </ul>
  </div>
</section>
`;

/* ========================= CONTACT =========================
   Two routes, side by side: talk now (WhatsApp / call / booking, each shown
   only if configured) and the enquiry form, which is always available. */
export const contact = () => {
  const direct = [
    links.whatsapp && `<li><a href="${links.whatsapp}" target="_blank" rel="noopener">${ico.whatsapp}<span><strong>WhatsApp</strong><span>Send a message, any time</span></span></a></li>`,
    links.tel && `<li><a href="${links.tel}">${ico.phone}<span><strong>Call</strong><span>${esc(site.phone.display)}</span></span></a></li>`,
    site.booking && `<li><a href="/book">${ico.calendar}<span><strong>Book a quick call</strong><span>Pick a date and time that suits you</span></span></a></li>`,
    `<li><a href="mailto:${site.email}">${ico.mail}<span><strong>Email</strong><span>${site.email}</span></span></a></li>`,
  ].filter(Boolean).join('');
  return `
<section class="phead phead--contact">
  <div class="wrap contact">
    <div class="contact__intro">
      <p class="label">Contact</p>
      <h1 class="h1">Tell us what you want to build or fix</h1>
      <p class="lead">A few sentences is enough. Messages come straight to ${esc(site.principal.split(' ')[0])}, who replies personally.</p>
      <ul class="direct">${direct}</ul>
    </div>

    <div class="contact__form">
      <h2 class="h3">Send an enquiry</h2>
      <form class="form" id="leadForm" novalidate>
        <div class="form__row">
          <div class="field" data-req>
            <label for="f-name">Your name</label>
            <input id="f-name" name="name" type="text" autocomplete="name" required aria-describedby="e-name">
            <span class="err" id="e-name">Please enter your name.</span>
          </div>
          <div class="field" data-req>
            <label for="f-email">Email</label>
            <input id="f-email" name="email" type="email" autocomplete="email" inputmode="email" required aria-describedby="e-email">
            <span class="err" id="e-email">Please enter a valid email address.</span>
          </div>
        </div>
        <div class="form__row">
          <div class="field">
            <label for="f-phone">Phone or WhatsApp <span class="opt">optional</span></label>
            <input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel">
          </div>
          <div class="field">
            <label for="f-company">Business name <span class="opt">optional</span></label>
            <input id="f-company" name="company" type="text" autocomplete="organization">
          </div>
        </div>
        <div class="field">
          <label for="f-help">What do you need?</label>
          <select id="f-help" name="help">${interests.map(i => `<option>${esc(i)}</option>`).join('')}</select>
        </div>
        <div class="field">
          <label for="f-budget">Budget <span class="opt">in Indian rupees</span></label>
          <select id="f-budget" name="budget">${budgets.map(b => `<option>${esc(b)}</option>`).join('')}</select>
        </div>
        <div class="field" data-req>
          <label for="f-project">About the project</label>
          <textarea id="f-project" name="project" required minlength="10" aria-describedby="e-project"
            placeholder="What would you like to build or improve, and what should it help you do?"></textarea>
          <span class="err" id="e-project">Please add a sentence or two (at least 10 characters).</span>
        </div>
        <!-- Spam trap: hidden from people and assistive tech; bots fill it. -->
        <div class="hp" aria-hidden="true">
          <label for="f-website">Leave this field empty</label>
          <input id="f-website" name="website" type="text" tabindex="-1" autocomplete="off">
        </div>
        <div class="form__status" id="formStatus" role="status" aria-live="polite"></div>
        <div class="form__foot">
          <button class="btn btn--primary" type="submit" id="formSubmit">
            <span class="btn-label">Send enquiry</span><span class="btn__ico">${ico.arrow}</span>
          </button>
          <p class="form__note">We use these details only to reply to you. <a href="/privacy">Privacy</a></p>
        </div>
      </form>
    </div>
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
      <h1 class="h1">Book a quick call</h1>
      <p class="lead">A short call about what you want to build or fix, and the sensible next step. ${esc(site.principal.split(' ')[0])} replies to emails within one business day.</p>
      <div class="sig">
        <span class="sig__img face"><img src="/${site.principalImage}" alt="${esc(site.principal)}" width="800" height="800" decoding="async"></span>
        <span class="sig__id"><strong>${esc(site.principal)}</strong><span>${esc(site.principalRole)}, ${esc(site.name)}</span></span>
      </div>
      <div class="btn-row"><p class="body-sm">Prefer to write?</p>${btn('Send an enquiry instead', '/contact', 'primary')}</div>
    </div>

    <div class="booking__panel" id="booking" data-provider="${bookingProvider}" data-url="${esc(site.booking || '')}">
      <div class="booking__state" data-state="loading" role="status">
        <span class="spinner" aria-hidden="true"></span>
        <p>Loading available times…</p>
      </div>
      <div class="booking__state" data-state="error" hidden role="alert">
        <h2 class="h4">The calendar didn’t load</h2>
        <p class="body-sm">This can happen with strict privacy settings or a blocked network. You can open the booking page directly, or send an enquiry.</p>
        <div class="btn-row">
          ${btn('Open the booking page', site.booking || '/contact', 'primary')}
          ${btn('Send an enquiry', '/contact', 'ghost')}
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
    </div>
  </div>
</section>
`;

/* ========================= LEGAL ========================= */
export const legal = (title, body) => `
${pageHead({ lines: [title], lead: 'Last updated 11 November 2026.' })}
<section class="section section--flush-t">
  <div class="wrap prose">${body}</div>
</section>`;

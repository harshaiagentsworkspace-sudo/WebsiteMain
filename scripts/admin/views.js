/* Ostendic admin: dashboard, enquiries, pages, work, SEO, redirects,
   settings, activity and version history. */
import { h, icon, btn, badge, card, toast, modal, confirmBox, debounce, ago, fmtDate, linkBtn, autosize, clone } from './dom.js';
import { S, api, changed, LABELS, isDirty } from './state.js';
import { renderCards, renderField, renderObj, renderList, sub } from './forms.js';
import { SCHEMAS, ROUTES, SERVICE_SLUGS, SERVICE_NAMES } from '/build/schema.mjs';
import { analyzePost, analyzeListing, scoreDot, serpPreview, socialPreview, TITLE, DESC } from './seo.js';
import { M, loadMedia } from './media.js';
import { go } from './router.js';

const rootBind = (name) => ({ get: () => S.work[name], set: (v) => { S.work[name] = v; changed(); }, changed });
const siteUrl = () => S.work.settings.identity.url.replace(/\/$/, '');
const phead = (title, text, ...actions) => h('div', { class: 'phead' },
  h('div', null, h('h1', { class: 'phead__t', text: title }), text ? h('p', { class: 'muted', text }) : null),
  actions.length ? h('div', { class: 'phead__act' }, actions) : null);
export const historyBtn = (name) => btn('History', { icon: 'history', onclick: () => historyDialog(name) });

/* ===================== DASHBOARD ===================== */
export const ENQ = { items: null, store: null, statuses: [] };
export async function loadEnquiries(force) {
  if (ENQ.items && !force) return ENQ;
  const r = await api('GET', 'enquiries');
  if (r.status !== 200) throw new Error(r.data.error || 'Could not load enquiries');
  Object.assign(ENQ, r.data);
  return ENQ;
}

export function dashboardView(root) {
  const sess = S.session;
  const posts = S.work.blog.posts;
  const visible = posts.filter(p => !p.draft);
  const seoScores = posts.map(p => analyzePost(p, posts, S.work.settings.seo.titleSuffix).score);
  const avg = seoScores.length ? Math.round(seoScores.reduce((a, b) => a + b, 0) / seoScores.length) : 0;
  const C = S.work.settings.contact;
  const pagesIssues = ROUTES.reduce((n, r) => n + analyzeListing(S.work.pages.seo[r]).filter(i => i[0] !== 'warn' || !/Hidden/.test(i[1])).length, 0);
  const hour = new Date().getHours();
  const first = S.work.settings.identity.principal.split(' ')[0];

  const stat = (label, value, href, tone) => h('a', { class: `stat${tone ? ' stat--' + tone : ''}`, href }, h('span', { class: 'stat__v', text: String(value) }), h('span', { class: 'stat__l', text: label }));
  const enqStat = h('a', { class: 'stat', href: '#/enquiries' }, h('span', { class: 'stat__v', text: '…' }), h('span', { class: 'stat__l', text: 'New enquiries' }));
  const mediaStat = h('a', { class: 'stat', href: '#/media' }, h('span', { class: 'stat__v', text: '…' }), h('span', { class: 'stat__l', text: 'Uploads without alt text' }));

  const setup = [
    [sess.mode !== 'none', 'Publishing', sess.mode === 'github' ? `Publishes to GitHub (${sess.branch}); Vercel deploys each change.` : sess.mode === 'local' ? 'Local mode: saves to this computer and rebuilds instantly.' : 'Add GITHUB_TOKEN in Vercel so the panel can publish.'],
    [sess.store !== 'none', 'Enquiry inbox', sess.store === 'redis' ? 'Connected to Upstash Redis.' : sess.store === 'file' ? 'Local file store (.data/).' : 'Add the Upstash for Redis integration in Vercel to keep enquiries here (they’re still emailed).'],
    [S.work.blog.indexable, 'Blog visible to Google', S.work.blog.indexable ? 'Blog pages are indexable and in the sitemap.' : 'Turn on in Blog posts when the posts are real.', '#/posts'],
    [!S.work.settings.stats.placeholder, 'Real stats', S.work.settings.stats.placeholder ? 'The stats bar shows placeholder numbers; a production build refuses to run.' : 'Verified numbers.', '#/settings'],
    [!!(C.phoneTel || C.whatsapp), 'Phone / WhatsApp', C.phoneTel || C.whatsapp ? 'Click-to-call or WhatsApp buttons are on.' : 'Add a number to show call and WhatsApp buttons.', '#/settings'],
    [C.social.length > 0, 'Social profiles', C.social.length ? `${C.social.length} linked.` : 'Add LinkedIn / Instagram links for the footer and structured data.', '#/settings'],
    [!!S.work.settings.seo.googleVerification, 'Google Search Console', S.work.settings.seo.googleVerification ? 'Verification tag is on every page.' : 'Add the verification code to see search traffic and indexing.', '#/settings'],
    [!!S.work.settings.seo.defaultOgImage, 'Default share image', S.work.settings.seo.defaultOgImage ? 'Set.' : 'Add a 1200×630 image for links shared on LinkedIn, WhatsApp and X.', '#/settings'],
  ];
  const done = setup.filter(s => s[0]).length;

  const recentEnq = h('div', null, h('p', { class: 'muted', text: 'Loading…' }));
  const recentAct = h('div', null, h('p', { class: 'muted', text: 'Loading…' }));

  root.append(
    h('div', { class: 'phead' }, h('div', null,
      h('h1', { class: 'phead__t', text: `Good ${hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'}, ${first}` }),
      h('p', { class: 'muted', text: 'Everything on ostendic.com, in one place.' })),
      h('div', { class: 'phead__act' }, linkBtn('View site', '/', { icon: 'external', blank: true }), btn('Write a post', { kind: 'primary', icon: 'plus', onclick: () => go('#/posts/new') }))),
    h('div', { class: 'stats' },
      enqStat,
      stat('Published posts', visible.length, '#/posts'),
      stat('Drafts', posts.length - visible.length, '#/posts'),
      stat('Average post SEO score', posts.length ? avg : '—', '#/seo', posts.length ? (avg >= 80 ? 'good' : avg >= 50 ? 'warn' : 'bad') : ''),
      stat('Page listing issues', pagesIssues, '#/seo', pagesIssues ? 'warn' : 'good'),
      mediaStat),
    h('div', { class: 'cols cols--even' },
      h('div', { class: 'col-main' },
        card(h('div', { class: 'card__headrow' }, h('h2', { class: 'card__t', text: 'Recent enquiries' }), h('a', { class: 'alink', href: '#/enquiries', text: 'Open inbox' })), recentEnq),
        card('Quick actions', h('div', { class: 'quick' },
          [['post', 'Write a blog post', '#/posts/new'], ['page', 'Edit the home page', '#/pages/home'], ['image', 'Upload images', '#/media'],
            ['work', 'Add a project', '#/work'], ['search', 'Fix SEO issues', '#/seo'], ['settings', 'Contact details', '#/settings']]
            .map(([i, l, href]) => h('a', { class: 'quick__i', href }, icon(i, 20), h('span', { text: l })))))),
      h('div', { class: 'col-side' },
        card(h('div', { class: 'card__headrow' }, h('h2', { class: 'card__t', text: 'Setup' }), h('span', { class: 'muted small', text: `${done} of ${setup.length}` })),
          h('div', { class: 'bar bar--good' }, h('span', { style: { width: (done / setup.length * 100) + '%' } })),
          h('ul', { class: 'setup' }, setup.map(([ok, t, d, href]) => h('li', { class: ok ? 'is-ok' : '' }, icon(ok ? 'check' : 'warn', 16),
            h('div', null, href && !ok ? h('a', { href, text: t }) : h('strong', { text: t }), h('small', { text: d })))))),
        card(h('div', { class: 'card__headrow' }, h('h2', { class: 'card__t', text: 'Recent activity' }), h('a', { class: 'alink', href: '#/activity', text: 'All' })), recentAct))));

  loadEnquiries().then(() => {
    const newN = (ENQ.items || []).filter(e => e.status === 'new').length;
    enqStat.querySelector('.stat__v').textContent = ENQ.store === 'none' ? '—' : String(newN);
    enqStat.classList.toggle('stat--warn', newN > 0);
    recentEnq.replaceChildren(ENQ.store === 'none' ? h('p', { class: 'muted', text: 'The inbox isn’t connected yet (see Setup). Enquiries are still emailed to you.' })
      : ENQ.items.length ? h('ul', { class: 'mini' }, ENQ.items.slice(0, 5).map(e => h('li', null, h('a', { href: `#/enquiries/${e.id}` },
        h('span', { class: `dot dot--${e.status}` }), h('strong', { text: e.name }), h('span', { class: 'muted', text: e.interest || e.message.slice(0, 60) }), h('span', { class: 'muted small mini__end', text: ago(e.at) })))))
        : h('p', { class: 'muted', text: 'No enquiries yet.' }));
  }).catch((e) => recentEnq.replaceChildren(h('p', { class: 'muted', text: e.message })));
  api('GET', 'activity').then(r => {
    const items = (r.data.items || []).slice(0, 8);
    recentAct.replaceChildren(items.length ? activityList(items) : h('p', { class: 'muted', text: 'Nothing yet.' }));
  }).catch(() => {});
  loadMedia().then(items => { mediaStat.querySelector('.stat__v').textContent = String(items.filter(i => i.uploaded && !(S.work.media.items[i.path] || {}).alt).length); }).catch(() => {});
}

/* ===================== ENQUIRIES ===================== */
const STATUS_LABEL = { new: 'New', replied: 'Replied', 'in-progress': 'In progress', won: 'Won', lost: 'Lost', spam: 'Spam' };
const STATUS_TONE = { new: 'info', replied: '', 'in-progress': 'warn', won: 'good', lost: '', spam: 'bad' };

export function enquiriesView(root, openId) {
  const st = { q: '', status: 'open', open: openId || null };
  root.append(phead('Enquiries', 'Every message sent through the contact form. Each one is also emailed to you.',
    btn('Export CSV', { icon: 'download', onclick: exportCsv }), btn('Refresh', { icon: 'history', onclick: () => loadEnquiries(true).then(draw) })));
  const box = h('div', { class: 'inbox' });
  root.appendChild(box);

  function exportCsv() {
    if (!ENQ.items || !ENQ.items.length) { toast('No enquiries to export.'); return; }
    const cols = ['at', 'status', 'name', 'email', 'phone', 'company', 'interest', 'budget', 'message', 'notes', 'page'];
    const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = [cols.join(','), ...ENQ.items.map(e => cols.map(c => q(e[c])).join(','))].join('\r\n');
    const a = h('a', { href: URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv' })), download: `ostendic-enquiries-${new Date().toISOString().slice(0, 10)}.csv` });
    document.body.appendChild(a); a.click(); a.remove();
  }

  async function patch(e, body) {
    const r = await api('PATCH', 'enquiries', { id: e.id, ...body });
    if (r.status !== 200) { toast(r.data.error || 'Could not update', 'bad'); return; }
    Object.assign(e, r.data.item); draw();
  }

  function detail(e) {
    if (!e.read) patch(e, { read: true });
    const notes = autosize(h('textarea', { rows: 3, value: e.notes || '', placeholder: 'Private notes: what you discussed, next step, quote sent…' }));
    const saveNotes = debounce(() => patch(e, { notes: notes.value }), 800);
    notes.addEventListener('input', saveNotes);
    const subj = encodeURIComponent(`Re: your enquiry to Ostendic`);
    const bodyTxt = encodeURIComponent(`Hi ${e.name.split(' ')[0]},\n\nThanks for getting in touch about ${e.interest ? e.interest.toLowerCase() : 'your project'}.\n\n`);
    const wa = e.phone && e.phone.replace(/[^0-9]/g, '');
    return h('div', { class: 'inbox__detail card' },
      h('div', { class: 'card__headrow' }, h('div', null, h('h2', { class: 'card__t', text: e.name }), h('div', { class: 'muted small', text: `${new Date(e.at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}${e.page ? ' · from ' + e.page : ''}` })),
        h('select', { 'aria-label': 'Status', onchange: (ev) => patch(e, { status: ev.target.value }) }, ENQ.statuses.map(s => h('option', { value: s, text: STATUS_LABEL[s] || s, selected: e.status === s })))),
      h('div', { class: 'row wrap' },
        h('a', { class: 'b b--primary b--sm', href: `mailto:${e.email}?subject=${subj}&body=${bodyTxt}`, onclick: () => { if (e.status === 'new') patch(e, { status: 'replied' }); } }, icon('mail', 16), h('span', { text: 'Reply by email' })),
        e.phone ? h('a', { class: 'b b--sm', href: `tel:${e.phone.replace(/[^0-9+]/g, '')}` }, icon('phone', 16), h('span', { text: 'Call' })) : null,
        wa && wa.length >= 10 ? h('a', { class: 'b b--sm', href: `https://wa.me/${wa}`, target: '_blank', rel: 'noopener' }, h('span', { text: 'WhatsApp' })) : null),
      h('dl', { class: 'kv' },
        h('dt', { text: 'Email' }), h('dd', null, h('a', { href: `mailto:${e.email}`, text: e.email })),
        e.phone ? [h('dt', { text: 'Phone' }), h('dd', { text: e.phone })] : null,
        e.company ? [h('dt', { text: 'Business' }), h('dd', { text: e.company })] : null,
        e.interest ? [h('dt', { text: 'Needs' }), h('dd', { text: e.interest })] : null,
        e.budget ? [h('dt', { text: 'Budget' }), h('dd', { text: e.budget })] : null),
      h('div', { class: 'msg', text: e.message }),
      h('label', { class: 'f' }, h('span', { class: 'f__l', text: 'Notes' }), notes),
      h('div', { class: 'row' }, btn('Delete', { small: true, kind: 'danger', icon: 'trash', onclick: async () => {
        if (!(await confirmBox('Delete enquiry', `Delete the enquiry from ${e.name}? This can’t be undone.`, 'Delete', true))) return;
        const r = await api('DELETE', 'enquiries', { id: e.id });
        if (r.status === 200) { ENQ.items = ENQ.items.filter(x => x.id !== e.id); st.open = null; draw(); toast('Deleted.'); }
      } })));
  }

  function draw() {
    box.textContent = '';
    if (!ENQ.items) { box.appendChild(h('p', { class: 'muted', text: 'Loading…' })); return; }
    if (ENQ.store === 'none') {
      box.appendChild(card('Connect the inbox', h('div', { class: 'stack' },
        h('p', { text: 'Enquiries are being emailed to you through Web3Forms, but not kept here yet. To keep them in this inbox:' }),
        h('ol', { class: 'steps' },
          h('li', { text: 'In Vercel, open the project › Storage › Create › Upstash for Redis (the free plan is plenty).' }),
          h('li', { text: 'Connect it to this project. Vercel adds KV_REST_API_URL and KV_REST_API_TOKEN automatically.' }),
          h('li', { text: 'Redeploy. New enquiries appear here from then on, with statuses, notes and CSV export.' })))));
      return;
    }
    const counts = {}; for (const e of ENQ.items) counts[e.status] = (counts[e.status] || 0) + 1;
    const rows = ENQ.items.filter(e => st.status === 'all' ? true : st.status === 'open' ? !['lost', 'spam', 'won'].includes(e.status) : e.status === st.status)
      .filter(e => !st.q || [e.name, e.email, e.company, e.message, e.notes].join(' ').toLowerCase().includes(st.q.toLowerCase()));
    const sel = ENQ.items.find(e => e.id === st.open);
    box.append(
      h('div', { class: 'inbox__list card card--flush' },
        h('div', { class: 'tabs tabs--scroll' }, [['open', 'Open'], ['all', 'All'], ...ENQ.statuses.map(s => [s, STATUS_LABEL[s]])].map(([k, l]) =>
          h('button', { type: 'button', class: `tabs__t${st.status === k ? ' is-on' : ''}`, onclick: () => { st.status = k; draw(); } }, l, k !== 'open' && k !== 'all' && counts[k] ? h('span', { class: 'tabs__n', text: String(counts[k]) }) : null))),
        h('div', { class: 'toolbar toolbar--pad' }, h('div', { class: 'search' }, icon('search', 16), h('input', { type: 'search', placeholder: 'Search enquiries', value: st.q, oninput: debounce((e) => { st.q = e.target.value; draw(); }, 150) }))),
        rows.length ? h('ul', { class: 'inbox__items' }, rows.map(e => h('li', null, h('button', { type: 'button', class: `inbox__item${e.id === st.open ? ' is-sel' : ''}${e.read ? '' : ' is-unread'}`, onclick: () => { st.open = e.id; history.replaceState(null, '', `#/enquiries/${e.id}`); draw(); } },
          h('span', { class: 'inbox__top' }, h('strong', { text: e.name }), h('span', { class: 'muted small', text: ago(e.at) })),
          h('span', { class: 'inbox__sub' }, badge(STATUS_LABEL[e.status] || e.status, STATUS_TONE[e.status]), h('span', { class: 'muted small', text: e.interest || e.email })),
          h('span', { class: 'inbox__snip', text: e.message.slice(0, 110) }))))) : h('p', { class: 'empty', text: ENQ.items.length ? 'Nothing in this view.' : 'No enquiries yet. They appear here as soon as someone uses the contact form.' })),
      sel ? detail(sel) : h('div', { class: 'inbox__detail inbox__detail--empty' }, icon('inbox', 32), h('p', { class: 'muted', text: 'Select an enquiry to read it.' })));
  }
  draw();
  loadEnquiries(true).then(draw).catch(e => { box.replaceChildren(h('p', { class: 'notice notice--bad', text: e.message })); });
}

/* ===================== PAGES ===================== */
const PAGE_LIST = [
  ['home', '/', 'Home page', 'Hero, problems, AI solutions, service panels, website section, use cases, who we help, process, why Ostendic and FAQ.'],
  ['services', '/services', 'Services overview', 'The /services page head.'],
  ...SERVICE_SLUGS.map(s => [s, `/services/${s}`, SERVICE_NAMES[s], 'Full service page, with its FAQ.']),
  ['work', '/work', 'Work', 'Page head and note. Projects are under Work.'],
  ['about', '/about', 'About', 'Hero, principles and services sections.'],
  ['blog', '/blog', 'Blog', 'Blog page heading. Posts are under Blog posts.'],
  ['contact', '/contact', 'Contact', 'Page heading. Form options are in Settings.'],
  ['book', '/book', 'Book a call', 'Page heading and intro.'],
  ['privacy', '/privacy', 'Privacy', 'Privacy policy text.'],
  ['terms', '/terms', 'Terms', 'Terms of use text.'],
];

export function pagesView(root) {
  root.append(phead('Pages', 'The text and search listing of every page on the site.', historyBtn('pages')));
  root.appendChild(h('div', { class: 'card card--flush' }, h('table', { class: 'tbl' },
    h('thead', null, h('tr', null, ['Page', 'Search title', 'Listing', ''].map(t => h('th', { text: t })))),
    h('tbody', null, PAGE_LIST.map(([key, route, name, desc]) => {
      const seo = S.work.pages.seo[route];
      const issues = analyzeListing(seo);
      return h('tr', { class: 'tbl__row', onclick: () => go(`#/pages/${key}`) },
        h('td', null, h('a', { class: 'tbl__t', href: `#/pages/${key}`, text: name }), h('div', { class: 'muted small', text: `${route} · ${desc}` })),
        h('td', { class: 'small', text: seo.title }),
        h('td', null, issues.length ? badge(`${issues.length} issue${issues.length > 1 ? 's' : ''}`, issues.some(i => i[0] === 'bad') ? 'bad' : 'warn') : badge('Good', 'good')),
        h('td', { class: 'tbl__end' }, icon('right', 16)));
    })))));
}

/* the search listing editor for a route */
export function listingCard(route, { canonical } = {}) {
  const b = sub(sub(rootBind('pages'), 'seo'), route);
  const s = SCHEMAS.pages.fields.seo.fields[route];
  const serp = h('div'), social = h('div');
  const refresh = () => {
    const v = b.get();
    serp.replaceChildren(serpPreview({ url: siteUrl() + route, title: v.title, description: v.description }));
    social.replaceChildren(socialPreview({ url: siteUrl() + route, title: v.ogTitle || v.title, description: v.ogDescription || v.description, image: v.ogImage || S.work.settings.seo.defaultOgImage }));
  };
  const bind = { ...b, changed: () => { changed(); refresh(); } };
  const fields = h('div', { class: 'stack' },
    renderField(s.fields.title, { get: () => bind.get().title, set: (v) => { bind.get().title = v; bind.changed(); } }, { soft: TITLE[1] }),
    renderField(s.fields.description, { get: () => bind.get().description, set: (v) => { bind.get().description = v; bind.changed(); } }, { soft: DESC[1] }),
    ...['ogTitle', 'ogDescription', 'twitterTitle', 'twitterDescription'].map(k =>
      renderField(s.fields[k], { get: () => bind.get()[k] || '', set: (v) => { if (v) bind.get()[k] = v; else delete bind.get()[k]; bind.changed(); } })),
    renderField(s.fields.ogImage, { get: () => bind.get().ogImage, set: (v) => { bind.get().ogImage = v; bind.changed(); } }),
    renderField(s.fields.noindex, { get: () => bind.get().noindex, set: (v) => { bind.get().noindex = v; bind.changed(); } }));
  refresh();
  return card('Search engine listing', serp, h('details', { class: 'more' }, h('summary', { text: 'Edit search listing' }), fields), h('p', { class: 'f__l', text: 'Social share preview' }), social);
}

export function pageEditor(root, key) {
  const item = PAGE_LIST.find(p => p[0] === key);
  if (!item) { root.appendChild(h('p', { class: 'empty', text: 'Unknown page.' })); return; }
  const [, route, name] = item;
  const contentName = key === 'home' ? 'home' : SERVICE_SLUGS.includes(key) ? 'services' : 'pages';
  root.append(h('div', { class: 'phead phead--edit' },
    h('div', { class: 'phead__left' }, btn('Back to pages', { iconOnly: true, icon: 'left', kind: 'plain', onclick: () => go('#/pages') }),
      h('h1', { class: 'phead__t', text: name }), h('code', { class: 'muted', text: route })),
    h('div', { class: 'phead__act' }, historyBtn(contentName), linkBtn('View page', route, { icon: 'external', blank: true }))));

  const main = h('div', { class: 'col-main' });
  if (key === 'home') main.append(...renderCards(SCHEMAS.home, rootBind('home')));
  else if (contentName === 'services') main.append(...renderCards(SCHEMAS.services.fields[key], sub(rootBind('services'), key)));
  else if (key === 'privacy' || key === 'terms') {
    const L = sub(rootBind('pages'), 'legal'); const s = SCHEMAS.pages.fields.legal.fields;
    main.append(card(null, renderField(s.updated, sub(L, 'updated')), renderField(s[key], sub(L, key))));
  } else {
    const s = SCHEMAS.pages.fields[key];
    main.append(card(null, renderObj(s, sub(rootBind('pages'), key), { root: true })));
  }
  if (key === 'home') main.appendChild(card(null, h('p', { class: 'muted', text: 'The stats bar is edited in Settings › Stats bar. The “Selected work” heading is on the Work page. Projects come from Work.' })));
  root.appendChild(h('div', { class: 'cols' }, main, h('div', { class: 'col-side' }, listingCard(route))));
}

/* ===================== WORK ===================== */
export function workView(root) {
  root.append(phead('Work', 'Projects on /work, the home page and the service pages, in this order. Hidden projects stay saved but don’t appear.', historyBtn('work')));
  const s = SCHEMAS.work.fields.projects;
  root.appendChild(card(null, renderList(s, sub(rootBind('work'), 'projects'))));
  root.appendChild(h('div', { class: 'cols cols--even' }, h('div', { class: 'col-main' }, card(null, renderObj(SCHEMAS.pages.fields.work, sub(rootBind('pages'), 'work'), { root: true }))), h('div', { class: 'col-side' }, listingCard('/work'))));
}

/* ===================== SEO ===================== */
export function seoView(root) {
  const posts = S.work.blog.posts;
  const sfx = S.work.settings.seo.titleSuffix;
  root.append(phead('SEO', 'Search listings across the whole site, with what to fix first.',
    linkBtn('sitemap.xml', '/sitemap.xml', { icon: 'external', blank: true }), linkBtn('robots.txt', '/robots.txt', { icon: 'external', blank: true })));

  const pageRows = PAGE_LIST.map(([key, route, name]) => ({ name, route, href: `#/pages/${key}`, issues: analyzeListing(S.work.pages.seo[route]), seo: S.work.pages.seo[route] }));
  const postRows = posts.map((p, i) => ({ p, i, r: analyzePost(p, posts, sfx) })).sort((a, b) => a.r.score - b.r.score);
  const titles = {};
  for (const r of pageRows) (titles[r.seo.title] ||= []).push(r.name);
  for (const { p } of postRows) { const t = p.seo.title || p.title + sfx; (titles[t] ||= []).push(p.title); }
  const dups = Object.entries(titles).filter(([, v]) => v.length > 1);
  const noAlt = h('span', { text: '…' });
  loadMedia().then(items => { noAlt.textContent = String(items.filter(i => i.uploaded && !(S.work.media.items[i.path] || {}).alt).length); }).catch(() => {});

  root.append(
    h('div', { class: 'stats' },
      h('a', { class: 'stat', href: '#/seo' }, h('span', { class: 'stat__v', text: String(pageRows.filter(r => r.issues.length).length) }), h('span', { class: 'stat__l', text: 'Pages with listing issues' })),
      h('a', { class: 'stat', href: '#/posts' }, h('span', { class: 'stat__v', text: String(postRows.filter(r => r.r.score < 80).length) }), h('span', { class: 'stat__l', text: 'Posts scoring under 80' })),
      h('a', { class: 'stat', href: '#/media' }, h('span', { class: 'stat__v' }, noAlt), h('span', { class: 'stat__l', text: 'Uploads without alt text' })),
      h('a', { class: `stat${S.work.blog.indexable ? ' stat--good' : ' stat--warn'}`, href: '#/posts' }, h('span', { class: 'stat__v', text: S.work.blog.indexable ? 'On' : 'Off' }), h('span', { class: 'stat__l', text: 'Blog indexing' }))),
    dups.length ? h('div', { class: 'notice notice--warn' }, h('strong', { text: 'Duplicate titles: ' }), dups.map(([t, v]) => `“${t}” (${v.join(', ')})`).join('; ')) : '',
    card('Pages', h('table', { class: 'tbl' }, h('thead', null, h('tr', null, ['Page', 'Title', 'Description', 'Issues'].map(t => h('th', { text: t })))),
      h('tbody', null, pageRows.map(r => h('tr', { class: 'tbl__row', onclick: () => go(r.href) },
        h('td', null, h('a', { class: 'tbl__t', href: r.href, text: r.name }), h('div', { class: 'muted small', text: r.route })),
        h('td', { class: 'small' }, r.seo.title, h('div', { class: 'muted small', text: `${r.seo.title.length} chars` })),
        h('td', { class: 'small' }, h('div', { class: 'clamp2', text: r.seo.description })),
        h('td', null, r.issues.length ? h('ul', { class: 'issues' }, r.issues.map(([t, x]) => h('li', { class: `is-${t}`, text: x }))) : badge('Good', 'good'))))))),
    card('Blog posts', postRows.length ? h('table', { class: 'tbl' }, h('thead', null, h('tr', null, ['Post', 'Score', 'Top fix'].map(t => h('th', { text: t })))),
      h('tbody', null, postRows.map(({ p, i, r }) => h('tr', { class: 'tbl__row', onclick: () => go(`#/posts/${i}`) },
        h('td', null, h('a', { class: 'tbl__t', href: `#/posts/${i}`, text: p.title || '(untitled)' }), h('div', { class: 'muted small', text: p.draft ? 'Hidden' : `/blog/${p.slug}` })),
        h('td', null, scoreDot(r.score)),
        h('td', { class: 'small', text: (r.checks.find(c => c.state !== 'good') || { text: 'Nothing to fix.' }).text })))))
      : h('p', { class: 'muted', text: 'No posts yet.' })),
    card('Site-wide search settings', h('p', { class: 'muted', text: 'Verification codes, Google Analytics, the title suffix and the default share image are in Settings › Search & sharing.' }), linkBtn('Open settings', '#/settings', { small: true })));
}

/* ===================== REDIRECTS ===================== */
export function redirectsView(root) {
  root.append(phead('Redirects', 'Send visitors and search engines from an old address to a new one. Saved into vercel.json; live after the next deploy.', historyBtn('redirects')));
  const tester = h('input', { type: 'text', placeholder: '/old-page', class: 'mono' });
  const result = h('span', { class: 'muted' });
  const test = () => {
    const url = tester.value.trim(); if (!url) { result.textContent = ''; return; }
    for (const r of S.work.redirects.redirects) {
      const names = [];
      const lit = (t) => [...t].map(c => /[A-Za-z0-9_~-]/.test(c) ? c : `[${c}]`).join('');
      const pat = r.source.split('/').map(seg => { const p = seg.match(/^:([A-Za-z]+)(.*)$/); if (!p) return lit(seg); names.push(p[1]); return p[2] && p[2][0] === '(' ? p[2] : '([^/]+)'; }).join('/');
      let m; try { m = url.match(new RegExp(`^${pat}$`)); } catch { continue; }
      if (m) { let d = r.destination; names.forEach((n, i) => { d = d.replace(':' + n, m[i + 1]); }); result.textContent = `→ ${d} (${r.permanent ? '308 permanent' : '307 temporary'})`; return; }
    }
    result.textContent = 'No redirect matches: the page is served as normal.';
  };
  tester.addEventListener('input', test);
  root.append(card('Test an address', h('div', { class: 'row' }, tester, result)),
    card(null, renderList(SCHEMAS.redirects.fields.redirects, sub(rootBind('redirects'), 'redirects'), { openAll: false })),
    card(null, h('p', { class: 'muted small', text: 'Patterns: /blog/:slug matches any single segment and can be reused in the destination (/articles/:slug). :slug(a|b) matches only those values.' })));
}

/* ===================== SETTINGS ===================== */
export function settingsView(root) {
  root.append(phead('Settings', 'Business details, contact channels, search and analytics, the enquiry form and the stats bar.', historyBtn('settings')));
  const nav = h('nav', { class: 'subnav' }, Object.entries(SCHEMAS.settings.fields).map(([k, f]) => h('a', { href: `#sec-${k}`, onclick: (e) => { e.preventDefault(); document.getElementById(`sec-${k}`).scrollIntoView({ behavior: 'smooth', block: 'start' }); }, text: f.label })));
  root.append(h('div', { class: 'cols' }, h('div', { class: 'col-main' }, ...renderCards(SCHEMAS.settings, rootBind('settings'))), h('div', { class: 'col-side' }, h('div', { class: 'sticky' }, card('Sections', nav),
    card('Admin password', h('p', { class: 'muted small', text: 'The password is the ADMIN_PASSWORD environment variable in Vercel (Project › Settings › Environment Variables). Changing it there signs everyone out.' }))))));
}

/* ===================== ACTIVITY ===================== */
const ACT = { publish: ['Published', 'check'], upload: ['Uploaded', 'upload'], 'delete-media': ['Deleted image', 'trash'], login: ['Logged in', 'logout'], 'login-failed': ['Failed login', 'warn'], enquiry: ['New enquiry', 'inbox'], 'enquiry-status': ['Enquiry status', 'inbox'], 'enquiry-delete': ['Deleted enquiry', 'trash'], commit: ['Commit', 'history'] };
export const activityList = (items) => h('ul', { class: 'timeline' }, items.map(a => {
  const [label, ic] = ACT[a.action] || [a.action, 'activity'];
  return h('li', { class: a.action === 'login-failed' ? 'is-bad' : '' }, icon(ic, 15), h('div', null,
    h('div', null, h('strong', { text: label }), ' ', a.url ? h('a', { href: a.url, target: '_blank', rel: 'noopener', text: a.detail }) : h('span', { text: a.detail })),
    h('small', { class: 'muted', text: ago(a.at) })));
}));
export function activityView(root) {
  root.append(phead('Activity', 'Logins, publishes, uploads and enquiries.'));
  const box = card(null, h('p', { class: 'muted', text: 'Loading…' }));
  root.appendChild(box);
  api('GET', 'activity').then(r => {
    box.replaceChildren(r.data.source === 'commits' ? h('p', { class: 'muted small', text: 'Showing the repository’s recent commits. Connect a data store (see Dashboard › Setup) for a full activity log with logins and enquiries.' }) : '',
      (r.data.items || []).length ? activityList(r.data.items) : h('p', { class: 'empty', text: 'Nothing yet.' }));
  });
}

/* ===================== HISTORY ===================== */
export function historyDialog(name) {
  const body = h('div', null, h('p', { class: 'muted', text: 'Loading…' }));
  const m = modal({ title: `${LABELS[name]}: version history`, wide: true, body });
  api('GET', `content?history=${name}`).then(r => {
    if (r.status !== 200) { body.replaceChildren(h('p', { class: 'notice notice--bad', text: r.data.error })); return; }
    const v = r.data.versions;
    body.replaceChildren(h('p', { class: 'muted small', text: 'Restoring loads that version into the editor as unsaved changes. Review it, then publish.' }),
      v.length ? h('ul', { class: 'versions' }, v.map(x => h('li', null,
        h('div', null, h('strong', { text: x.message }), h('small', { class: 'muted', text: new Date(x.at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) })),
        h('div', { class: 'row' }, x.url ? h('a', { class: 'b b--sm', href: x.url, target: '_blank', rel: 'noopener', text: 'View change' }) : null,
          btn('Restore', { small: true, onclick: async () => {
            if (isDirty(name) && !(await confirmBox('Replace unsaved changes?', `You have unsaved changes to ${LABELS[name].toLowerCase()}. Restoring replaces them.`, 'Restore'))) return;
            const r2 = await api('GET', `content?name=${name}&version=${encodeURIComponent(x.id)}`);
            if (r2.status !== 200) { toast(r2.data.error || 'Could not load that version', 'bad'); return; }
            S.work[name] = r2.data.data; changed(); m.close(); toast('Version loaded. Publish to make it live.'); window.dispatchEvent(new HashChangeEvent('hashchange'));
          } }))))) : h('p', { class: 'empty', text: 'No earlier versions yet.' }));
  });
}

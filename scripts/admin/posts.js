/* Ostendic admin: blog posts list and the post editor.
   Layout follows the Shopify blog editor: the article on the left, the
   post's settings (visibility, image, organisation) on the right, and the
   search engine listing and social preview underneath. */
import { h, icon, btn, badge, card, toast, modal, confirmBox, debounce, slugify, fmtDate, mediaUrl, clone, autosize } from './dom.js';
import { S, changed } from './state.js';
import { richEditor, blocksToSiteHtml } from './editor.js';
import { renderField, renderList, imageField, sub } from './forms.js';
import { POST_FIELDS, stripTags } from '/build/schema.mjs';
import { analyzePost, checklist, scoreDot, scoreTone, serpPreview, socialPreview, effTitle, effDesc, TITLE, DESC, words as wordList } from './seo.js';
import { pickMedia, uploadFiles } from './media.js';
import { go } from './router.js';

const F = POST_FIELDS.fields;
const blog = () => S.work.blog;
const suffix = () => S.work.settings.seo.titleSuffix || '';
const siteUrl = () => S.work.settings.identity.url.replace(/\/$/, '');
const today = () => new Date().toISOString().slice(0, 10);
const wordsOf = (p) => wordList(p.body.map(b => b.items ? b.items.map(stripTags).join(' ') : stripTags(b.html || '')).join(' ')).length;

export const newPost = () => ({
  title: '', slug: '', category: '', tags: [], excerpt: '', draft: true, publishedAt: today(), updatedAt: '',
  author: S.work.settings.identity.principal, toc: false, featuredImage: { src: '', alt: '' },
  body: [{ type: 'p', html: '' }], faq: [],
  seo: { title: '', description: '', focusKeyword: '', canonical: '', noindex: false, ogTitle: '', ogDescription: '', ogImage: '' },
});

/* ---------- list ---------- */
export function postsView(root) {
  const st = { q: '', status: 'all', cat: 'all', sort: 'date' };
  const b = blog();
  const cats = () => Array.from(new Set(b.posts.map(p => p.category).filter(Boolean))).sort();

  root.append(
    h('div', { class: 'phead' },
      h('div', null, h('h1', { class: 'phead__t', text: 'Blog posts' }), h('p', { class: 'muted', text: 'Write, schedule and optimise articles. Hidden posts are saved but not on the site.' })),
      h('div', { class: 'phead__act' }, btn('Add blog post', { kind: 'primary', icon: 'plus', onclick: () => {
        b.posts.unshift(newPost()); changed(); go('#/posts/0');
      } }))),
    card(null, renderField({ t: 'bool', label: 'Show the blog to search engines', hint: 'Off: the blog stays visible to visitors but every blog page is noindex and left out of the sitemap. Turn on when the posts are real.' },
      { get: () => b.indexable, set: (v) => { b.indexable = v; changed(); }, changed })));

  const table = h('div', { class: 'card card--flush' });
  root.appendChild(table);
  const draw = () => {
    table.textContent = '';
    const rows = b.posts.map((p, i) => ({ p, i, seo: analyzePost(p, b.posts, suffix()).score }))
      .filter(({ p }) => st.status === 'all' || (st.status === 'hidden') === !!p.draft)
      .filter(({ p }) => st.cat === 'all' || p.category === st.cat)
      .filter(({ p }) => !st.q || (p.title + ' ' + p.excerpt + ' ' + p.tags.join(' ')).toLowerCase().includes(st.q.toLowerCase()))
      .sort((a, c) => st.sort === 'title' ? a.p.title.localeCompare(c.p.title) : st.sort === 'seo' ? a.seo - c.seo : (c.p.publishedAt || '').localeCompare(a.p.publishedAt || ''));
    const pubN = b.posts.filter(p => !p.draft).length;
    table.append(
      h('div', { class: 'tabs' },
        [['all', `All (${b.posts.length})`], ['visible', `Visible (${pubN})`], ['hidden', `Hidden (${b.posts.length - pubN})`]].map(([k, l]) =>
          h('button', { type: 'button', class: `tabs__t${st.status === k ? ' is-on' : ''}`, onclick: () => { st.status = k; draw(); }, text: l }))),
      h('div', { class: 'toolbar toolbar--pad' },
        h('div', { class: 'search' }, icon('search', 16), h('input', { type: 'search', placeholder: 'Search posts', value: st.q, oninput: debounce((e) => { st.q = e.target.value; draw(); }, 150) })),
        h('select', { onchange: (e) => { st.cat = e.target.value; draw(); }, 'aria-label': 'Category' }, h('option', { value: 'all', text: 'All categories' }), cats().map(c => h('option', { value: c, text: c, selected: st.cat === c }))),
        h('select', { onchange: (e) => { st.sort = e.target.value; draw(); }, 'aria-label': 'Sort' }, [['date', 'Newest first'], ['title', 'Title A–Z'], ['seo', 'Lowest SEO score']].map(([v, l]) => h('option', { value: v, text: l, selected: st.sort === v })))),
      rows.length ? h('table', { class: 'tbl' },
        h('thead', null, h('tr', null, ['Title', 'Status', 'Category', 'Date', 'SEO', ''].map(t => h('th', { text: t })))),
        h('tbody', null, rows.map(({ p, i, seo }) => h('tr', { class: 'tbl__row', onclick: (e) => { if (!e.target.closest('button')) go(`#/posts/${i}`); } },
          h('td', null, h('div', { class: 'tbl__main' },
            p.featuredImage && p.featuredImage.src ? h('img', { class: 'tbl__thumb', src: mediaUrl(p.featuredImage.src), alt: '' }) : h('span', { class: 'tbl__thumb tbl__thumb--empty' }, icon('post', 16)),
            h('div', null, h('a', { href: `#/posts/${i}`, class: 'tbl__t', text: p.title || '(untitled)' }), h('div', { class: 'muted small', text: `/blog/${p.slug || '…'} · ${wordsOf(p)} words` })))),
          h('td', null, p.draft ? badge('Hidden', '') : badge('Visible', 'good')),
          h('td', { text: p.category || '—' }),
          h('td', { class: 'nowrap', text: fmtDate(p.publishedAt) }),
          h('td', null, scoreDot(seo)),
          h('td', { class: 'tbl__end' },
            btn('Duplicate', { iconOnly: true, icon: 'dup', small: true, kind: 'plain', onclick: () => {
              const c = clone(p); c.title += ' (copy)'; c.slug = slugify(c.title); c.draft = true; c.seo.focusKeyword = '';
              b.posts.splice(i + 1, 0, c); changed(); draw(); toast('Duplicated as a hidden post.');
            } })))))) : h('p', { class: 'empty', text: b.posts.length ? 'No posts match.' : 'No posts yet. Write the first one.' }));
  };
  draw();
}

/* ---------- client-side preview (same styles as the live site) ---------- */
function preview(p) {
  const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const fi = p.featuredImage && p.featuredImage.src ? `<figure class="post__hero"><img src="${mediaUrl(p.featuredImage.src)}" alt=""></figure>` : '';
  const doc = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Instrument+Serif:ital@1&display=swap">
<link rel="stylesheet" href="/styles/ostendic.css"><style>body{background:#F2F2F0}.post{padding:48px 0}</style></head><body>
<article class="post"><div class="wrap post__in"><div class="post__sheet">
<p class="label">${esc(p.category)}</p><h1 class="h1 post__t">${esc(p.title)}</h1>
<p class="post__meta">${esc(p.author)} · ${esc(fmtDate(p.publishedAt))} · ${Math.max(1, Math.round(wordsOf(p) / 200))} min read</p>${fi}
<div class="post__body">${blocksToSiteHtml(p.body)}</div>
${p.faq.length ? `<section class="post__faq"><h2>Frequently asked questions</h2>${p.faq.map(f => `<details open><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>` : ''}
</div></div></article></body></html>`;
  const frame = h('iframe', { class: 'preview__frame', title: 'Post preview', sandbox: 'allow-same-origin' });
  frame.srcdoc = doc;
  const sizes = h('div', { class: 'seg' }, [['Desktop', '100%'], ['Tablet', '820px'], ['Phone', '390px']].map(([l, w], i) =>
    h('button', { type: 'button', class: `seg__b${i === 0 ? ' is-on' : ''}`, text: l, onclick: (e) => { frame.style.width = w; e.target.parentNode.querySelectorAll('button').forEach(x => x.classList.toggle('is-on', x === e.target)); } })));
  modal({ title: 'Preview (unsaved changes included)', wide: true, body: h('div', { class: 'preview' }, sizes, h('div', { class: 'preview__stage' }, frame)) });
}

/* ---------- editor ---------- */
export function postEditor(root, idx) {
  const b = blog();
  const p = b.posts[idx];
  if (!p) { root.appendChild(h('p', { class: 'empty', text: 'That post no longer exists.' })); return; }
  let slugTouched = !!p.slug;
  const bind = { get: () => p, set: () => {}, changed: () => { changed(); refresh(); } };
  const url = () => `${siteUrl()}/blog/${p.slug || 'url-handle'}`;
  const isNew = !p.title && !p.slug;

  /* header */
  const statusBadge = h('span');
  const head = h('div', { class: 'phead phead--edit' },
    h('div', { class: 'phead__left' },
      btn('Back to posts', { iconOnly: true, icon: 'left', kind: 'plain', onclick: () => go('#/posts') }),
      h('h1', { class: 'phead__t', text: isNew ? 'Add blog post' : (p.title || 'Untitled') }), statusBadge),
    h('div', { class: 'phead__act' },
      btn('Preview', { icon: 'eye', onclick: () => preview(p) }),
      !p.draft && S.saved.blog.posts.some(x => x.slug === p.slug && !x.draft) ? h('a', { class: 'b', href: `/blog/${p.slug}`, target: '_blank', rel: 'noopener' }, icon('external', 18), h('span', { text: 'View live' })) : null,
      btn('Delete post', { iconOnly: true, icon: 'trash', kind: 'plain', onclick: async () => {
        if (!(await confirmBox('Delete post', `Delete “${p.title || 'this post'}”? It is removed from the site when you publish.`, 'Delete', true))) return;
        b.posts.splice(idx, 1); changed(); go('#/posts');
      } })));

  /* title + content */
  const title = h('input', { type: 'text', class: 'input--xl', value: p.title, placeholder: 'e.g. Does your business really need a website?', maxlength: 160,
    oninput: (e) => { p.title = e.target.value; if (!slugTouched) { p.slug = slugify(p.title); slugInput.value = p.slug; } bind.changed(); } });
  const editor = richEditor({ blocks: p.body, pickMedia, uploadFiles, onChange: (blocks) => { p.body = blocks.length ? blocks : [{ type: 'p', html: '' }]; bind.changed(); } });
  const words = h('span', { class: 'muted small' });
  const excerpt = autosize(h('textarea', { rows: 3, value: p.excerpt, maxlength: 340, placeholder: 'A sentence or two that sums up the post. Shown on the blog page and used as the meta description unless you write one.',
    oninput: (e) => { p.excerpt = e.target.value; bind.changed(); } }));

  /* search engine listing */
  const serpBox = h('div');
  const slugInput = h('input', { type: 'text', value: p.slug, spellcheck: 'false', class: 'mono',
    oninput: (e) => { slugTouched = true; p.slug = e.target.value.toLowerCase(); bind.changed(); },
    onblur: (e) => { p.slug = slugify(e.target.value); e.target.value = p.slug; bind.changed(); } });
  const seoTitle = h('input', { type: 'text', value: p.seo.title, maxlength: 90, oninput: (e) => { p.seo.title = e.target.value; bind.changed(); } });
  const seoDesc = autosize(h('textarea', { rows: 3, value: p.seo.description, maxlength: 220, oninput: (e) => { p.seo.description = e.target.value; bind.changed(); } }));
  const tCount = h('span', { class: 'f__count' }), dCount = h('span', { class: 'f__count' });
  const meter = (n, [lo, hi]) => h('span', { class: `meter meter--${n === 0 ? 'bad' : n < lo || n > hi ? 'warn' : 'good'}` }, h('span', { style: { width: Math.min(100, n / hi * 100) + '%' } }));
  const tMeter = h('span'), dMeter = h('span');
  const kw = h('input', { type: 'text', value: p.seo.focusKeyword, placeholder: 'e.g. small business website', oninput: (e) => { p.seo.focusKeyword = e.target.value; bind.changed(); } });
  const listingEdit = h('div', { class: 'stack' },
    h('label', { class: 'f' }, h('div', { class: 'f__top' }, h('span', { class: 'f__l', text: 'Focus keyword' })), kw, h('small', { class: 'f__h', text: 'The main phrase people would search to find this post. The SEO score checks how well the post targets it.' })),
    h('label', { class: 'f' }, h('div', { class: 'f__top' }, h('span', { class: 'f__l', text: 'Page title' }), tCount), seoTitle, tMeter, h('small', { class: 'f__h', text: `Empty = the post title${suffix() ? ` + “${suffix().trim()}”` : ''}. Aim for 30–60 characters.` })),
    h('label', { class: 'f' }, h('div', { class: 'f__top' }, h('span', { class: 'f__l', text: 'Meta description' }), dCount), seoDesc, dMeter, h('small', { class: 'f__h', text: 'Empty = the excerpt. Aim for 70–160 characters; include the focus keyword and a reason to click.' })),
    h('label', { class: 'f' }, h('div', { class: 'f__top' }, h('span', { class: 'f__l', text: 'URL handle' })), h('div', { class: 'affix' }, h('span', { text: `${siteUrl()}/blog/` }), slugInput),
      h('small', { class: 'f__h', text: 'Lowercase words joined by hyphens. Changing it on a published post changes its address: add a redirect from the old one (Redirects).' })),
    renderField(F.seo.fields.canonical, sub(sub(bind, 'seo'), 'canonical')),
    renderField(F.seo.fields.noindex, sub(sub(bind, 'seo'), 'noindex')));

  /* social */
  const socialBox = h('div');
  const socialEdit = h('div', { class: 'stack' },
    renderField({ ...F.seo.fields.ogTitle, hint: 'Empty = the page title.' }, sub(sub(bind, 'seo'), 'ogTitle')),
    renderField({ ...F.seo.fields.ogDescription, hint: 'Empty = the meta description.' }, sub(sub(bind, 'seo'), 'ogDescription')),
    imageField({ ...F.seo.fields.ogImage, hint: 'Empty = the featured image. 1200×630 works best.' }, sub(sub(bind, 'seo'), 'ogImage')));

  /* sidebar */
  const vis = h('div', { class: 'radio' },
    h('label', null, h('input', { type: 'radio', name: 'vis', checked: !p.draft, onchange: () => { p.draft = false; bind.changed(); } }), h('span', null, h('strong', { text: 'Visible' }), h('small', { text: 'On the site after you publish' }))),
    h('label', null, h('input', { type: 'radio', name: 'vis', checked: !!p.draft, onchange: () => { p.draft = true; bind.changed(); } }), h('span', null, h('strong', { text: 'Hidden' }), h('small', { text: 'Saved as a draft' }))));
  const date = h('input', { type: 'date', value: p.publishedAt, onchange: (e) => { p.publishedAt = e.target.value; bind.changed(); } });
  const upd = h('input', { type: 'date', value: p.updatedAt || '', onchange: (e) => { p.updatedAt = e.target.value; bind.changed(); } });
  const cats = Array.from(new Set(b.posts.map(x => x.category).filter(Boolean)));
  const catList = h('datalist', { id: 'catlist' }, cats.map(c => h('option', { value: c })));
  const tagBox = h('div', { class: 'tags' });
  const drawTags = () => {
    tagBox.textContent = '';
    p.tags.forEach((t, i) => tagBox.appendChild(h('span', { class: 'tag' }, t, h('button', { type: 'button', 'aria-label': `Remove tag ${t}`, onclick: () => { p.tags.splice(i, 1); bind.changed(); drawTags(); } }, icon('x', 12)))));
    tagBox.appendChild(h('input', { type: 'text', placeholder: p.tags.length ? 'Add tag' : 'Type a tag and press Enter', onkeydown: (e) => {
      if ((e.key === 'Enter' || e.key === ',') && e.target.value.trim()) { e.preventDefault(); const t = e.target.value.trim().slice(0, 40); if (!p.tags.includes(t) && p.tags.length < 15) p.tags.push(t); bind.changed(); drawTags(); tagBox.querySelector('input').focus(); }
      if (e.key === 'Backspace' && !e.target.value && p.tags.length) { p.tags.pop(); bind.changed(); drawTags(); tagBox.querySelector('input').focus(); }
    } }));
  };
  drawTags();
  const scoreCard = h('div');

  const side = h('div', { class: 'col-side' },
    card('Visibility', vis, h('label', { class: 'f' }, h('span', { class: 'f__l', text: 'Publish date' }), date),
      h('label', { class: 'f' }, h('span', { class: 'f__l', text: 'Last updated (optional)' }), upd, h('small', { class: 'f__h', text: 'Set when you make a real update; shown on the post and to Google.' }))),
    scoreCard,
    card('Featured image', imageField({ t: 'image', label: 'Image', optional: true, hint: 'Shown at the top of the post, on the blog page and in share cards.' }, sub(sub(bind, 'featuredImage'), 'src')),
      renderField({ t: 'text', label: 'Alt text', max: 250, optional: true }, sub(sub(bind, 'featuredImage'), 'alt'))),
    card('Organisation',
      h('label', { class: 'f' }, h('span', { class: 'f__l', text: 'Author' }), h('input', { type: 'text', value: p.author, oninput: (e) => { p.author = e.target.value; bind.changed(); } })),
      h('label', { class: 'f' }, h('span', { class: 'f__l', text: 'Category' }), h('input', { type: 'text', list: 'catlist', value: p.category, maxlength: 40, oninput: (e) => { p.category = e.target.value; bind.changed(); } }), catList),
      h('div', { class: 'f' }, h('span', { class: 'f__l', text: 'Tags' }), tagBox)),
    card('Layout', renderField(F.toc, sub(bind, 'toc'))));

  const main = h('div', { class: 'col-main' },
    card(null,
      h('label', { class: 'f' }, h('span', { class: 'f__l', text: 'Title' }), title),
      h('div', { class: 'f' }, h('div', { class: 'f__top' }, h('span', { class: 'f__l', text: 'Content' }), words), editor.el)),
    card('Excerpt', excerpt),
    card(h('div', { class: 'card__headrow' }, h('h2', { class: 'card__t', text: 'Search engine listing' })), serpBox, h('details', { class: 'more', open: isNew || !p.seo.focusKeyword || null }, h('summary', { text: 'Edit search listing and SEO' }), listingEdit)),
    card('Social share preview', socialBox, h('details', { class: 'more' }, h('summary', { text: 'Edit social sharing' }), socialEdit)),
    card(null, renderList(F.faq, sub(bind, 'faq')), h('small', { class: 'f__h', text: 'Questions and answers shown at the end of the post and marked up as FAQ structured data, which can earn extra space in Google results.' })));

  root.append(head, h('div', { class: 'cols' }, main, side));

  function refresh() {
    statusBadge.textContent = ''; statusBadge.appendChild(p.draft ? badge('Hidden') : badge('Visible', 'good'));
    const n = wordsOf(p);
    words.textContent = `${n} words · ${Math.max(1, Math.round(n / 200))} min read`;
    const t = effTitle(p, suffix()), d = effDesc(p);
    tCount.textContent = `${t.length} characters`; dCount.textContent = `${d.length} characters`;
    tMeter.replaceChildren(meter(t.length, TITLE)); dMeter.replaceChildren(meter(d.length, DESC));
    seoTitle.placeholder = `${p.title}${suffix()}`; seoDesc.placeholder = p.excerpt;
    serpBox.replaceChildren(serpPreview({ url: url(), title: t, description: d, date: fmtDate(p.publishedAt) }));
    socialBox.replaceChildren(socialPreview({ url: url(), title: p.seo.ogTitle || t, description: p.seo.ogDescription || d, image: p.seo.ogImage || p.featuredImage.src }));
    const r = analyzePost(p, b.posts, suffix());
    scoreCard.replaceChildren(card(h('div', { class: 'card__headrow' }, h('h2', { class: 'card__t', text: 'SEO score' }), h('span', { class: `bigscore bigscore--${scoreTone(r.score)}`, text: `${r.score}` })),
      h('div', { class: `bar bar--${scoreTone(r.score)}` }, h('span', { style: { width: r.score + '%' } })),
      checklist(r)));
  }
  const refreshSoon = debounce(refresh, 120);
  bind.changed = () => { changed(); refreshSoon(); };
  refresh();
  if (isNew) setTimeout(() => title.focus(), 50);
  return () => {
    editor.destroy();
    /* a new post left completely empty is dropped rather than kept as a blank entry */
    const i = b.posts.indexOf(p);
    if (i !== -1 && !p.title.trim() && !p.excerpt.trim() && !wordsOf(p) && !S.saved.blog.posts.some(x => x.slug === p.slug && p.slug)) { b.posts.splice(i, 1); changed(); }
  };
}

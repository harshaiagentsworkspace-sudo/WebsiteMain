/* Ostendic admin: SEO analysis and previews.
   analyzePost() scores a post the way the common SEO plugins do: focus
   keyword placement, title and description length, length of the article,
   headings, image alt text, links and readability. Each check says what to
   do, not just what's wrong. */
import { h, icon, mediaUrl } from './dom.js';
import { stripTags } from '/build/schema.mjs';

export const TITLE = [30, 60], DESC = [70, 160];

export const words = (t) => (String(t).toLowerCase().match(/[a-z0-9À-ɏ’']+/g) || []);
const has = (text, kw) => !!kw && stripTags(text).toLowerCase().includes(kw.toLowerCase());
const blockText = (b) => b.items ? b.items.map(stripTags).join(' ') : b.html ? stripTags(b.html) : '';

export function postFacts(post) {
  const text = post.body.map(blockText).join(' ');
  const w = words(text);
  const links = [];
  for (const b of post.body) for (const s of b.items || [b.html || '']) for (const m of String(s).matchAll(/href="([^"]+)"/g)) links.push(m[1]);
  for (const b of post.body) if (b.type === 'button' || (b.type === 'img' && b.href)) links.push(b.href);
  const imgs = post.body.filter(b => b.type === 'img');
  const heads = post.body.filter(b => /^h[1-4]$/.test(b.type));
  const sentences = text.split(/[.!?]+\s/).map(s => words(s).length).filter(n => n > 0);
  const paras = post.body.filter(b => b.type === 'p').map(b => words(stripTags(b.html)).length);
  return {
    text, words: w.length, links,
    internal: links.filter(l => /^\/|^#/.test(l) || /ostendic\.com/.test(l)).length,
    external: links.filter(l => /^https?:\/\//.test(l) && !/ostendic\.com/.test(l)).length,
    imgs, missingAlt: imgs.filter(i => !i.alt || !i.alt.trim()).length,
    heads, h1s: heads.filter(x => x.type === 'h1').length, h2s: heads.filter(x => x.type === 'h2').length,
    avgSentence: sentences.length ? sentences.reduce((a, b) => a + b, 0) / sentences.length : 0,
    longParas: paras.filter(n => n > 150).length,
    firstPara: (post.body.find(b => b.type === 'p') || {}).html || '',
  };
}

export const effTitle = (post, suffix = '') => post.seo.title || `${post.title}${suffix}`;
export const effDesc = (post) => post.seo.description || post.excerpt;

export function analyzePost(post, all = [], suffix = '') {
  const f = postFacts(post);
  const kw = (post.seo.focusKeyword || '').trim();
  const title = effTitle(post, suffix), desc = effDesc(post);
  const C = [];
  const add = (state, text, weight = 1) => C.push({ state, text, weight });

  if (!kw) add('bad', 'Set a focus keyword: the phrase you want this post to be found for.', 2);
  else {
    add(has(title, kw) ? 'good' : 'bad', has(title, kw) ? 'The focus keyword is in the page title.' : 'Put the focus keyword in the page title, ideally near the start.', 2);
    add(has(desc, kw) ? 'good' : 'warn', has(desc, kw) ? 'The focus keyword is in the meta description.' : 'Use the focus keyword in the meta description.');
    const slugKw = kw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const inSlug = slugKw && (post.slug.includes(slugKw) || slugKw.split('-').filter(x => x.length > 3).every(x => post.slug.includes(x)));
    add(inSlug ? 'good' : 'warn', inSlug ? 'The URL handle contains the focus keyword.' : 'Include the focus keyword in the URL handle.');
    add(has(f.firstPara, kw) ? 'good' : 'warn', has(f.firstPara, kw) ? 'The focus keyword appears in the first paragraph.' : 'Mention the focus keyword in the first paragraph.');
    const inHead = f.heads.some(x => has(x.html, kw));
    add(inHead ? 'good' : 'warn', inHead ? 'A subheading uses the focus keyword.' : 'Use the focus keyword (or a close variant) in at least one subheading.');
    const n = (f.text.toLowerCase().match(new RegExp(kw.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    const density = f.words ? (n * words(kw).length / f.words) * 100 : 0;
    add(density >= 0.5 && density <= 2.5 ? 'good' : density > 2.5 ? 'bad' : 'warn',
      density > 2.5 ? `The focus keyword is overused (${density.toFixed(1)}%). Aim for 0.5–2.5%.` : density < 0.5 ? `The focus keyword appears ${n} time${n === 1 ? '' : 's'} (${density.toFixed(1)}%). Aim for 0.5–2.5%.` : `Keyword density is ${density.toFixed(1)}%. Good.`);
    const dup = all.find(p => p !== post && p.seo && (p.seo.focusKeyword || '').trim().toLowerCase() === kw.toLowerCase());
    if (dup) add('warn', `“${dup.title}” already targets this keyword. Pick a different one so the posts don’t compete.`);
  }
  add(title.length >= TITLE[0] && title.length <= TITLE[1] ? 'good' : title.length > TITLE[1] ? 'warn' : 'warn',
    title.length > TITLE[1] ? `The page title is ${title.length} characters; Google cuts off around 60.` : title.length < TITLE[0] ? `The page title is short (${title.length} characters). Aim for 30–60.` : `Page title length is good (${title.length}).`);
  add(!desc ? 'bad' : desc.length >= DESC[0] && desc.length <= DESC[1] ? 'good' : 'warn',
    !desc ? 'Write a meta description.' : desc.length > DESC[1] ? `The meta description is ${desc.length} characters; Google cuts off around 160.` : desc.length < DESC[0] ? `The meta description is short (${desc.length}). Aim for 70–160.` : `Meta description length is good (${desc.length}).`);
  add(f.words >= 600 ? 'good' : f.words >= 300 ? 'warn' : 'bad',
    f.words >= 600 ? `${f.words} words. A solid length.` : f.words >= 300 ? `${f.words} words. Posts of 600+ words tend to rank better.` : `Only ${f.words} words. Aim for at least 300.`, 2);
  if (f.h1s) add('bad', `The article has ${f.h1s} Heading 1 block${f.h1s > 1 ? 's' : ''}. The post title is already the page’s H1; use Heading 2 for sections.`, 2);
  add(f.h2s || f.words < 300 ? 'good' : 'warn', f.h2s ? `${f.h2s} section heading${f.h2s > 1 ? 's' : ''} (H2). Good structure.` : f.words < 300 ? 'Short post: subheadings are optional.' : 'Break the article up with Heading 2 subheadings.');
  let skipped = false; let lvl = 1;
  for (const x of f.heads) { const l = +x.type[1]; if (l > lvl + 1) skipped = true; lvl = l; }
  if (skipped) add('warn', 'A heading level is skipped (for example H2 straight to H4). Keep headings in order.');
  const fi = post.featuredImage || {};
  add(fi.src ? (fi.alt ? 'good' : 'warn') : 'warn', !fi.src ? 'Add a featured image. It shows on the blog page and when the post is shared.' : fi.alt ? 'The featured image has alt text.' : 'Add alt text to the featured image.');
  if (f.imgs.length) add(f.missingAlt ? 'bad' : 'good', f.missingAlt ? `${f.missingAlt} of ${f.imgs.length} image${f.imgs.length > 1 ? 's' : ''} in the article ${f.missingAlt > 1 ? 'have' : 'has'} no alt text.` : 'Every image in the article has alt text.', 2);
  else if (f.words > 400) add('warn', 'Consider adding an image to break up the text.');
  add(f.internal ? 'good' : 'warn', f.internal ? `${f.internal} link${f.internal > 1 ? 's' : ''} to other pages on this site.` : 'Link to at least one other page on this site (a service page or another post).');
  add(f.external ? 'good' : 'warn', f.external ? `${f.external} link${f.external > 1 ? 's' : ''} to other sites.` : 'Link to a trustworthy outside source where it helps the reader.', 0.5);
  if (f.avgSentence) add(f.avgSentence <= 20 ? 'good' : 'warn', f.avgSentence <= 20 ? `Sentences average ${Math.round(f.avgSentence)} words. Easy to read.` : `Sentences average ${Math.round(f.avgSentence)} words. Shorter sentences (under 20) read more easily.`);
  if (f.longParas) add('warn', `${f.longParas} paragraph${f.longParas > 1 ? 's are' : ' is'} over 150 words. Split long paragraphs.`);
  add(post.slug.length <= 60 ? 'good' : 'warn', post.slug.length <= 60 ? 'The URL handle is a good length.' : 'Shorten the URL handle (under 60 characters).', 0.5);
  const twin = all.find(p => p !== post && p.title.trim().toLowerCase() === post.title.trim().toLowerCase());
  if (twin) add('bad', 'Another post has the same title. Titles should be unique.', 2);
  if (post.seo.noindex) add('warn', 'This post is hidden from search engines (noindex).');

  const total = C.reduce((a, c) => a + c.weight, 0);
  const got = C.reduce((a, c) => a + c.weight * (c.state === 'good' ? 1 : c.state === 'warn' ? 0.5 : 0), 0);
  const score = Math.round((got / total) * 100);
  C.sort((a, b) => ({ bad: 0, warn: 1, good: 2 }[a.state] - { bad: 0, warn: 1, good: 2 }[b.state]));
  return { score, checks: C, facts: f };
}

/* page-level checks for the site-wide SEO view */
export function analyzeListing({ title, description, noindex }) {
  const issues = [];
  if (!title) issues.push(['bad', 'No title']);
  else if (title.length > TITLE[1]) issues.push(['warn', `Title ${title.length} chars (over 60)`]);
  else if (title.length < TITLE[0]) issues.push(['warn', `Title ${title.length} chars (under 30)`]);
  if (!description) issues.push(['bad', 'No meta description']);
  else if (description.length > DESC[1]) issues.push(['warn', `Description ${description.length} chars (over 160)`]);
  else if (description.length < DESC[0]) issues.push(['warn', `Description ${description.length} chars (under 70)`]);
  if (noindex) issues.push(['warn', 'Hidden from search engines']);
  return issues;
}

export const scoreTone = (n) => n >= 80 ? 'good' : n >= 50 ? 'warn' : 'bad';
export const scoreDot = (n) => h('span', { class: `score score--${scoreTone(n)}`, title: `SEO score ${n}/100` }, String(n));

export function checklist(result) {
  return h('ul', { class: 'checks' }, result.checks.map(c => h('li', { class: `checks__i is-${c.state}` },
    icon(c.state === 'good' ? 'check' : c.state === 'bad' ? 'x' : 'warn', 15), h('span', { text: c.text }))));
}

/* Google result preview */
export function serpPreview({ url, title, description, date }) {
  const cut = (s, n) => s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s;
  const u = new URL(url);
  return h('div', { class: 'serp', 'aria-label': 'Google search preview' },
    h('div', { class: 'serp__site' }, h('span', { class: 'serp__fav', 'aria-hidden': 'true', text: 'O' }),
      h('span', null, h('span', { class: 'serp__name', text: 'Ostendic' }), h('span', { class: 'serp__url', text: `${u.host} › ${u.pathname.split('/').filter(Boolean).join(' › ')}` }))),
    h('div', { class: 'serp__t', text: cut(title || '(no title)', 62) }),
    h('div', { class: 'serp__d' }, date ? h('span', { class: 'serp__date', text: date + ' — ' }) : null, cut(description || 'No meta description: Google will pick some text from the page.', 160)));
}

/* social share card preview (LinkedIn / WhatsApp / X style) */
export function socialPreview({ url, title, description, image }) {
  return h('div', { class: 'social' },
    h('div', { class: 'social__img' }, image ? h('img', { src: mediaUrl(image), alt: '' }) : h('span', { text: 'No share image: platforms show a plain link card' })),
    h('div', { class: 'social__body' },
      h('div', { class: 'social__host', text: new URL(url).host.toUpperCase() }),
      h('div', { class: 'social__t', text: title }),
      h('div', { class: 'social__d', text: description })));
}

/* ===========================================================================
   OSTENDIC — BLOG
   Posts live in content/blog.json and are edited in the admin panel's post
   editor. Each post's article is a list of blocks (paragraphs, headings,
   lists, images, quotes, code, embeds, buttons); inline formatting is a
   small whitelist of tags, sanitised again here on every render.
   Drafts are kept in the file but never built.
   =========================================================================== */
import { loadContent } from './content.mjs';
import { sanitizeInline, stripTags, embedInfo, safeHref } from './schema.mjs';
import { media } from './data.mjs';

const blog = loadContent('blog');

/* `indexable` is the admin panel's "Show the blog to search engines" switch.
   While it is off: /blog and every post page carry noindex, and no blog
   URL is written to sitemap.xml. */
export const BLOG_IS_PLACEHOLDER = !blog.indexable;

const today = new Date().toISOString().slice(0, 10);
/* published = not a draft; newest first by publish date, file order breaking ties */
export const posts = blog.posts
  .map((p, i) => ({ p, i }))
  .filter(({ p }) => !p.draft)
  .sort((a, b) => (b.p.publishedAt || '').localeCompare(a.p.publishedAt || '') || a.i - b.i)
  .map(({ p }) => p);
export const futureDated = posts.filter(p => p.publishedAt > today);

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const src = (s) => /^https?:\/\//.test(s) ? s : '/' + String(s).replace(/^\/+/, '');
const dims = (s, b = {}) => {
  const m = media.items[String(s).replace(/^\/+/, '')] || {};
  const w = b.w || m.w, h = b.h || m.h;
  return w && h ? ` width="${w}" height="${h}"` : '';
};

/* plain text of the article, for word counts and descriptions */
export const plainText = (post) => post.body.map(b =>
  b.items ? b.items.map(stripTags).join(' ') : b.html ? stripTags(b.html) : b.text || b.caption || '').join(' ');

export const readingTime = (post) => {
  const words = plainText(post).trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
};

export const anchor = (html, used) => {
  let base = stripTags(html).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'section';
  let id = base, n = 2;
  while (used.has(id)) id = `${base}-${n++}`;
  used.add(id);
  return id;
};

/* blocks -> { html, toc: [[level, id, text]] }. The post title is the
   page's <h1>; an H1 block in the body is rendered as an <h2>-sized h1
   only if the author chose it (the SEO check warns about it). */
export const renderBody = (blocks) => {
  const used = new Set();
  const toc = [];
  const html = blocks.map(b => {
    const inl = (h) => sanitizeInline(h);
    switch (b.type) {
      case 'p': return `<p>${inl(b.html)}</p>`;
      case 'h1': case 'h2': case 'h3': case 'h4': {
        const id = anchor(b.html, used);
        if (b.type === 'h2' || b.type === 'h3') toc.push([b.type === 'h2' ? 2 : 3, id, stripTags(b.html)]);
        return `<${b.type} id="${id}">${inl(b.html)}</${b.type}>`;
      }
      case 'ul': case 'ol': return `<${b.type}>${b.items.map(i => `<li>${inl(i)}</li>`).join('')}</${b.type}>`;
      case 'quote': return `<blockquote><p>${inl(b.html)}</p>${b.cite ? `<cite>${esc(b.cite)}</cite>` : ''}</blockquote>`;
      case 'hr': return '<hr>';
      case 'code': return `<pre><code>${esc(b.text)}</code></pre>`;
      case 'img': {
        const img = `<img src="${esc(src(b.src))}" alt="${esc(b.alt || '')}"${dims(b.src, b)} loading="lazy" decoding="async">`;
        const href = b.href ? safeHref(b.href) : '';
        const linked = href ? `<a href="${esc(href)}"${/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : ''}>${img}</a>` : img;
        return `<figure class="post__fig">${linked}${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ''}</figure>`;
      }
      case 'embed': {
        const e = embedInfo(b.url);
        return e ? `<figure class="post__embed"><iframe src="${e.src}" title="${esc(b.title || 'Embedded video')}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></figure>` : '';
      }
      case 'button': {
        const href = safeHref(b.href);
        return href ? `<p class="post__btn"><a class="btn btn--primary" href="${esc(href)}"${/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : ''}><span class="btn-label">${esc(b.label)}</span></a></p>` : '';
      }
      default: return '';
    }
  }).join('\n        ');
  return { html, toc };
};

export const fmtDate = (d) => {
  if (!d) return '';
  const [y, m, day] = d.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, day)).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
};

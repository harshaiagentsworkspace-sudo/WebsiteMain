/* Ostendic admin: rich text editor.
   The article is stored as blocks (see build/schema.mjs). This editor turns
   blocks into editable HTML, and editable HTML back into blocks, running
   every piece of inline HTML through the same sanitiser the build uses.
   Images, videos and buttons are non-editable cards inside the text that
   open a settings dialog when clicked.

   Features: paragraph / H1–H4 / quote / code, bold, italic, underline,
   strikethrough, links (new tab, nofollow), bulleted and numbered lists,
   images with alt text, captions and links, YouTube/Vimeo embeds, buttons,
   dividers, clear formatting, undo/redo, Markdown shortcuts (## , - , 1. , > ),
   clean paste from Word / Google Docs / web pages, drag-and-drop images,
   an HTML source view and full-screen writing. */
import { h, icon, btn, modal, toast, debounce, mediaUrl } from './dom.js';
import { sanitizeInline, stripTags, embedInfo, safeHref } from '/build/schema.mjs';

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ---------- blocks -> editable HTML ---------- */
const cardAttrs = (o) => Object.entries(o).map(([k, v]) => ` data-${k}="${esc(v ?? '')}"`).join('');
export function blocksToEditHtml(blocks) {
  return (blocks || []).map(b => {
    switch (b.type) {
      case 'p': return `<p>${sanitizeInline(b.html)}</p>`;
      case 'h1': case 'h2': case 'h3': case 'h4': return `<${b.type}>${sanitizeInline(b.html)}</${b.type}>`;
      case 'ul': case 'ol': return `<${b.type}>${b.items.map(i => `<li>${sanitizeInline(i)}</li>`).join('')}</${b.type}>`;
      case 'quote': return `<blockquote${cardAttrs({ cite: b.cite || '' })}><p>${sanitizeInline(b.html)}</p></blockquote>`;
      case 'code': return `<pre>${esc(b.text)}</pre>`;
      case 'hr': return '<hr>';
      case 'img': return imgCard(b);
      case 'embed': return embedCard(b);
      case 'button': return buttonCard(b);
      default: return '';
    }
  }).join('') || '<p><br></p>';
}
function imgCard(b) {
  return `<figure class="ed-card ed-img${b.alt ? '' : ' is-noalt'}" contenteditable="false"${cardAttrs({ block: 'img', src: b.src, alt: b.alt || '', caption: b.caption || '', href: b.href || '', w: b.w || '', h: b.h || '' })}>`
    + `<img src="${esc(mediaUrl(b.src))}" alt="">`
    + `<span class="ed-card__flag">${b.alt ? 'Alt: ' + esc(b.alt.slice(0, 60)) : 'Alt text missing'}</span>`
    + (b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : '') + '</figure>';
}
function embedCard(b) {
  const e = embedInfo(b.url) || {};
  const thumb = e.provider === 'youtube' ? `<img src="https://i.ytimg.com/vi/${e.id}/hqdefault.jpg" alt="">` : '<span class="ed-card__ph">Vimeo video</span>';
  return `<figure class="ed-card ed-embed" contenteditable="false"${cardAttrs({ block: 'embed', url: b.url, title: b.title || '' })}>${thumb}<span class="ed-card__flag">▶ ${esc(e.provider || 'video')}</span></figure>`;
}
function buttonCard(b) {
  return `<div class="ed-card ed-button" contenteditable="false"${cardAttrs({ block: 'button', label: b.label, href: b.href })}><span class="ed-btn">${esc(b.label)}</span><span class="ed-card__flag">${esc(b.href)}</span></div>`;
}

/* ---------- editable / pasted HTML -> blocks ---------- */
const inner = (el) => sanitizeInline(el.innerHTML);
const nonEmpty = (html) => stripTags(html).trim() || /<br>/.test(html) && false;

export function htmlToBlocks(root) {
  const out = [];
  const para = (html) => { const c = sanitizeInline(html); if (stripTags(c).trim()) out.push({ type: 'p', html: c }); };
  let loose = '';
  const flush = () => { if (loose) { para(loose); loose = ''; } };
  const walk = (node) => {
    for (const n of Array.from(node.childNodes)) {
      if (n.nodeType === 3) { if (n.textContent.trim()) loose += esc(n.textContent); continue; }
      if (n.nodeType !== 1) continue;
      const tag = n.tagName.toLowerCase();
      const ds = n.dataset || {};
      if (ds.block === 'img') { flush(); out.push(clean({ type: 'img', src: ds.src, alt: ds.alt, caption: ds.caption, href: ds.href, w: +ds.w || undefined, h: +ds.h || undefined })); continue; }
      if (ds.block === 'embed') { flush(); out.push(clean({ type: 'embed', url: ds.url, title: ds.title })); continue; }
      if (ds.block === 'button') { flush(); out.push({ type: 'button', label: ds.label, href: ds.href }); continue; }
      switch (tag) {
        case 'p': flush(); para(n.innerHTML); break;
        case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6': {
          flush(); const c = inner(n); if (stripTags(c).trim()) out.push({ type: tag > 'h4' ? 'h4' : tag, html: c.replace(/<\/?(strong|em)>/g, '') }); break;
        }
        case 'ul': case 'ol': {
          flush();
          const items = [];
          const collect = (list) => { for (const li of list.children) {
            if (li.tagName !== 'LI') continue;
            const c = li.cloneNode(true); c.querySelectorAll('ul,ol').forEach(x => x.remove());
            const t = sanitizeInline(c.innerHTML); if (stripTags(t).trim()) items.push(t);
            li.querySelectorAll(':scope > ul, :scope > ol').forEach(collect);
          } };
          collect(n);
          if (items.length) out.push({ type: tag, items });
          break;
        }
        case 'blockquote': {
          flush();
          const parts = Array.from(n.querySelectorAll('p')).map(p => sanitizeInline(p.innerHTML)).filter(x => stripTags(x).trim());
          const html = parts.length ? parts.join('<br>') : inner(n);
          if (stripTags(html).trim()) out.push(clean({ type: 'quote', html, cite: ds.cite }));
          break;
        }
        case 'pre': flush(); if (n.textContent.trim()) out.push({ type: 'code', text: n.textContent.replace(/\n$/, '') }); break;
        case 'hr': flush(); out.push({ type: 'hr' }); break;
        case 'img': {
          flush();
          const s = n.getAttribute('src') || '';
          if (/^(https?:\/\/|\/)/.test(s)) out.push(clean({ type: 'img', src: s.replace(/^\//, ''), alt: n.getAttribute('alt') || '' }));
          break;
        }
        case 'figure': {
          flush();
          const img = n.querySelector('img'), cap = n.querySelector('figcaption'), ifr = n.querySelector('iframe');
          if (ifr && embedInfo(ifr.src)) out.push({ type: 'embed', url: ifr.src });
          else if (img) out.push(clean({ type: 'img', src: (img.getAttribute('src') || '').replace(/^\//, ''), alt: img.getAttribute('alt') || '', caption: cap ? cap.textContent.trim() : '' }));
          break;
        }
        case 'iframe': flush(); if (embedInfo(n.src)) out.push({ type: 'embed', url: n.src }); break;
        case 'table': flush(); for (const tr of n.querySelectorAll('tr')) para(Array.from(tr.children).map(td => td.innerHTML).join(' · ')); break;
        case 'div': case 'section': case 'article': case 'main': case 'header': case 'footer': case 'body': case 'span':
          if (tag === 'span' || !Array.from(n.children).some(c => /^(P|H[1-6]|UL|OL|BLOCKQUOTE|PRE|HR|FIGURE|DIV|TABLE|IMG|SECTION)$/.test(c.tagName))) {
            if (tag === 'span') { loose += n.outerHTML; break; }
            flush(); para(n.innerHTML);
          } else { flush(); walk(n); }
          break;
        case 'br': if (loose) loose += '<br>'; else flush(); break;
        case 'script': case 'style': case 'meta': case 'link': case 'title': break;
        default: loose += n.outerHTML; // inline elements (a, strong, em, ...)
      }
    }
  };
  walk(root);
  flush();
  return out;
}
const clean = (o) => { for (const k of Object.keys(o)) if (o[k] === undefined || o[k] === '') delete o[k]; if (o.type === 'img') o.alt = o.alt || ''; return o; };

/* blocks -> the HTML the site renders (for the source view and preview) */
export function blocksToSiteHtml(blocks) {
  return (blocks || []).map(b => {
    switch (b.type) {
      case 'p': return `<p>${sanitizeInline(b.html)}</p>`;
      case 'h1': case 'h2': case 'h3': case 'h4': return `<${b.type}>${sanitizeInline(b.html)}</${b.type}>`;
      case 'ul': case 'ol': return `<${b.type}>\n${b.items.map(i => `  <li>${sanitizeInline(i)}</li>`).join('\n')}\n</${b.type}>`;
      case 'quote': return `<blockquote><p>${sanitizeInline(b.html)}</p>${b.cite ? `<cite>${esc(b.cite)}</cite>` : ''}</blockquote>`;
      case 'code': return `<pre><code>${esc(b.text)}</code></pre>`;
      case 'hr': return '<hr>';
      case 'img': {
        const img = `<img src="${esc(mediaUrl(b.src))}" alt="${esc(b.alt || '')}">`;
        const href = b.href ? safeHref(b.href) : '';
        return `<figure>${href ? `<a href="${esc(href)}">${img}</a>` : img}${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ''}</figure>`;
      }
      case 'embed': { const e = embedInfo(b.url); return e ? `<figure><iframe src="${e.src}" title="${esc(b.title || 'Embedded video')}" allowfullscreen></iframe></figure>` : ''; }
      case 'button': return `<p><a class="btn btn--primary" href="${esc(safeHref(b.href))}"><span class="btn-label">${esc(b.label)}</span></a></p>`;
      default: return '';
    }
  }).join('\n');
}

/* ---------- selection helpers ---------- */
let saved = null;
const saveSel = () => { const s = getSelection(); saved = s.rangeCount ? s.getRangeAt(0).cloneRange() : null; };
const restoreSel = (area) => {
  area.focus();
  if (saved) { const s = getSelection(); s.removeAllRanges(); s.addRange(saved); }
};
const blockOf = (node, area) => {
  while (node && node.parentNode !== area) node = node.parentNode;
  return node && node.parentNode === area ? node : null;
};
const exec = (cmd, val = null) => document.execCommand(cmd, false, val);

/* ---------- dialogs ---------- */
function field(label, input, hint) {
  return h('label', { class: 'f' }, h('span', { class: 'f__l', text: label }), input, hint ? h('small', { class: 'f__h', text: hint }) : null);
}

function linkDialog(area, existing) {
  const sel = getSelection();
  const text = existing ? existing.textContent : sel.toString();
  const url = h('input', { type: 'text', value: existing ? existing.getAttribute('href') : '', placeholder: 'https://… or /services', spellcheck: 'false' });
  const label = h('input', { type: 'text', value: text });
  const nf = h('input', { type: 'checkbox', checked: existing && /nofollow/.test(existing.getAttribute('rel') || '') });
  modal({
    title: existing ? 'Edit link' : 'Add link',
    body: h('div', { class: 'stack' },
      field('Link to', url, 'A page on this site starts with / (for example /contact). Other sites open in a new tab.'),
      field('Text', label),
      h('label', { class: 'check' }, nf, h('span', { text: 'Add rel="nofollow" (for sponsored or untrusted links)' }))),
    actions: [
      existing ? { label: 'Remove link', kind: 'plain', onclick: (c) => { const t = document.createTextNode(existing.textContent); existing.replaceWith(t); c(); area.dispatchEvent(new Event('input')); } } : null,
      { label: 'Cancel', onclick: (c) => c() },
      { label: existing ? 'Save link' : 'Add link', kind: 'primary', onclick: (c) => {
        const href = safeHref(url.value.trim());
        if (!href) { toast('Enter a link that starts with https://, /, mailto: or tel:', 'bad'); return; }
        const a = `<a href="${esc(href)}"${nf.checked ? ' rel="nofollow"' : ''}>${esc(label.value || href)}</a>`;
        c();
        if (existing) { existing.outerHTML = a; area.dispatchEvent(new Event('input')); }
        else { restoreSel(area); exec('insertHTML', a); }
      } },
    ].filter(Boolean),
  });
}

function imageDialog(area, card, pickMedia) {
  const d = card ? { ...card.dataset } : { src: '', alt: '', caption: '', href: '' };
  const prev = h('div', { class: 'ed-dlg__img' }, d.src ? h('img', { src: mediaUrl(d.src), alt: '' }) : h('span', { class: 'muted', text: 'No image chosen' }));
  const alt = h('textarea', { rows: 2, value: d.alt || '', maxlength: 250, placeholder: 'Describe what the image shows' });
  const cap = h('input', { type: 'text', value: d.caption || '', maxlength: 400 });
  const href = h('input', { type: 'text', value: d.href || '', placeholder: 'Optional: make the image a link' });
  let chosen = { src: d.src, w: d.w, h: d.h };
  const choose = () => pickMedia((m) => {
    chosen = { src: m.path, w: m.w || '', h: m.h || '' };
    prev.textContent = ''; prev.appendChild(h('img', { src: mediaUrl(m.path), alt: '' }));
    if (!alt.value && m.alt) alt.value = m.alt;
  });
  const m = modal({
    title: card ? 'Image settings' : 'Insert image', wide: true,
    body: h('div', { class: 'ed-dlg' }, h('div', null, prev, btn(chosen.src ? 'Replace image' : 'Choose image', { icon: 'image', onclick: choose })),
      h('div', { class: 'stack' },
        field('Alt text', alt, 'Read aloud by screen readers and used by Google Images. Describe the image in a short sentence; don’t start with “Image of”. Leave empty only for purely decorative images.'),
        field('Caption', cap, 'Shown under the image.'),
        field('Link', href))),
    actions: [
      card ? { label: 'Remove image', kind: 'danger', onclick: (c) => { card.remove(); c(); area.dispatchEvent(new Event('input')); } } : null,
      { label: 'Cancel', onclick: (c) => c() },
      { label: card ? 'Save' : 'Insert', kind: 'primary', onclick: (c) => {
        if (!chosen.src) { toast('Choose an image first.', 'bad'); return; }
        if (href.value.trim() && !safeHref(href.value.trim())) { toast('That link is not valid.', 'bad'); return; }
        const html = imgCard({ src: chosen.src, alt: alt.value.trim(), caption: cap.value.trim(), href: href.value.trim(), w: chosen.w, h: chosen.h });
        c();
        if (card) { card.outerHTML = html; area.dispatchEvent(new Event('input')); }
        else insertCard(area, html);
      } },
    ].filter(Boolean),
  });
  if (!card && !chosen.src) setTimeout(choose, 50);
  return m;
}

function embedDialog(area, card) {
  const url = h('input', { type: 'text', value: card ? card.dataset.url : '', placeholder: 'https://www.youtube.com/watch?v=…' });
  const title = h('input', { type: 'text', value: card ? card.dataset.title : '', placeholder: 'What the video is about' });
  modal({
    title: card ? 'Video settings' : 'Embed a video',
    body: h('div', { class: 'stack' }, field('YouTube or Vimeo link', url), field('Title (for accessibility)', title)),
    actions: [
      card ? { label: 'Remove video', kind: 'danger', onclick: (c) => { card.remove(); c(); area.dispatchEvent(new Event('input')); } } : null,
      { label: 'Cancel', onclick: (c) => c() },
      { label: card ? 'Save' : 'Embed', kind: 'primary', onclick: (c) => {
        if (!embedInfo(url.value)) { toast('Only YouTube and Vimeo links can be embedded.', 'bad'); return; }
        const html = embedCard({ url: url.value.trim(), title: title.value.trim() });
        c();
        if (card) { card.outerHTML = html; area.dispatchEvent(new Event('input')); } else insertCard(area, html);
      } },
    ].filter(Boolean),
  });
}

function buttonDialog(area, card) {
  const label = h('input', { type: 'text', value: card ? card.dataset.label : 'Book a call', maxlength: 60 });
  const href = h('input', { type: 'text', value: card ? card.dataset.href : '/contact', placeholder: '/contact' });
  modal({
    title: card ? 'Button settings' : 'Insert a button',
    body: h('div', { class: 'stack' }, field('Button text', label), field('Link to', href)),
    actions: [
      card ? { label: 'Remove button', kind: 'danger', onclick: (c) => { card.remove(); c(); area.dispatchEvent(new Event('input')); } } : null,
      { label: 'Cancel', onclick: (c) => c() },
      { label: card ? 'Save' : 'Insert', kind: 'primary', onclick: (c) => {
        if (!label.value.trim() || !safeHref(href.value.trim())) { toast('The button needs text and a valid link.', 'bad'); return; }
        const html = buttonCard({ label: label.value.trim(), href: href.value.trim() });
        c();
        if (card) { card.outerHTML = html; area.dispatchEvent(new Event('input')); } else insertCard(area, html);
      } },
    ].filter(Boolean),
  });
}

/* cards go between blocks, never inside a paragraph */
function insertCard(area, html) {
  restoreSel(area);
  const s = getSelection();
  const blk = s.rangeCount ? blockOf(s.getRangeAt(0).startContainer, area) : null;
  const tpl = document.createElement('template');
  tpl.innerHTML = html + '<p><br></p>';
  const nodes = Array.from(tpl.content.childNodes);
  if (blk && blk.nextSibling) area.insertBefore(tpl.content, blk.nextSibling);
  else area.appendChild(tpl.content);
  if (blk && blk.tagName === 'P' && !blk.textContent.trim() && !blk.querySelector('img')) blk.remove();
  const after = nodes[nodes.length - 1];
  const r = document.createRange(); r.setStart(after, 0); r.collapse(true); s.removeAllRanges(); s.addRange(r);
  area.dispatchEvent(new Event('input'));
}

/* ---------- the editor ---------- */
export function richEditor({ blocks, onChange, pickMedia, uploadFiles }) {
  const area = h('div', { class: 'ed-area prose-ed', contenteditable: 'true', role: 'textbox', 'aria-multiline': 'true', 'aria-label': 'Article', spellcheck: 'true' });
  area.innerHTML = blocksToEditHtml(blocks);
  const source = h('textarea', { class: 'ed-source', hidden: true, spellcheck: 'false', 'aria-label': 'HTML source' });
  let sourceMode = false;

  const emit = debounce(() => { if (!sourceMode) onChange(htmlToBlocks(area)); }, 200);
  area.addEventListener('input', () => { ensureP(); emit(); refreshState(); });

  /* always keep a paragraph to type into */
  const ensureP = () => {
    if (!area.firstChild) area.innerHTML = '<p><br></p>';
    const last = area.lastElementChild;
    if (last && last.classList.contains('ed-card')) area.appendChild(h('p', null, h('br')));
  };
  try { exec('defaultParagraphSeparator', 'p'); } catch { /* old browsers */ }

  /* ----- toolbar ----- */
  const fmt = h('select', { class: 'ed-fmt', 'aria-label': 'Text style', onmousedown: saveSel, onchange: () => {
    restoreSel(area);
    const v = fmt.value;
    if (v === 'pre') exec('formatBlock', 'pre');
    else if (v === 'blockquote') exec('formatBlock', 'blockquote');
    else exec('formatBlock', v);
    area.dispatchEvent(new Event('input'));
  } },
  [['p', 'Paragraph'], ['h1', 'Heading 1'], ['h2', 'Heading 2'], ['h3', 'Heading 3'], ['h4', 'Heading 4'], ['blockquote', 'Quote'], ['pre', 'Code block']]
    .map(([v, l]) => h('option', { value: v, text: l })));

  const tb = (name, label, fn, key) => {
    const b = h('button', { type: 'button', class: 'ed-tb', title: key ? `${label} (${key})` : label, 'aria-label': label, 'data-cmd': name,
      onmousedown: (e) => { e.preventDefault(); saveSel(); }, onclick: () => { fn(); refreshState(); } }, icon(name, 17));
    return b;
  };
  const cmd = (c, v) => () => { restoreSel(area); exec(c, v); area.dispatchEvent(new Event('input')); };
  const sep = () => h('span', { class: 'ed-sep', 'aria-hidden': 'true' });
  const htmlBtn = tb('code', 'Show HTML', () => toggleSource());
  const fullBtn = tb('expand', 'Full screen', () => wrap.classList.toggle('is-full'));
  const bar = h('div', { class: 'ed-bar', role: 'toolbar', 'aria-label': 'Formatting' },
    fmt, sep(),
    tb('bold', 'Bold', cmd('bold'), 'Ctrl+B'), tb('italic', 'Italic', cmd('italic'), 'Ctrl+I'),
    tb('underline', 'Underline', cmd('underline'), 'Ctrl+U'), tb('strike', 'Strikethrough', cmd('strikeThrough')), sep(),
    tb('link', 'Link', () => { restoreSel(area); const a = currentLink(); linkDialog(area, a); }, 'Ctrl+K'), tb('unlink', 'Remove link', cmd('unlink')), sep(),
    tb('ul', 'Bulleted list', cmd('insertUnorderedList')), tb('ol', 'Numbered list', cmd('insertOrderedList')), sep(),
    tb('image', 'Image', () => imageDialog(area, null, pickMedia)), tb('video', 'Video', () => embedDialog(area, null)),
    tb('button', 'Button', () => buttonDialog(area, null)), tb('hr', 'Divider', () => insertCard(area, '<hr>')), sep(),
    tb('eraser', 'Clear formatting', () => { restoreSel(area); exec('removeFormat'); exec('formatBlock', 'p'); area.dispatchEvent(new Event('input')); }),
    tb('undo', 'Undo', cmd('undo'), 'Ctrl+Z'), tb('redo', 'Redo', cmd('redo'), 'Ctrl+Y'),
    h('span', { class: 'ed-grow' }), htmlBtn, fullBtn);

  const currentLink = () => {
    const s = getSelection(); if (!s.rangeCount) return null;
    let n = s.anchorNode; while (n && n !== area) { if (n.nodeName === 'A') return n; n = n.parentNode; }
    return null;
  };

  /* reflect the caret's block type and marks in the toolbar */
  const refreshState = () => {
    if (sourceMode) return;
    const s = getSelection();
    if (!s.rangeCount || !area.contains(s.anchorNode)) return;
    const blk = blockOf(s.anchorNode, area);
    const t = blk ? blk.tagName.toLowerCase() : 'p';
    fmt.value = ['h1', 'h2', 'h3', 'h4', 'blockquote', 'pre'].includes(t) ? t : 'p';
    for (const [c, q] of [['bold', 'bold'], ['italic', 'italic'], ['underline', 'underline'], ['strike', 'strikeThrough'], ['ul', 'insertUnorderedList'], ['ol', 'insertOrderedList']]) {
      const b = bar.querySelector(`[data-cmd="${c}"]`); let on = false; try { on = document.queryCommandState(q); } catch { }
      b.classList.toggle('is-on', on);
    }
  };
  document.addEventListener('selectionchange', refreshState);

  /* ----- keyboard: shortcuts and Markdown ----- */
  area.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); saveSel(); linkDialog(area, currentLink()); return; }
    if (e.key === ' ') {
      const s = getSelection(); if (!s.rangeCount) return;
      const blk = blockOf(s.anchorNode, area);
      if (!blk || blk.tagName !== 'P') return;
      const t = blk.textContent;
      const map = { '#': 'h1', '##': 'h2', '###': 'h3', '####': 'h4', '>': 'blockquote' };
      const before = t.slice(0, s.anchorOffset);
      if (s.anchorNode.nodeType === 3 && blk.firstChild === s.anchorNode && (map[before] || before === '-' || before === '*' || before === '1.')) {
        e.preventDefault();
        s.anchorNode.textContent = t.slice(before.length);
        const r = document.createRange(); r.setStart(s.anchorNode, 0); r.collapse(true); s.removeAllRanges(); s.addRange(r);
        if (map[before]) exec('formatBlock', map[before]);
        else exec(before === '1.' ? 'insertOrderedList' : 'insertUnorderedList');
        area.dispatchEvent(new Event('input'));
      }
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      /* Enter at the end of a heading or quote continues with a paragraph */
      const s = getSelection(); const blk = s.rangeCount && blockOf(s.anchorNode, area);
      if (blk && /^(H[1-4]|BLOCKQUOTE)$/.test(blk.tagName)) {
        const r = s.getRangeAt(0); const end = document.createRange(); end.selectNodeContents(blk); end.setStart(r.endContainer, r.endOffset);
        if (!end.toString().length) { e.preventDefault(); const p = h('p', null, h('br')); blk.after(p); const nr = document.createRange(); nr.setStart(p, 0); nr.collapse(true); s.removeAllRanges(); s.addRange(nr); area.dispatchEvent(new Event('input')); }
      }
    }
  });

  /* ----- cards: click opens settings ----- */
  area.addEventListener('click', (e) => {
    const c = e.target.closest('.ed-card, hr');
    if (!c || !area.contains(c)) return;
    if (c.tagName === 'HR') return;
    saveSel();
    const k = c.dataset.block;
    if (k === 'img') imageDialog(area, c, pickMedia);
    else if (k === 'embed') embedDialog(area, c);
    else if (k === 'button') buttonDialog(area, c);
  });
  area.addEventListener('dblclick', (e) => { const a = e.target.closest('a'); if (a && area.contains(a)) { e.preventDefault(); linkDialog(area, a); } });

  /* ----- clean paste ----- */
  area.addEventListener('paste', (e) => {
    const cd = e.clipboardData; if (!cd) return;
    const files = Array.from(cd.files || []).filter(f => f.type.startsWith('image/'));
    if (files.length && uploadFiles) { e.preventDefault(); saveSel(); uploadFiles(files, (m) => insertCard(area, imgCard({ src: m.path, alt: m.alt || '', w: m.w, h: m.h }))); return; }
    const html = cd.getData('text/html');
    const text = cd.getData('text/plain');
    e.preventDefault();
    if (html) {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      doc.querySelectorAll('[style*="font-weight:700"],[style*="font-weight: 700"],[style*="font-weight:bold"]').forEach(n => { if (n.tagName === 'SPAN') { const b = doc.createElement('strong'); b.innerHTML = n.innerHTML; n.replaceWith(b); } });
      doc.querySelectorAll('[style*="font-style:italic"]').forEach(n => { if (n.tagName === 'SPAN') { const i = doc.createElement('em'); i.innerHTML = n.innerHTML; n.replaceWith(i); } });
      const blocks = htmlToBlocks(doc.body);
      if (blocks.length === 1 && blocks[0].type === 'p') exec('insertHTML', blocks[0].html);
      else if (blocks.length) exec('insertHTML', blocksToEditHtml(blocks));
    } else if (text) {
      const parts = text.replace(/\r/g, '').split(/\n\s*\n/).map(t => t.trim()).filter(Boolean);
      if (parts.length <= 1) exec('insertText', text);
      else exec('insertHTML', parts.map(p => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join(''));
    }
  });

  /* ----- drag and drop images ----- */
  area.addEventListener('dragover', (e) => { if (Array.from(e.dataTransfer.items || []).some(i => i.kind === 'file')) { e.preventDefault(); area.classList.add('is-drop'); } });
  area.addEventListener('dragleave', () => area.classList.remove('is-drop'));
  area.addEventListener('drop', (e) => {
    const files = Array.from(e.dataTransfer.files || []).filter(f => f.type.startsWith('image/'));
    area.classList.remove('is-drop');
    if (!files.length || !uploadFiles) return;
    e.preventDefault();
    const r = document.caretRangeFromPoint ? document.caretRangeFromPoint(e.clientX, e.clientY) : null;
    if (r) { const s = getSelection(); s.removeAllRanges(); s.addRange(r); saveSel(); }
    uploadFiles(files, (m) => insertCard(area, imgCard({ src: m.path, alt: m.alt || '', w: m.w, h: m.h })));
  });

  /* ----- HTML source view ----- */
  function toggleSource() {
    sourceMode = !sourceMode;
    if (sourceMode) {
      source.value = blocksToSiteHtml(htmlToBlocks(area));
      area.hidden = true; source.hidden = false; source.style.height = Math.max(area.offsetHeight, 320) + 'px'; source.focus();
    } else {
      const doc = new DOMParser().parseFromString(`<body>${source.value}</body>`, 'text/html');
      const blocks = htmlToBlocks(doc.body);
      area.innerHTML = blocksToEditHtml(blocks);
      source.hidden = true; area.hidden = false; onChange(blocks);
    }
    htmlBtn.classList.toggle('is-on', sourceMode);
    bar.querySelectorAll('.ed-tb, .ed-fmt').forEach(b => { if (b !== htmlBtn && b !== fullBtn) b.disabled = sourceMode; });
  }
  source.addEventListener('input', debounce(() => {
    const doc = new DOMParser().parseFromString(`<body>${source.value}</body>`, 'text/html');
    onChange(htmlToBlocks(doc.body));
  }, 400));

  const wrap = h('div', { class: 'ed' }, bar, area, source,
    h('div', { class: 'ed-foot' }, h('span', { class: 'muted', text: 'Tips: type ## and a space for a heading, - for a list, > for a quote. Paste from Word or Google Docs keeps headings, lists and links. Drop images straight in.' })));
  wrap.addEventListener('keydown', (e) => { if (e.key === 'Escape' && wrap.classList.contains('is-full')) wrap.classList.remove('is-full'); });

  return {
    el: wrap,
    setBlocks: (b) => { area.innerHTML = blocksToEditHtml(b); },
    focus: () => area.focus(),
    destroy: () => document.removeEventListener('selectionchange', refreshState),
  };
}

/* ---------- inline rich field (one paragraph: bold, italic, links) ---------- */
export function inlineEditor({ value, onChange, label }) {
  const area = h('div', { class: 'ed-inline', contenteditable: 'true', role: 'textbox', 'aria-label': label || 'Text' });
  area.innerHTML = sanitizeInline(value || '');
  const emit = () => onChange(sanitizeInline(area.innerHTML).replace(/<br>$/, ''));
  area.addEventListener('input', debounce(emit, 150));
  area.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') e.preventDefault();
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); saveSel(); linkDialog(area, null); }
  });
  area.addEventListener('paste', (e) => { e.preventDefault(); exec('insertText', (e.clipboardData.getData('text/plain') || '').replace(/\s*\n\s*/g, ' ')); });
  const mk = (name, label, fn) => h('button', { type: 'button', class: 'ed-tb', title: label, 'aria-label': label, onmousedown: (e) => { e.preventDefault(); saveSel(); }, onclick: fn }, icon(name, 15));
  const tools = h('div', { class: 'ed-inline__bar' },
    mk('bold', 'Bold', () => { restoreSel(area); exec('bold'); emit(); }),
    mk('italic', 'Italic', () => { restoreSel(area); exec('italic'); emit(); }),
    mk('link', 'Link', () => { restoreSel(area); let n = getSelection().anchorNode; while (n && n !== area && n.nodeName !== 'A') n = n.parentNode; linkDialog(area, n && n.nodeName === 'A' ? n : null); }),
    mk('unlink', 'Remove link', () => { restoreSel(area); exec('unlink'); emit(); }));
  area.addEventListener('input', () => {});
  const obs = new MutationObserver(debounce(emit, 150)); obs.observe(area, { childList: true, subtree: true, characterData: true });
  return h('div', { class: 'ed-inline-wrap' }, tools, area);
}

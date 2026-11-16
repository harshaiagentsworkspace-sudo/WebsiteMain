/* Ostendic admin: DOM helpers, icons, modals and toasts.
   Every piece of content is set with textContent / value. The only HTML
   strings set with innerHTML are the icon SVGs below and editor content
   that has been through sanitizeInline (build/schema.mjs). */

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
export const clone = (o) => o === undefined ? undefined : JSON.parse(JSON.stringify(o));
export const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/* h('div', {class: 'x', onclick: fn}, child, 'text') */
export function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'class') el.className = v;
    else if (k === 'text') el.textContent = v;
    else if (k === 'value') el.value = v;
    else if (k === 'checked') el.checked = !!v;
    else if (k === 'html') el.innerHTML = v; // icons and sanitised editor HTML only
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat(Infinity)) {
    if (c === null || c === undefined || c === false) continue;
    el.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
  }
  return el;
}

/* ---------- icons (24px stroke icons) ---------- */
const P = {
  dashboard: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z"/>',
  post: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  page: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
  work: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  redirect: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
  up: '<path d="m18 15-6-6-6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  left: '<path d="m15 18-6-6 6-6"/>',
  right: '<path d="m9 18 6-6-6-6"/>',
  external: '<path d="M7 17 17 7M9 7h8v8"/>',
  bold: '<path d="M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z"/>',
  italic: '<path d="M19 4h-9M14 20H5M15 4 9 20"/>',
  underline: '<path d="M6 4v6a6 6 0 0 0 12 0V4M4 20h16"/>',
  strike: '<path d="M16 4H9a3 3 0 0 0-2.83 4M14 12a4 4 0 0 1 0 8H6M4 12h16"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  unlink: '<path d="m18.84 12.25 1.72-1.71a5 5 0 0 0-7.07-7.07l-1.72 1.71M5.17 11.75l-1.71 1.71a5 5 0 0 0 7.07 7.07l1.71-1.71M8 2v3M2 8h3M16 22v-3M22 16h-3"/>',
  ul: '<path d="M9 6h12M9 12h12M9 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
  ol: '<path d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>',
  quote: '<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.76-2-2-2H4c-1.25 0-2 .75-2 1.97V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .01-1 1.03V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.76-2-2-2h-4c-1.25 0-2 .75-2 1.97V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>',
  code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  video: '<rect x="2" y="5" width="15" height="14" rx="2"/><path d="m22 8-5 4 5 4z"/>',
  hr: '<path d="M3 12h18"/>',
  button: '<rect x="3" y="8" width="18" height="8" rx="4"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  redo: '<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>',
  eraser: '<path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21M22 21H7M5 11l9 9"/>',
  expand: '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  warn: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  history: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5M12 7v5l4 2"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  sparkle: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
  drag: '<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',
  dup: '<rect x="8" y="8" width="14" height="14" rx="2"/><path d="M4 16V4a2 2 0 0 1 2-2h12"/>',
  h: '<path d="M6 4v16M18 4v16M6 12h12"/>',
  toc: '<path d="M3 6h18M7 12h14M11 18h10"/>',
};
export const icon = (name, size = 18) => {
  const s = document.createElement('span');
  s.className = 'ico';
  s.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ''}</svg>`;
  return s;
};

/* button helper: btn('Save', {kind:'primary', icon:'check', onclick}) */
export const btn = (label, o = {}) => h('button', {
  type: 'button', class: `b b--${o.kind || 'default'}${o.small ? ' b--sm' : ''}${o.iconOnly ? ' b--icon' : ''}${o.class ? ' ' + o.class : ''}`,
  onclick: o.onclick, disabled: o.disabled, title: o.title || (o.iconOnly ? label : null), 'aria-label': o.iconOnly ? label : null,
}, o.icon ? icon(o.icon, o.small ? 16 : 18) : null, o.iconOnly ? null : h('span', { text: label }));
export const linkBtn = (label, href, o = {}) => h('a', {
  class: `b b--${o.kind || 'default'}${o.small ? ' b--sm' : ''}`, href, target: o.blank ? '_blank' : null, rel: o.blank ? 'noopener' : null,
}, o.icon ? icon(o.icon, o.small ? 16 : 18) : null, h('span', { text: label }));

export const badge = (text, tone = '') => h('span', { class: `badge${tone ? ' badge--' + tone : ''}`, text });
export const card = (title, ...kids) => h('section', { class: 'card' },
  title ? h('div', { class: 'card__head' }, typeof title === 'string' ? h('h2', { class: 'card__t', text: title }) : title) : null, ...kids);

/* ---------- toasts ---------- */
let toastTimer;
export function toast(msg, tone = '') {
  let t = $('#toast');
  t.textContent = msg; t.className = `toast${tone ? ' toast--' + tone : ''}`; t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 4500);
}

/* ---------- modal ----------
   modal({ title, body, actions: [{label, kind, onclick(close)}], wide })
   returns { close, el } */
export function modal({ title, body, actions = [], wide = false, onclose }) {
  const prev = document.activeElement;
  const close = () => { wrap.remove(); document.removeEventListener('keydown', onKey); onclose && onclose(); prev && prev.focus && prev.focus(); };
  const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
  const box = h('div', { class: `modal${wide ? ' modal--wide' : ''}`, role: 'dialog', 'aria-modal': 'true', 'aria-label': title },
    h('div', { class: 'modal__head' }, h('h2', { class: 'modal__t', text: title }), btn('Close', { iconOnly: true, icon: 'x', kind: 'plain', onclick: close })),
    h('div', { class: 'modal__body' }, body),
    actions.length ? h('div', { class: 'modal__foot' }, actions.map(a => btn(a.label, { kind: a.kind, icon: a.icon, onclick: () => a.onclick(close) }))) : null);
  const wrap = h('div', { class: 'modal-wrap', onmousedown: (e) => { if (e.target === wrap) close(); } }, box);
  document.body.appendChild(wrap);
  document.addEventListener('keydown', onKey);
  setTimeout(() => { const f = box.querySelector('input, textarea, select, [contenteditable="true"]') || box.querySelector('.modal__foot button:last-child'); f && f.focus(); }, 30);
  return { close, el: box };
}
export const confirmBox = (title, text, okLabel = 'Confirm', danger = false) => new Promise((res) => {
  let done = false;
  modal({ title, body: h('p', { class: 'muted', text }), onclose: () => { if (!done) res(false); },
    actions: [{ label: 'Cancel', onclick: (c) => { done = true; res(false); c(); } },
      { label: okLabel, kind: danger ? 'danger' : 'primary', onclick: (c) => { done = true; res(true); c(); } }] });
});

/* ---------- small utilities ---------- */
export const debounce = (fn, ms = 250) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
export const slugify = (t) => String(t).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80).replace(/-+$/, '');
export const ago = (iso) => {
  const s = (Date.now() - Date.parse(iso)) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)} d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};
export const fmtDate = (d) => d ? new Date(d + (d.length === 10 ? 'T00:00:00' : '')).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
export const bytes = (n) => n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(0)} KB` : `${(n / 1048576).toFixed(1)} MB`;
export const mediaUrl = (p) => !p ? '' : /^https?:\/\//.test(p) ? p : '/' + String(p).replace(/^\/+/, '');
export const autosize = (ta) => { const f = () => { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight + 2, 640) + 'px'; }; ta.addEventListener('input', f); requestAnimationFrame(f); return ta; };

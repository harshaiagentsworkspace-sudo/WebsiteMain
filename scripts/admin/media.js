/* Ostendic admin: media library, uploads and the image picker.
   Uploads are resized in the browser (longest side 2000px) and converted to
   WebP when that makes them smaller, so pages stay fast without any manual
   image work. Alt text and titles are kept in content/media.json and are
   offered as the default whenever the image is inserted. */
import { h, icon, btn, badge, toast, modal, confirmBox, bytes, mediaUrl, debounce } from './dom.js';
import { S, api, mediaSynced, changed } from './state.js';

export const M = { items: null, loading: null };

export async function loadMedia(force = false) {
  if (M.items && !force) return M.items;
  if (M.loading) return M.loading;
  M.loading = api('GET', 'media').then(r => {
    M.loading = null;
    if (r.status !== 200) throw new Error(r.data.error || 'Could not load media');
    M.items = r.data.items;
    return M.items;
  });
  return M.loading;
}
const meta = (p) => (S.work.media.items[p] || {});

/* ---------- upload pipeline ---------- */
const readDims = (url) => new Promise((res) => { const i = new Image(); i.onload = () => res({ w: i.naturalWidth, h: i.naturalHeight, img: i }); i.onerror = () => res(null); i.src = url; });
const toDataUrl = (blob) => new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(blob); });

async function prepare(file) {
  const raster = /^image\/(png|jpeg|webp)$/.test(file.type);
  const url = URL.createObjectURL(file);
  const d = await readDims(url);
  let out = file, w = d && d.w, hh = d && d.h;
  if (raster && d) {
    const scale = Math.min(1, 2000 / Math.max(d.w, d.h));
    if (scale < 1 || file.size > 300_000 || file.type !== 'image/webp') {
      const c = document.createElement('canvas');
      c.width = Math.round(d.w * scale); c.height = Math.round(d.h * scale);
      c.getContext('2d').drawImage(d.img, 0, 0, c.width, c.height);
      const webp = await new Promise(r => c.toBlob(r, 'image/webp', 0.84));
      if (webp && webp.type === 'image/webp' && (webp.size < file.size || scale < 1)) { out = webp; w = c.width; hh = c.height; }
    }
  }
  URL.revokeObjectURL(url);
  if (out.size > 4_000_000) throw new Error(`${file.name} is still over 4 MB after resizing.`);
  const alt = file.name.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  return { name: file.name, data: await toDataUrl(out), w, h: hh, size: out.size, alt: /^(img|image|dsc|screenshot|photo|pasted)\b/i.test(alt) ? '' : alt };
}

/* uploads files one at a time; calls done(item) for each */
export async function uploadFiles(files, done) {
  for (const f of files) {
    if (!/^image\//.test(f.type)) { toast(`${f.name} is not an image.`, 'bad'); continue; }
    toast(`Uploading ${f.name}…`);
    try {
      const p = await prepare(f);
      const r = await api('POST', 'media', { name: p.name, data: p.data, alt: p.alt, w: p.w, h: p.h, sha: S.sha.media });
      if (r.status !== 200) { toast(r.data.error || 'Upload failed', 'bad'); continue; }
      const m = { alt: p.alt, title: '', ...(p.w ? { w: p.w, h: p.h } : {}) };
      mediaSynced(r.data.sha, r.data.path, m);
      const item = { path: r.data.path, size: p.size, uploaded: true, preview: p.data, ...m };
      if (M.items) M.items.unshift(item);
      toast(r.data.live === 'deploy' ? `Uploaded ${f.name}. It appears on the live site after the next deploy (about a minute).` : `Uploaded ${f.name}.`, 'ok');
      done && done(item);
    } catch (e) { if (e.message !== 'auth') toast(e.message, 'bad'); }
  }
}

const thumbSrc = (it) => it.preview || mediaUrl(it.path);

/* where an image is used, by searching every content file */
export function usage(path) {
  const out = [];
  for (const [n, d] of Object.entries(S.work)) if (n !== 'media' && JSON.stringify(d).includes(path)) out.push(n);
  return out;
}

/* ---------- grid ---------- */
function grid(items, { onPick, onOpen, selected }) {
  return h('ul', { class: 'mgrid' }, items.map(it => {
    const m = meta(it.path);
    return h('li', null, h('button', { type: 'button', class: `mtile${selected === it.path ? ' is-sel' : ''}`, onclick: () => (onPick || onOpen)(it), title: it.path },
      h('span', { class: 'mtile__img' }, h('img', { src: thumbSrc(it), alt: '', loading: 'lazy' })),
      h('span', { class: 'mtile__name', text: it.path.split('/').pop() }),
      h('span', { class: 'mtile__meta' }, it.uploaded ? (m.alt ? null : badge('No alt', 'warn')) : badge('Site', ''))));
  }));
}

function filters(state, redraw) {
  const q = h('input', { type: 'search', placeholder: 'Search files and alt text', value: state.q, oninput: debounce((e) => { state.q = e.target.value; redraw(); }, 150) });
  const sel = h('select', { onchange: (e) => { state.f = e.target.value; redraw(); } },
    [['all', 'All images'], ['uploaded', 'Uploaded'], ['site', 'Site design assets'], ['noalt', 'Uploads missing alt text']].map(([v, l]) => h('option', { value: v, text: l, selected: state.f === v })));
  return h('div', { class: 'toolbar' }, h('div', { class: 'search' }, icon('search', 16), q), sel);
}
const applyFilter = (items, st) => items.filter(it => {
  const m = meta(it.path);
  if (st.f === 'uploaded' && !it.uploaded) return false;
  if (st.f === 'site' && it.uploaded) return false;
  if (st.f === 'noalt' && (m.alt || !it.uploaded)) return false;
  if (st.q) { const q = st.q.toLowerCase(); return it.path.toLowerCase().includes(q) || (m.alt || '').toLowerCase().includes(q); }
  return true;
});

const dropZone = (onFiles) => {
  const input = h('input', { type: 'file', accept: 'image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif', multiple: true, hidden: true, onchange: (e) => { onFiles(Array.from(e.target.files)); e.target.value = ''; } });
  const z = h('div', { class: 'drop', tabindex: 0, role: 'button', 'aria-label': 'Upload images',
    onclick: () => input.click(), onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } },
    ondragover: (e) => { e.preventDefault(); z.classList.add('is-over'); }, ondragleave: () => z.classList.remove('is-over'),
    ondrop: (e) => { e.preventDefault(); z.classList.remove('is-over'); onFiles(Array.from(e.dataTransfer.files)); } },
  icon('upload', 22), h('strong', { text: 'Drop images here or click to upload' }), h('small', { text: 'PNG, JPG, WebP, GIF, SVG. Large photos are resized and converted to WebP automatically.' }), input);
  return z;
};

/* ---------- details panel ---------- */
function details(it, onClose) {
  const m = S.work.media.items[it.path] || (S.work.media.items[it.path] = {});
  const used = usage(it.path);
  const alt = h('textarea', { rows: 3, maxlength: 250, value: m.alt || '', placeholder: 'Describe what the image shows', oninput: (e) => { m.alt = e.target.value; changed(); } });
  const title = h('input', { type: 'text', maxlength: 120, value: m.title || '', oninput: (e) => { m.title = e.target.value; changed(); } });
  const url = location.origin + mediaUrl(it.path);
  return h('aside', { class: 'mdetail card' },
    h('div', { class: 'mdetail__img' }, h('img', { src: thumbSrc(it), alt: '' })),
    h('dl', { class: 'kv' },
      h('dt', { text: 'File' }), h('dd', null, h('code', { text: it.path })),
      h('dt', { text: 'Size' }), h('dd', { text: `${bytes(it.size || 0)}${m.w ? ` · ${m.w}×${m.h}` : ''}` }),
      h('dt', { text: 'Used in' }), h('dd', { text: used.length ? used.join(', ') : 'Not used in editable content' })),
    h('label', { class: 'f' }, h('span', { class: 'f__l', text: 'Alt text' }), alt, h('small', { class: 'f__h', text: 'Default alt text whenever this image is inserted. Publish to save.' })),
    h('label', { class: 'f' }, h('span', { class: 'f__l', text: 'Title (internal)' }), title),
    h('div', { class: 'row' },
      btn('Copy URL', { small: true, icon: 'copy', onclick: () => navigator.clipboard.writeText(url).then(() => toast('URL copied')) }),
      h('a', { class: 'b b--sm', href: mediaUrl(it.path), target: '_blank', rel: 'noopener' }, icon('external', 16), h('span', { text: 'Open' })),
      it.uploaded ? btn('Delete', { small: true, kind: 'danger', icon: 'trash', onclick: async () => {
        if (used.length && !(await confirmBox('Image is in use', `This image is used in: ${used.join(', ')}. Deleting it leaves broken images there. Delete anyway?`, 'Delete', true))) return;
        if (!used.length && !(await confirmBox('Delete image', `Delete ${it.path}? This publishes immediately.`, 'Delete', true))) return;
        const r = await api('DELETE', 'media', { path: it.path, sha: S.sha.media });
        if (r.status !== 200) { toast(r.data.error || 'Delete failed', 'bad'); return; }
        mediaSynced(r.data.sha, it.path, null);
        M.items = M.items.filter(x => x.path !== it.path);
        toast('Image deleted.', 'ok'); onClose(true);
      } }) : h('small', { class: 'muted', text: 'Site design assets: their alt text is set in the page templates, and they can’t be deleted here.' })),
    btn('Close', { small: true, kind: 'plain', onclick: () => onClose(false) }));
}

/* ---------- the Media page ---------- */
export function mediaView(root) {
  const st = { q: '', f: 'all', open: null };
  const head = h('div', { class: 'phead' }, h('div', null, h('h1', { class: 'phead__t', text: 'Media' }), h('p', { class: 'muted', text: 'Every image on the site. Uploads go to /media and are published straight away; alt text edits publish with the save bar.' })));
  const body = h('div', { class: 'mlayout' });
  root.append(head, dropZone((fs) => uploadFiles(fs, () => draw())), body);
  const draw = () => {
    body.textContent = '';
    if (!M.items) { body.appendChild(h('p', { class: 'muted', text: 'Loading…' })); return; }
    const items = applyFilter(M.items, st);
    const noAlt = M.items.filter(i => i.uploaded && !meta(i.path).alt).length;
    body.append(h('div', { class: 'mlayout__main' }, filters(st, draw),
      h('p', { class: 'muted small', text: `${items.length} of ${M.items.length} images${noAlt ? ` · ${noAlt} without alt text` : ''}` }),
      items.length ? grid(items, { onOpen: (it) => { st.open = it; draw(); }, selected: st.open && st.open.path }) : h('p', { class: 'empty', text: 'No images match.' })),
      st.open ? details(st.open, () => { st.open = null; draw(); }) : '');
  };
  draw();
  loadMedia().then(draw).catch(e => { body.textContent = ''; body.appendChild(h('p', { class: 'notice notice--bad', text: e.message })); });
}

/* ---------- picker (modal) ---------- */
export function pickMedia(onPick) {
  const st = { q: '', f: 'all' };
  const body = h('div', { class: 'picker' });
  const m = modal({ title: 'Choose an image', wide: true, body });
  const draw = () => {
    body.textContent = '';
    body.appendChild(dropZone((fs) => uploadFiles(fs, (it) => { m.close(); onPick(it); })));
    if (!M.items) { body.appendChild(h('p', { class: 'muted', text: 'Loading…' })); return; }
    body.append(filters(st, draw), grid(applyFilter(M.items, st), { onPick: (it) => { m.close(); onPick({ ...it, ...meta(it.path) }); } }));
  };
  draw();
  loadMedia().then(draw).catch(e => toast(e.message, 'bad'));
}

/* Ostendic admin: shared state and the API.
   S.saved  = the published version of each content file
   S.work   = the copy being edited
   Publishing sends every file that differs, as one commit. */
import { clone, same, toast } from './dom.js';
import { validate, CONTENT_NAMES } from '/build/schema.mjs';

export const S = {
  session: {},
  saved: {}, sha: {}, work: {},
  loaded: false,
  saving: false,
  listeners: new Set(),
};
export { CONTENT_NAMES };

export const LABELS = { settings: 'Settings', home: 'Home page', services: 'Service pages', pages: 'Pages', work: 'Work', blog: 'Blog', media: 'Media details', redirects: 'Redirects' };

let onAuthLost = () => {};
export const setAuthLost = (fn) => { onAuthLost = fn; };

export async function api(method, path, body) {
  const r = await fetch('/api/admin/' + path, {
    method, credentials: 'same-origin',
    headers: body !== undefined ? { 'Content-Type': 'application/json', 'X-Ostendic-Admin': '1' } : { 'X-Ostendic-Admin': '1' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await r.json().catch(() => ({}));
  if (r.status === 401 && path !== 'login') { onAuthLost('Your session ended. Please log in again.'); throw new Error('auth'); }
  return { status: r.status, data };
}

export async function loadAll() {
  const r = await api('GET', 'content');
  if (r.status !== 200) throw new Error(r.data.error || 'Could not load the content.');
  for (const n of CONTENT_NAMES) {
    S.saved[n] = r.data[n].data; S.sha[n] = r.data[n].sha; S.work[n] = clone(r.data[n].data);
  }
  S.loaded = true;
  changed();
}

export const dirty = () => CONTENT_NAMES.filter(n => S.saved[n] && !same(S.saved[n], S.work[n]));
export const isDirty = (n) => S.saved[n] && !same(S.saved[n], S.work[n]);

/* views call this after editing S.work; the save bar listens */
export const changed = () => { for (const f of S.listeners) f(); };
export const onChange = (f) => { S.listeners.add(f); return () => S.listeners.delete(f); };

export const discard = (names = dirty()) => { for (const n of names) S.work[n] = clone(S.saved[n]); changed(); };

/* client-side check with the same validators the server uses */
export const problems = (names = dirty()) => names.flatMap(n => validate(n, S.work[n]).map(e => `${LABELS[n]}: ${e}`));

export async function publish(message) {
  if (S.saving) return { ok: false };
  const names = dirty();
  if (!names.length) return { ok: true, none: true };
  const errs = problems(names);
  if (errs.length) return { ok: false, errors: errs, error: 'Some fields need fixing before this can be published.' };
  S.saving = true; changed();
  try {
    const r = await api('PUT', 'content', { changes: names.map(n => ({ name: n, data: S.work[n], sha: S.sha[n] })), message });
    if (r.status !== 200) return { ok: false, error: r.data.error || 'Could not publish.', errors: r.data.errors };
    for (const n of names) { S.saved[n] = clone(S.work[n]); S.sha[n] = r.data.shas[n]; }
    return { ok: true, live: r.data.live, commit: r.data.commit };
  } catch (e) {
    return { ok: false, error: e.message === 'auth' ? '' : 'Could not reach the server.' };
  } finally { S.saving = false; changed(); }
}

/* the media library writes media.json on the server during an upload or
   delete; keep the local copies in step without losing unsaved alt edits */
export function mediaSynced(sha, path, meta) {
  S.sha.media = sha;
  if (meta === null) { delete S.saved.media.items[path]; delete S.work.media.items[path]; }
  else { S.saved.media.items[path] = clone(meta); if (!S.work.media.items[path]) S.work.media.items[path] = clone(meta); }
  changed();
}

export const liveNote = (res) => res.live === 'deploy' ? 'Published. The live site updates in about a minute.' : 'Saved. The site has been rebuilt.';
export const notifyPublished = (res) => toast(liveNote(res), 'ok');

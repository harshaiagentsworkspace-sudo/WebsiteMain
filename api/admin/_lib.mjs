/* Ostendic admin: shared helpers for the /api/admin/* functions.
   Files starting with "_" are not routes on Vercel.

   Login: one password (ADMIN_PASSWORD). A successful login sets an HttpOnly,
   SameSite=Strict session cookie signed with a key derived from that
   password, so changing the password signs everyone out.

   Storage, picked from the environment:
   - GITHUB_TOKEN set  -> read content from the GitHub repo and publish by
     committing (GITHUB_REPO, GITHUB_BRANCH). One publish is one commit, even
     when it changes several files or adds images. The commit triggers a
     Vercel deploy, which rebuilds the site from the new content.
   - ADMIN_LOCAL=1     -> local development (build/serve.mjs): read and write
     the files on disk, then rebuild the site straight away. Each save keeps
     a snapshot in .data/history/ so earlier versions can be restored.
   - neither           -> the panel reports that saving isn't configured. */
import { createHmac, createHash, timingSafeEqual } from 'node:crypto';
import { readFile, writeFile, mkdir, readdir, stat, unlink } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, sep } from 'node:path';
import { validate, CONTENT_FILES, CONTENT_NAMES, fromFile, toFile } from '../../build/content.mjs';

export const env = (k, d = '') => (globalThis.process.env[k] || d).trim();
const COOKIE = 'ostendic_admin';
const SESSION_HOURS = 12;
export const ROOT = fileURLToPath(new URL('../../', import.meta.url));

export const mode = () => env('GITHUB_TOKEN') ? 'github' : env('ADMIN_LOCAL') === '1' ? 'local' : 'none';
const branch = () => env('GITHUB_BRANCH', 'main');
const repo = () => env('GITHUB_REPO', 'harshaiagentsworkspace-sudo/WebsiteMain');

/* ---------- responses ---------- */
export const send = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.end(JSON.stringify(body));
};

export const readBody = async (req, limit = 2_000_000) => {
  if (req.body !== undefined && req.body !== null && req.body !== '') {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }
  const chunks = [];
  let size = 0;
  for await (const c of req) { size += c.length; if (size > limit) throw new Error('Request too large'); chunks.push(c); }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
};

export const query = (req) => new URL(req.url || '/', 'http://x').searchParams;

/* ---------- session ---------- */
const key = () => createHash('sha256').update(`ostendic-admin-session:${env('ADMIN_PASSWORD')}:${env('ADMIN_SESSION_SECRET')}`).digest();
const mac = (s) => createHmac('sha256', key()).update(s).digest('base64url');
const same = (a, b) => {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
};

export const passwordConfigured = () => env('ADMIN_PASSWORD').length > 0;
export const checkPassword = (pw) => passwordConfigured() &&
  same(createHash('sha256').update(String(pw)).digest('hex'), createHash('sha256').update(env('ADMIN_PASSWORD')).digest('hex'));

const cookieAttrs = (maxAge) =>
  `Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${mode() === 'local' ? '' : '; Secure'}`;

export const setSession = (res) => {
  const exp = String(Date.now() + SESSION_HOURS * 3600_000);
  res.setHeader('Set-Cookie', `${COOKIE}=${exp}.${mac(exp)}; ${cookieAttrs(SESSION_HOURS * 3600)}`);
};
export const clearSession = (res) => res.setHeader('Set-Cookie', `${COOKIE}=; ${cookieAttrs(0)}`);

const readCookie = (req) => {
  const m = (req.headers.cookie || '').split(/;\s*/).find(c => c.startsWith(COOKIE + '='));
  return m ? m.slice(COOKIE.length + 1) : '';
};
export const isAuthed = (req) => {
  if (!passwordConfigured()) return false;
  const [exp, sig] = readCookie(req).split('.');
  return !!exp && !!sig && same(sig, mac(exp)) && Number(exp) > Date.now();
};

/* Every call that changes something must come from the panel's own script:
   it sends this header, which a cross-site form or link cannot. Together
   with the SameSite=Strict cookie this blocks cross-site request forgery. */
export const fromPanel = (req) => req.headers['x-ostendic-admin'] === '1';

/* Standard guard for admin routes. Returns true when the request may go on. */
export const guard = (req, res, { write = req.method !== 'GET' } = {}) => {
  if (!isAuthed(req)) { send(res, 401, { error: 'Please log in again.' }); return false; }
  if (write && !fromPanel(req)) { send(res, 403, { error: 'Forbidden' }); return false; }
  return true;
};

/* ---------- GitHub ---------- */
export const gh = async (path, init = {}) => {
  const r = await fetch(`https://api.github.com/repos/${repo()}/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env('GITHUB_TOKEN')}`, Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'ostendic-admin', ...(init.headers || {}),
    },
  });
  const body = await r.json().catch(() => ({}));
  return { status: r.status, body };
};
const ghOk = (r, what) => {
  if (r.status >= 200 && r.status < 300) return r.body;
  throw new Error(`GitHub returned ${r.status} ${what}${r.body.message ? `: ${r.body.message}` : ''}`);
};

const sha1 = (s) => createHash('sha1').update(s).digest('hex');
/* git's blob id, so local and GitHub versions compare the same way */
const blobSha = (buf) => createHash('sha1').update(`blob ${buf.length}\0`).update(buf).digest('hex');

/* raw text of a repo file at the branch head (or at `ref`) */
export const readRaw = async (path, ref) => {
  if (mode() === 'github') {
    const b = ghOk(await gh(`contents/${encodeURI(path)}?ref=${encodeURIComponent(ref || branch())}`), `reading ${path}`);
    if (b.content === undefined) throw new Error(`${path} is not a file`);
    const raw = b.encoding === 'base64' && b.content ? Buffer.from(b.content, 'base64').toString('utf8')
      : (await (await fetch(b.download_url, { headers: { Authorization: `Bearer ${env('GITHUB_TOKEN')}` } })).text());
    return { raw, sha: b.sha };
  }
  const buf = await readFile(join(ROOT, path));
  return { raw: buf.toString('utf8'), sha: blobSha(buf) };
};

export const readContent = async (name, ref) => {
  const { raw, sha } = await readRaw(CONTENT_FILES[name], ref);
  return { data: fromFile(name, raw), sha };
};
export const readAll = async () => {
  const out = {};
  await Promise.all(CONTENT_NAMES.map(async n => { out[n] = await readContent(n); }));
  return out;
};

/* ---------- committing ----------
   files: [{ path, content: Buffer|string } | { path, delete: true }] */
export const commitFiles = async (files, message) => {
  if (mode() === 'github') {
    const ref = ghOk(await gh(`git/ref/heads/${encodeURIComponent(branch())}`), 'reading the branch');
    const head = ref.object.sha;
    const commit = ghOk(await gh(`git/commits/${head}`), 'reading the last commit');
    const tree = [];
    for (const f of files) {
      if (f.delete) { tree.push({ path: f.path, mode: '100644', type: 'blob', sha: null }); continue; }
      const buf = Buffer.isBuffer(f.content) ? f.content : Buffer.from(f.content, 'utf8');
      const blob = ghOk(await gh('git/blobs', { method: 'POST', body: JSON.stringify({ content: buf.toString('base64'), encoding: 'base64' }) }), `uploading ${f.path}`);
      tree.push({ path: f.path, mode: '100644', type: 'blob', sha: blob.sha });
    }
    const t = ghOk(await gh('git/trees', { method: 'POST', body: JSON.stringify({ base_tree: commit.tree.sha, tree }) }), 'building the commit');
    const c = ghOk(await gh('git/commits', { method: 'POST', body: JSON.stringify({ message, tree: t.sha, parents: [head] }) }), 'creating the commit');
    const u = await gh(`git/refs/heads/${encodeURIComponent(branch())}`, { method: 'PATCH', body: JSON.stringify({ sha: c.sha }) });
    if (u.status === 422) throw Object.assign(new Error('Someone else published at the same moment. Reload and try again.'), { status: 409 });
    ghOk(u, 'updating the branch');
    return { commit: c.sha, url: c.html_url };
  }
  if (mode() === 'local') {
    for (const f of files) {
      const p = join(ROOT, f.path);
      if (f.delete) { await unlink(p).catch(() => {}); continue; }
      await mkdir(dirname(p), { recursive: true });
      await writeFile(p, f.content);
    }
    return { commit: null };
  }
  throw Object.assign(new Error('Saving is not set up yet: add GITHUB_TOKEN in Vercel (see .env.example).'), { status: 503 });
};

export const rebuild = () => new Promise((resolve) => {
  execFile(globalThis.process.execPath, ['build/build.mjs'], { cwd: ROOT, timeout: 120_000 }, (err, stdout, stderr) =>
    resolve(err ? { ok: false, log: String(stderr || err.message).slice(-2000) } : { ok: true }));
});

const LABEL = { settings: 'site settings', home: 'home page', services: 'service pages', pages: 'pages', work: 'work', blog: 'blog', media: 'media library', redirects: 'redirects' };
export const labelOf = (n) => LABEL[n] || n;

/* Publishes content changes (and optional extra files such as images) as
   one commit. changes: [{ name, data, sha }]. `sha` is the version the
   editor started from; if the file changed since, nothing is saved. */
export const saveContent = async (changes, { extraFiles = [], message } = {}) => {
  const errors = [];
  for (const c of changes) {
    if (!CONTENT_FILES[c.name]) return { status: 400, body: { error: `Unknown content "${c.name}"` } };
    errors.push(...validate(c.name, c.data).map(e => `${labelOf(c.name)}: ${e}`));
  }
  if (errors.length) return { status: 422, body: { error: 'Some fields need fixing before this can be published.', errors } };

  const current = {};
  for (const c of changes) {
    const { raw, sha } = await readRaw(CONTENT_FILES[c.name]);
    if (sha !== c.sha) return { status: 409, body: { error: `The ${labelOf(c.name)} changed somewhere else since you opened it. Reload to get the latest version, then make your edit again.` } };
    current[c.name] = raw;
  }
  const files = changes.map(c => ({ path: CONTENT_FILES[c.name], content: toFile(c.name, c.data, current[c.name]) }));
  const msg = message || `Admin: update ${changes.map(c => labelOf(c.name)).join(', ')}`;

  if (mode() === 'local') {
    const extraBackup = [];
    for (const f of extraFiles) extraBackup.push({ path: f.path, before: await readFile(join(ROOT, f.path)).catch(() => null) });
    await commitFiles([...files, ...extraFiles], msg);
    const built = await rebuild();
    if (!built.ok) {
      await commitFiles(changes.map(c => ({ path: CONTENT_FILES[c.name], content: current[c.name] })), 'rollback');
      for (const b of extraBackup) await commitFiles([b.before ? { path: b.path, content: b.before } : { path: b.path, delete: true }], 'rollback');
      await rebuild();
      return { status: 500, body: { error: 'The site failed to build with this change, so it was undone.', errors: [built.log] } };
    }
    for (const c of changes) await snapshot(c.name, current[c.name], msg);
    const shas = {};
    for (const f of files) shas[Object.keys(CONTENT_FILES).find(n => CONTENT_FILES[n] === f.path)] = blobSha(Buffer.from(f.content, 'utf8'));
    return { status: 200, body: { ok: true, shas, live: 'now' } };
  }

  try {
    const out = await commitFiles([...files, ...extraFiles], msg);
    const shas = {};
    for (const f of files) shas[Object.keys(CONTENT_FILES).find(n => CONTENT_FILES[n] === f.path)] = blobSha(Buffer.from(f.content, 'utf8'));
    return { status: 200, body: { ok: true, shas, commit: out.url, live: 'deploy' } };
  } catch (e) {
    return { status: e.status || 502, body: { error: e.message } };
  }
};

/* ---------- history ----------
   GitHub mode: the commits that touched the file. Local mode: snapshots of
   the file as it was before each save, in .data/history/<name>/. */
const HIST = join(ROOT, '.data', 'history');
const snapshot = async (name, raw, message) => {
  const dir = join(HIST, name);
  await mkdir(dir, { recursive: true });
  const id = `${Date.now()}`;
  await writeFile(join(dir, `${id}.json`), JSON.stringify({ at: new Date().toISOString(), message, raw }));
  const all = (await readdir(dir)).sort();
  for (const f of all.slice(0, Math.max(0, all.length - 40))) await unlink(join(dir, f)).catch(() => {});
};

export const listHistory = async (name) => {
  if (mode() === 'github') {
    const b = ghOk(await gh(`commits?path=${encodeURIComponent(CONTENT_FILES[name])}&sha=${encodeURIComponent(branch())}&per_page=30`), 'reading history');
    return b.map(c => ({ id: c.sha, at: c.commit.author.date, message: c.commit.message.split('\n')[0], url: c.html_url }));
  }
  const dir = join(HIST, name);
  const files = (await readdir(dir).catch(() => [])).sort().reverse();
  const out = [];
  for (const f of files) {
    const j = JSON.parse(await readFile(join(dir, f), 'utf8'));
    out.push({ id: f.replace('.json', ''), at: j.at, message: `Before: ${j.message}` });
  }
  return out;
};
export const readVersion = async (name, id) => {
  if (mode() === 'github') {
    if (!/^[0-9a-f]{40}$/.test(id)) throw new Error('Bad version');
    return (await readContent(name, id)).data;
  }
  if (!/^\d+$/.test(id)) throw new Error('Bad version');
  const j = JSON.parse(await readFile(join(HIST, name, `${id}.json`), 'utf8'));
  return fromFile(name, j.raw);
};

/* ---------- repository files (media library) ---------- */
const IMG = /\.(png|jpe?g|webp|avif|gif|svg)$/i;
export const MEDIA_DIRS = ['media/', 'assets/'];
export const listRepoImages = async () => {
  if (mode() === 'github') {
    const ref = ghOk(await gh(`git/ref/heads/${encodeURIComponent(branch())}`), 'reading the branch');
    const commit = ghOk(await gh(`git/commits/${ref.object.sha}`), 'reading the last commit');
    const tree = ghOk(await gh(`git/trees/${commit.tree.sha}?recursive=1`), 'listing files');
    return tree.tree.filter(t => t.type === 'blob' && MEDIA_DIRS.some(d => t.path.startsWith(d)) && IMG.test(t.path))
      .map(t => ({ path: t.path, size: t.size }));
  }
  const out = [];
  const walk = async (dir) => {
    for (const e of await readdir(join(ROOT, dir), { withFileTypes: true }).catch(() => [])) {
      const rel = dir + e.name;
      if (e.isDirectory()) await walk(rel + '/');
      else if (IMG.test(e.name)) out.push({ path: rel, size: (await stat(join(ROOT, rel))).size, mtime: (await stat(join(ROOT, rel))).mtimeMs });
    }
  };
  for (const d of MEDIA_DIRS) await walk(d);
  return out;
};
export const toPosix = (p) => p.split(sep).join('/');
export { relative };

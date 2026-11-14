/* Ostendic admin: shared helpers for the /api/admin/* functions.
   Files starting with "_" are not routes on Vercel.

   Login: one password (ADMIN_PASSWORD). A successful login sets an HttpOnly,
   SameSite=Strict session cookie signed with a key derived from that
   password, so changing the password signs everyone out.

   Storage, picked from the environment:
   - GITHUB_TOKEN set  -> read and commit content/*.json in the GitHub repo
     (GITHUB_REPO, GITHUB_BRANCH). The commit triggers a Vercel deploy,
     which rebuilds the site from the new content.
   - ADMIN_LOCAL=1     -> local development (build/serve.mjs): read and write
     the files on disk, then rebuild the site straight away.
   - neither           -> the panel reports that saving isn't configured. */
import { createHmac, createHash, timingSafeEqual } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { validate, CONTENT_FILES } from '../../build/content.mjs';

const env = (k, d = '') => (globalThis.process.env[k] || d).trim();
const COOKIE = 'ostendic_admin';
const SESSION_HOURS = 12;
const ROOT = fileURLToPath(new URL('../../', import.meta.url));

export const mode = () => env('GITHUB_TOKEN') ? 'github' : env('ADMIN_LOCAL') === '1' ? 'local' : 'none';

/* ---------- responses ---------- */
export const send = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.end(JSON.stringify(body));
};

export const readBody = async (req) => {
  if (req.body !== undefined && req.body !== null && req.body !== '') {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }
  const chunks = [];
  let size = 0;
  for await (const c of req) { size += c.length; if (size > 2_000_000) throw new Error('Request too large'); chunks.push(c); }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
};

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

/* ---------- content storage ---------- */
const sha1 = (s) => createHash('sha1').update(s).digest('hex');
const gh = async (path, init = {}) => {
  const repo = env('GITHUB_REPO', 'harshaiagentsworkspace-sudo/WebsiteMain');
  const r = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env('GITHUB_TOKEN')}`, Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'ostendic-admin', ...(init.headers || {}),
    },
  });
  const body = await r.json().catch(() => ({}));
  return { status: r.status, body };
};

export const readContent = async (name) => {
  const path = CONTENT_FILES[name];
  if (mode() === 'github') {
    const { status, body } = await gh(`${path}?ref=${encodeURIComponent(env('GITHUB_BRANCH', 'main'))}`);
    if (status !== 200) throw new Error(`GitHub returned ${status} reading ${path}${body.message ? `: ${body.message}` : ''}`);
    return { data: JSON.parse(Buffer.from(body.content, 'base64').toString('utf8')), sha: body.sha };
  }
  const raw = await readFile(ROOT + path, 'utf8');
  return { data: JSON.parse(raw), sha: sha1(raw) };
};

const rebuild = () => new Promise((resolve) => {
  execFile(globalThis.process.execPath, ['build/build.mjs'], { cwd: ROOT, timeout: 120_000 }, (err, stdout, stderr) =>
    resolve(err ? { ok: false, log: String(stderr || err.message).slice(-2000) } : { ok: true }));
});

/* Saves one content file. `sha` is the version the editor started from;
   if the file changed since (another tab, or a commit from elsewhere), the
   save is refused so nothing is silently overwritten. */
export const saveContent = async (name, data, sha) => {
  const errors = validate(name, data);
  if (errors.length) return { status: 422, body: { error: 'Some fields need fixing before this can be saved.', errors } };
  const path = CONTENT_FILES[name];
  const json = JSON.stringify(data, null, 2) + '\n';
  const label = name === 'blog' ? 'blog' : 'home page';

  if (mode() === 'github') {
    const { status, body } = await gh(path, {
      method: 'PUT',
      body: JSON.stringify({
        message: `Admin: update ${label} content`,
        content: Buffer.from(json, 'utf8').toString('base64'),
        sha, branch: env('GITHUB_BRANCH', 'main'),
      }),
    });
    if (status === 409 || (status === 422 && /sha/i.test(body.message || ''))) {
      return { status: 409, body: { error: `The ${label} content was changed somewhere else since you opened it. Reload to get the latest version, then make your edit again.` } };
    }
    if (status !== 200 && status !== 201) return { status: 502, body: { error: `GitHub refused the save (${status}${body.message ? `: ${body.message}` : ''}).` } };
    return { status: 200, body: { ok: true, sha: body.content.sha, commit: body.commit && body.commit.html_url, live: 'deploy' } };
  }

  if (mode() === 'local') {
    const current = await readFile(ROOT + path, 'utf8');
    if (sha1(current) !== sha) return { status: 409, body: { error: `The ${label} content changed on disk since you opened it. Reload, then make your edit again.` } };
    await writeFile(ROOT + path, json, 'utf8');
    const built = await rebuild();
    if (!built.ok) {
      await writeFile(ROOT + path, current, 'utf8');
      await rebuild();
      return { status: 500, body: { error: 'The site failed to build with this change, so it was undone.', errors: [built.log] } };
    }
    return { status: 200, body: { ok: true, sha: sha1(json), live: 'now' } };
  }

  return { status: 503, body: { error: 'Saving is not set up yet: add GITHUB_TOKEN in Vercel (see .env.example).' } };
};

/* Local dev server for the Ostendic static site.
   Mirrors the Vercel config: cleanUrls, no trailing slash.
   Run: node build/serve.mjs  [port]                                    */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, dirname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.argv[2]) || 3000;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

const exists = async (p) => { try { return (await stat(p)).isFile(); } catch { return false; } };

/* Admin panel, local mode: without GITHUB_TOKEN, saves go straight to
   content/*.json on this machine and the site rebuilds. The password is
   ADMIN_PASSWORD if set, otherwise a local-only default printed below. */
if (!process.env.GITHUB_TOKEN) process.env.ADMIN_LOCAL = '1';
if (!process.env.ADMIN_PASSWORD) process.env.ADMIN_PASSWORD = 'ostendic-local';

const server = createServer(async (req, res) => {
  const started = Date.now();
  let url = decodeURIComponent((req.url || '/').split('?')[0]);

  // mirror vercel.json redirects (edited in Admin > Redirects)
  try {
    const { redirects = [] } = JSON.parse(await readFile(join(ROOT, 'vercel.json'), 'utf8'));
    for (const r of redirects) {
      /* path-to-regexp subset: literal segments, :name and :name(a|b) */
      const names = [];
      const lit = (t) => [...t].map(c => /[A-Za-z0-9_~-]/.test(c) ? c : `[${c}]`).join('');
      const pattern = r.source.split('/').map(seg => {
        const p = seg.match(/^:([A-Za-z]+)(.*)$/);
        if (!p) return lit(seg);
        names.push(p[1]);
        return p[2] && p[2][0] === '(' && p[2].endsWith(')') ? p[2] : '([^/]+)';
      }).join('/');
      const m = url.match(new RegExp(`^${pattern}$`));
      if (!m) continue;
      let dest = r.destination;
      names.forEach((n, i) => { dest = dest.replace(':' + n, m[i + 1]); });
      const code = r.permanent ? 308 : 307;
      res.writeHead(code, { Location: dest }); res.end(); console.log(`  ${code}  ${url} -> ${dest}`); return;
    }
  } catch { /* bad vercel.json: serve without redirects */ }

  // the admin panel's API, as Vercel would run it (local mode: edits the
  // content files on disk and rebuilds the site)
  const api = url.match(/^\/api\/((?:admin\/)?[a-z]+)$/);
  if (api) {
    try {
      const mod = await import(new URL(`../api/${api[1]}.mjs`, import.meta.url));
      await mod.default(req, res);
      console.log(`  ${res.statusCode}  ${req.method} ${url}`);
    } catch (e) {
      if (!res.headersSent) { res.writeHead(404, { 'Content-Type': 'application/json' }); res.end('{"error":"Not found"}'); }
      console.log(`  404  ${req.method} ${url}  ${e.code === 'ERR_MODULE_NOT_FOUND' ? '' : e.message}`);
    }
    return;
  }

  // block traversal
  const safe = normalize(url).replace(/^(\.\.[/\\])+/, '');
  if (/^[/\\](\.data|\.git|\.env)/.test(safe)) { res.writeHead(404); res.end(); console.log(`  404  ${url}`); return; }
  let file = join(ROOT, safe);

  // resolution order, matching cleanUrls
  let target = null;
  if (safe === '/' || safe === '\\') {
    target = join(ROOT, 'index.html');
  } else if (await exists(file)) {
    target = file;                                   // real file (css, js, images)
  } else if (await exists(file + '.html')) {
    target = file + '.html';                         // /about -> about.html
  } else if (await exists(join(file, 'index.html'))) {
    target = join(file, 'index.html');
  }

  const send = async (path, code) => {
    const buf = await readFile(path);
    res.writeHead(code, {
      'Content-Type': TYPES[extname(path).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(buf);
  };

  try {
    if (target) {
      await send(target, 200);
      console.log(`  200  ${url}${Date.now() - started > 20 ? `  (${Date.now() - started}ms)` : ''}`);
    } else if (await exists(join(ROOT, '404.html'))) {
      /* as Vercel does: the site's own 404 page, with a 404 status */
      await send(join(ROOT, '404.html'), 404);
      console.log(`  404  ${url}`);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!doctype html><meta charset="utf-8"><title>404</title>
        <body style="font:16px/1.6 system-ui;padding:60px;max-width:640px;margin:auto">
        <h1 style="font-size:2rem">404 — not found</h1>
        <p style="color:#666">No page at <code>${url}</code>.</p>
        <p><a href="/">Back to the homepage</a></p>`);
      console.log(`  404  ${url}`);
    }
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 ' + e.message);
    console.log(`  500  ${url}  ${e.message}`);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n  Ostendic dev server\n  http://localhost:${PORT}\n`);
  console.log('  Routes: /  /services  /work  /about  /blog  /contact  /book  /privacy  /terms\n');
  console.log(`  Admin panel: http://localhost:${PORT}/admin  (${process.env.ADMIN_LOCAL === '1' ? 'local mode, saves to content/*.json' : 'GitHub mode'}; password: ${process.env.ADMIN_PASSWORD === 'ostendic-local' ? 'ostendic-local' : 'ADMIN_PASSWORD'})`);
  console.log('  Rebuild after editing build/*.mjs:  node build/build.mjs');
  console.log('  Stop: Ctrl+C\n');
});

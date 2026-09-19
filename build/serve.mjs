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

const server = createServer(async (req, res) => {
  const started = Date.now();
  let url = decodeURIComponent((req.url || '/').split('?')[0]);

  // block traversal
  const safe = normalize(url).replace(/^(\.\.[/\\])+/, '');
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
  console.log('  Routes: /  /about  /contact  /blog  /careers  /resources  /privacy  /terms\n');
  console.log('  Rebuild after editing build/*.mjs:  node build/build.mjs');
  console.log('  Stop: Ctrl+C\n');
});

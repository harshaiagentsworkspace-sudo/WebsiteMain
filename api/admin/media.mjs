/* Media library.
   GET    /api/admin/media                -> { items: [{ path, size, alt, title, w, h, uploaded }] }
   POST   /api/admin/media { name, data (base64), alt, title, w, h, sha }
          -> stores the image under media/ and its details in content/media.json, one commit
   DELETE /api/admin/media { path, sha }  -> removes an uploaded image (media/ only)
   `sha` is the version of content/media.json the panel loaded. Images are
   resized and converted in the browser before upload, so each stays small. */
import { send, readBody, guard, listRepoImages, readContent, saveContent } from './_lib.mjs';
import { logActivity } from './_store.mjs';

const OK_EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg', 'image/avif': 'avif' };
const MAX = 4_000_000;

const cleanName = (n) => String(n || 'image').toLowerCase().replace(/\.[a-z0-9]+$/, '')
  .normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'image';

/* an uploaded SVG must not carry script */
const safeSvg = (buf) => {
  const s = buf.toString('utf8');
  return !/<script|on[a-z]+\s*=|javascript:|<foreignObject|<iframe|<embed|<object/i.test(s);
};

export default async function handler(req, res) {
  if (!guard(req, res)) return;

  if (req.method === 'GET') {
    try {
      const [files, media] = await Promise.all([listRepoImages(), readContent('media')]);
      const meta = media.data.items;
      return send(res, 200, {
        sha: media.sha,
        items: files.map(f => ({ ...f, ...(meta[f.path] || {}), uploaded: f.path.startsWith('media/') }))
          .sort((a, b) => (b.uploaded - a.uploaded) || (b.mtime || 0) - (a.mtime || 0) || a.path.localeCompare(b.path)),
      });
    } catch (e) { return send(res, 502, { error: `Could not list media: ${e.message}` }); }
  }

  if (req.method === 'POST') {
    let body;
    try { body = await readBody(req, 6_000_000); } catch { return send(res, 413, { error: 'That file is too large. Images must be under 4 MB.' }); }
    const m = String(body.data || '').match(/^data:([a-z/+]+);base64,([A-Za-z0-9+/=]+)$/);
    if (!m || !OK_EXT[m[1]]) return send(res, 400, { error: 'Only PNG, JPG, WebP, GIF, AVIF and SVG images can be uploaded.' });
    const buf = Buffer.from(m[2], 'base64');
    if (buf.length > MAX) return send(res, 413, { error: 'That file is too large. Images must be under 4 MB.' });
    if (m[1] === 'image/svg+xml' && !safeSvg(buf)) return send(res, 400, { error: 'This SVG contains scripts or links and can’t be uploaded.' });
    const d = new Date();
    const path = `media/${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${cleanName(body.name)}-${Date.now().toString(36)}.${OK_EXT[m[1]]}`;
    try {
      const media = await readContent('media');
      if (body.sha && body.sha !== media.sha) return send(res, 409, { error: 'The media library changed elsewhere. Reload and try again.' });
      const data = { items: { ...media.data.items, [path]: {
        alt: String(body.alt || '').slice(0, 250), title: String(body.title || '').slice(0, 120),
        ...(Number(body.w) > 0 ? { w: Math.round(Number(body.w)) } : {}), ...(Number(body.h) > 0 ? { h: Math.round(Number(body.h)) } : {}),
      } } };
      const out = await saveContent([{ name: 'media', data, sha: media.sha }], { extraFiles: [{ path, content: buf }], message: `Admin: upload ${path}` });
      if (out.status !== 200) return send(res, out.status, out.body);
      await logActivity('upload', path);
      return send(res, 200, { ok: true, path, sha: out.body.shas.media, live: out.body.live });
    } catch (e) { return send(res, 502, { error: `Upload failed: ${e.message}` }); }
  }

  if (req.method === 'DELETE') {
    let body;
    try { body = await readBody(req); } catch { return send(res, 400, { error: 'Bad request' }); }
    const path = String(body.path || '');
    if (!/^media\/[a-z0-9/._-]+$/i.test(path) || path.includes('..')) return send(res, 400, { error: 'Only uploaded images (media/) can be deleted here.' });
    try {
      const media = await readContent('media');
      const items = { ...media.data.items }; delete items[path];
      const out = await saveContent([{ name: 'media', data: { items }, sha: body.sha || media.sha }], { extraFiles: [{ path, delete: true }], message: `Admin: delete ${path}` });
      if (out.status !== 200) return send(res, out.status, out.body);
      await logActivity('delete-media', path);
      return send(res, 200, { ok: true, sha: out.body.shas.media });
    } catch (e) { return send(res, 502, { error: `Delete failed: ${e.message}` }); }
  }

  return send(res, 405, { error: 'Method not allowed' });
}

/* GET /api/admin/content                    -> { blog: {data, sha}, home: {data, sha} }
   PUT /api/admin/content { name, data, sha } -> validates and saves one file */
import { send, readBody, isAuthed, fromPanel, readContent, saveContent } from './_lib.mjs';

export default async function handler(req, res) {
  if (!isAuthed(req)) return send(res, 401, { error: 'Please log in again.' });

  if (req.method === 'GET') {
    try {
      const [blog, home] = await Promise.all([readContent('blog'), readContent('home')]);
      return send(res, 200, { blog, home });
    } catch (e) {
      return send(res, 502, { error: `Could not load the content: ${e.message}` });
    }
  }

  if (req.method === 'PUT') {
    if (!fromPanel(req)) return send(res, 403, { error: 'Forbidden' });
    let body;
    try { body = await readBody(req); } catch { return send(res, 400, { error: 'Bad request' }); }
    const { name, data, sha } = body || {};
    if (name !== 'blog' && name !== 'home') return send(res, 400, { error: 'Unknown content' });
    if (typeof sha !== 'string' || !sha) return send(res, 400, { error: 'Missing version; reload the panel.' });
    try {
      const out = await saveContent(name, data, sha);
      return send(res, out.status, out.body);
    } catch (e) {
      return send(res, 502, { error: `Save failed: ${e.message}` });
    }
  }

  return send(res, 405, { error: 'Method not allowed' });
}

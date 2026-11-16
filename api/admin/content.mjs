/* GET  /api/admin/content                          -> { <name>: { data, sha }, ... } for every content file
   GET  /api/admin/content?history=<name>           -> [{ id, at, message }] earlier versions
   GET  /api/admin/content?name=<name>&version=<id> -> { data } that version (to restore)
   PUT  /api/admin/content { changes: [{ name, data, sha }], message? }
        -> validates and publishes all changes as one commit */
import { send, readBody, guard, readAll, saveContent, listHistory, readVersion, query, labelOf } from './_lib.mjs';
import { CONTENT_NAMES } from '../../build/content.mjs';
import { logActivity } from './_store.mjs';

export default async function handler(req, res) {
  if (!guard(req, res)) return;

  if (req.method === 'GET') {
    const q = query(req);
    try {
      if (q.get('history')) {
        if (!CONTENT_NAMES.includes(q.get('history'))) return send(res, 400, { error: 'Unknown content' });
        return send(res, 200, { versions: await listHistory(q.get('history')) });
      }
      if (q.get('version')) {
        if (!CONTENT_NAMES.includes(q.get('name'))) return send(res, 400, { error: 'Unknown content' });
        return send(res, 200, { data: await readVersion(q.get('name'), q.get('version')) });
      }
      return send(res, 200, await readAll());
    } catch (e) {
      return send(res, 502, { error: `Could not load the content: ${e.message}` });
    }
  }

  if (req.method === 'PUT') {
    let body;
    try { body = await readBody(req, 4_000_000); } catch { return send(res, 400, { error: 'Bad request' }); }
    const changes = body && Array.isArray(body.changes) ? body.changes : null;
    if (!changes || !changes.length) return send(res, 400, { error: 'Nothing to save' });
    if (changes.some(c => !c || typeof c.sha !== 'string' || !c.sha)) return send(res, 400, { error: 'Missing version; reload the panel.' });
    const message = typeof body.message === 'string' && body.message.trim() ? `Admin: ${body.message.trim().slice(0, 120)}` : undefined;
    try {
      const out = await saveContent(changes, { message });
      if (out.status === 200) await logActivity('publish', message ? message.replace(/^Admin: /, '') : changes.map(c => labelOf(c.name)).join(', '));
      return send(res, out.status, out.body);
    } catch (e) {
      return send(res, 502, { error: `Save failed: ${e.message}` });
    }
  }

  return send(res, 405, { error: 'Method not allowed' });
}

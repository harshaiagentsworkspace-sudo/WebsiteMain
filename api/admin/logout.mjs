/* POST /api/admin/logout -> clears the session cookie */
import { send, clearSession, fromPanel } from './_lib.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });
  if (!fromPanel(req)) return send(res, 403, { error: 'Forbidden' });
  clearSession(res);
  return send(res, 200, { ok: true });
}

/* GET /api/admin/session -> { authed, mode } so the panel knows whether to show the login */
import { send, isAuthed, mode, passwordConfigured } from './_lib.mjs';

export default async function handler(req, res) {
  if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed' });
  return send(res, 200, { authed: isAuthed(req), mode: mode(), configured: passwordConfigured() });
}

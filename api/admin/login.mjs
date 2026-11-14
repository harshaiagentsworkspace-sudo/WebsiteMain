/* POST /api/admin/login  { password }  -> sets the session cookie */
import { send, readBody, checkPassword, passwordConfigured, setSession, fromPanel } from './_lib.mjs';

const pause = (ms) => new Promise(r => setTimeout(r, ms));

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });
  if (!fromPanel(req)) return send(res, 403, { error: 'Forbidden' });
  if (!passwordConfigured()) return send(res, 503, { error: 'The admin password is not set up yet (ADMIN_PASSWORD).' });
  let body;
  try { body = await readBody(req); } catch { return send(res, 400, { error: 'Bad request' }); }
  if (!checkPassword(body && body.password)) {
    await pause(900); // slows down password guessing
    return send(res, 401, { error: 'That password is not right.' });
  }
  setSession(res);
  return send(res, 200, { ok: true });
}

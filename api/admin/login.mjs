/* POST /api/admin/login  { password }  -> sets the session cookie */
import { send, readBody, checkPassword, passwordConfigured, setSession, fromPanel } from './_lib.mjs';
import { allow, logActivity } from './_store.mjs';

const pause = (ms) => new Promise(r => setTimeout(r, ms));
const ip = (req) => String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });
  if (!fromPanel(req)) return send(res, 403, { error: 'Forbidden' });
  if (!passwordConfigured()) return send(res, 503, { error: 'The admin password is not set up yet (ADMIN_PASSWORD).' });
  if (!(await allow(`login:${ip(req)}`, 10, 900))) return send(res, 429, { error: 'Too many attempts. Wait 15 minutes and try again.' });
  let body;
  try { body = await readBody(req); } catch { return send(res, 400, { error: 'Bad request' }); }
  if (!checkPassword(body && body.password)) {
    await pause(900); // slows down password guessing
    await logActivity('login-failed', ip(req));
    return send(res, 401, { error: 'That password is not right.' });
  }
  setSession(res);
  await logActivity('login', ip(req));
  return send(res, 200, { ok: true });
}

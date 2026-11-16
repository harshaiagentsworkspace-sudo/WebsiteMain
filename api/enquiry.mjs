/* POST /api/enquiry — public. The contact form sends each enquiry here (as
   well as to Web3Forms, which emails it), so it appears in the admin inbox.
   Spam guards: same-site Origin, a honeypot field, length limits and a
   per-IP rate limit. Responds 202 when stored, 204 when there is no store. */
import { send, readBody } from './admin/_lib.mjs';
import { addEnquiry, storeKind, allow, logActivity } from './admin/_store.mjs';

const ip = (req) => String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();
const str = (v, max) => String(v ?? '').trim().slice(0, max);

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });
  const origin = req.headers.origin || '';
  const host = req.headers['x-forwarded-host'] || req.headers.host || '';
  if (origin && host && new URL(origin).host !== host) return send(res, 403, { error: 'Forbidden' });
  if (storeKind() === 'none') { res.statusCode = 204; return res.end(); }
  let b;
  try { b = await readBody(req, 50_000); } catch { return send(res, 400, { error: 'Bad request' }); }
  if (!b || b.website) { res.statusCode = 204; return res.end(); } // honeypot
  const e = {
    name: str(b.name, 120), email: str(b.email, 200), phone: str(b.phone, 40), company: str(b.company, 160),
    interest: str(b.interest, 120), budget: str(b.budget, 80), message: str(b.message, 5000),
    page: str(b.page, 200), ua: str(req.headers['user-agent'], 200),
  };
  if (!e.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email) || e.message.length < 10) return send(res, 422, { error: 'Missing details' });
  if (!(await allow(`enq:${ip(req)}`, 8, 3600))) return send(res, 429, { error: 'Too many messages' });
  try {
    await addEnquiry(e);
    await logActivity('enquiry', `${e.name} <${e.email}>`);
    return send(res, 202, { ok: true });
  } catch (err) { return send(res, 502, { error: 'Could not store the enquiry' }); }
}

/* Ostendic admin: small data store for enquiries, the activity log and
   rate limits.

   - On Vercel: Upstash Redis over its REST API. Add the "Upstash for Redis"
     integration in Vercel (Storage tab); it sets KV_REST_API_URL and
     KV_REST_API_TOKEN (UPSTASH_REDIS_REST_URL / _TOKEN also work).
   - Locally (build/serve.mjs): a JSON file in .data/store.json.
   - Neither: storeKind() is 'none'; enquiries are still emailed by
     Web3Forms, they just aren't kept for the inbox. */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { env, ROOT, mode } from './_lib.mjs';

const rUrl = () => env('KV_REST_API_URL') || env('UPSTASH_REDIS_REST_URL');
const rTok = () => env('KV_REST_API_TOKEN') || env('UPSTASH_REDIS_REST_TOKEN');
export const storeKind = () => rUrl() && rTok() ? 'redis' : mode() === 'local' ? 'file' : 'none';

const redis = async (cmds) => {
  const r = await fetch(`${rUrl().replace(/\/$/, '')}/pipeline`, {
    method: 'POST', headers: { Authorization: `Bearer ${rTok()}`, 'Content-Type': 'application/json' }, body: JSON.stringify(cmds),
  });
  if (!r.ok) throw new Error(`Store returned ${r.status}`);
  const out = await r.json();
  return out.map(x => { if (x.error) throw new Error(x.error); return x.result; });
};

/* ---------- file store (local) ---------- */
const FILE = join(ROOT, '.data', 'store.json');
let queue = Promise.resolve();
const withFile = (fn) => (queue = queue.then(async () => {
  let db;
  try { db = JSON.parse(await readFile(FILE, 'utf8')); } catch { db = {}; }
  db.enquiries ||= {}; db.log ||= []; db.hits ||= {};
  const out = await fn(db);
  await mkdir(join(ROOT, '.data'), { recursive: true });
  await writeFile(FILE, JSON.stringify(db, null, 2));
  return out;
}));

const noStore = () => Object.assign(new Error('The enquiry inbox needs a data store: add the Upstash for Redis integration in Vercel (see .env.example).'), { status: 503 });

/* ---------- enquiries ---------- */
export const STATUSES = ['new', 'replied', 'in-progress', 'won', 'lost', 'spam'];

export const addEnquiry = async (e) => {
  const item = { id: randomUUID(), at: new Date().toISOString(), status: 'new', notes: '', ...e };
  const k = storeKind();
  if (k === 'redis') await redis([['SET', `enq:${item.id}`, JSON.stringify(item)], ['ZADD', 'enq:index', Date.parse(item.at), item.id]]);
  else if (k === 'file') await withFile(db => { db.enquiries[item.id] = item; });
  else throw noStore();
  return item;
};

export const listEnquiries = async () => {
  const k = storeKind();
  if (k === 'redis') {
    const [ids] = await redis([['ZRANGE', 'enq:index', 0, 999, 'REV']]);
    if (!ids.length) return [];
    const [vals] = await redis([['MGET', ...ids.map(i => `enq:${i}`)]]);
    return vals.filter(Boolean).map(v => JSON.parse(v));
  }
  if (k === 'file') return withFile(db => Object.values(db.enquiries).sort((a, b) => b.at.localeCompare(a.at)));
  throw noStore();
};

export const updateEnquiry = async (id, patch) => {
  const clean = {};
  if (patch.status !== undefined) { if (!STATUSES.includes(patch.status)) throw new Error('Unknown status'); clean.status = patch.status; }
  if (patch.notes !== undefined) clean.notes = String(patch.notes).slice(0, 5000);
  if (patch.read !== undefined) clean.read = !!patch.read;
  const k = storeKind();
  if (k === 'redis') {
    const [v] = await redis([['GET', `enq:${id}`]]);
    if (!v) return null;
    const item = { ...JSON.parse(v), ...clean, updatedAt: new Date().toISOString() };
    await redis([['SET', `enq:${id}`, JSON.stringify(item)]]);
    return item;
  }
  if (k === 'file') return withFile(db => {
    if (!db.enquiries[id]) return null;
    db.enquiries[id] = { ...db.enquiries[id], ...clean, updatedAt: new Date().toISOString() };
    return db.enquiries[id];
  });
  throw noStore();
};

export const deleteEnquiry = async (id) => {
  const k = storeKind();
  if (k === 'redis') { await redis([['DEL', `enq:${id}`], ['ZREM', 'enq:index', id]]); return true; }
  if (k === 'file') return withFile(db => { const had = !!db.enquiries[id]; delete db.enquiries[id]; return had; });
  throw noStore();
};

/* ---------- activity log ---------- */
export const logActivity = async (action, detail = '') => {
  const entry = { at: new Date().toISOString(), action, detail: String(detail).slice(0, 300) };
  try {
    const k = storeKind();
    if (k === 'redis') await redis([['LPUSH', 'log', JSON.stringify(entry)], ['LTRIM', 'log', 0, 499]]);
    else if (k === 'file') await withFile(db => { db.log.unshift(entry); db.log.length = Math.min(db.log.length, 500); });
  } catch { /* logging never blocks the action */ }
};
export const listActivity = async (limit = 100) => {
  const k = storeKind();
  if (k === 'redis') { const [v] = await redis([['LRANGE', 'log', 0, limit - 1]]); return v.map(x => JSON.parse(x)); }
  if (k === 'file') return withFile(db => db.log.slice(0, limit));
  return null;
};

/* ---------- rate limit: true while under `max` hits per `windowSec` ---------- */
export const allow = async (key, max, windowSec) => {
  const k = storeKind();
  try {
    if (k === 'redis') {
      const [n] = await redis([['INCR', `rl:${key}`], ['EXPIRE', `rl:${key}`, windowSec, 'NX']]);
      return n <= max;
    }
    if (k === 'file') return withFile(db => {
      const now = Date.now(), h = db.hits[key];
      if (!h || h.until < now) db.hits[key] = { n: 1, until: now + windowSec * 1000 };
      else h.n++;
      return db.hits[key].n <= max;
    });
  } catch { /* fail open: never block a real visitor because the store is down */ }
  return true;
};

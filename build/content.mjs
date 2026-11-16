/* ===========================================================================
   OSTENDIC — EDITABLE CONTENT
   All site copy lives in content/*.json, which the admin panel (/admin)
   reads and writes. This module loads those files for the build and
   validates them against build/schema.mjs; the same validators run on the
   server before the admin panel may save, so a bad edit is refused instead
   of breaking the site.

   "redirects" is special: it is the `redirects` array inside vercel.json,
   because Vercel reads redirects from that file before the build runs.
   =========================================================================== */
import { readFileSync } from 'node:fs';
import { validate, CONTENT_NAMES } from './schema.mjs';

export { validate, CONTENT_NAMES };
export { SLUG_RE, SERVICE_SLUGS } from './schema.mjs';

export const CONTENT_FILES = Object.fromEntries(CONTENT_NAMES.map(n => [n, n === 'redirects' ? 'vercel.json' : `content/${n}.json`]));

const ROOT = new URL('../', import.meta.url);

/* raw file text -> the editable data, and back */
export const fromFile = (name, raw) => {
  const j = JSON.parse(raw);
  return name === 'redirects' ? { redirects: j.redirects || [] } : j;
};
export const toFile = (name, data, currentRaw) => {
  if (name === 'redirects') {
    const j = JSON.parse(currentRaw);
    j.redirects = data.redirects;
    return JSON.stringify(j, null, 2) + '\n';
  }
  return JSON.stringify(data, null, 2) + '\n';
};

export const loadContent = (name) => {
  const data = fromFile(name, readFileSync(new URL(CONTENT_FILES[name], ROOT), 'utf8'));
  const errors = validate(name, data);
  if (errors.length) throw new Error(`${CONTENT_FILES[name]} is invalid:\n  - ${errors.join('\n  - ')}`);
  return data;
};

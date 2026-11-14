/* ===========================================================================
   OSTENDIC — EDITABLE CONTENT
   The blog and the editable parts of the home page live in content/*.json,
   which the admin panel (/admin) reads and writes. This module loads them
   for the build and validates them; the same validators run on the server
   before the admin panel is allowed to save, so a bad edit is rejected
   instead of breaking the site.
   =========================================================================== */
import { readFileSync } from 'node:fs';

const CONTENT_DIR = new URL('../content/', import.meta.url);
export const CONTENT_FILES = { blog: 'content/blog.json', home: 'content/home.json' };

export const loadContent = (name) => {
  const data = JSON.parse(readFileSync(new URL(`${name}.json`, CONTENT_DIR), 'utf8'));
  const errors = validate(name, data);
  if (errors.length) throw new Error(`content/${name}.json is invalid:\n  - ${errors.join('\n  - ')}`);
  return data;
};

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const SERVICE_SLUGS = ['web-development', 'agentic-ai-workflows'];

const isStr = (v) => typeof v === 'string';
const text = (errors, v, label, { min = 1, max = 400 } = {}) => {
  if (!isStr(v)) { errors.push(`${label} must be text`); return; }
  const n = v.trim().length;
  if (n < min) errors.push(`${label} is empty`);
  else if (n > max) errors.push(`${label} is too long (${n} characters, max ${max})`);
};
const list = (errors, v, label, { min = 1, max = 20, itemMax = 400 } = {}) => {
  if (!Array.isArray(v)) { errors.push(`${label} must be a list`); return; }
  if (v.length < min) errors.push(`${label} needs at least ${min} item${min === 1 ? '' : 's'}`);
  if (v.length > max) errors.push(`${label} has too many items (max ${max})`);
  v.forEach((item, i) => text(errors, item, `${label} item ${i + 1}`, { max: itemMax }));
};

export const validateBlog = (d) => {
  const errors = [];
  if (!d || typeof d !== 'object') return ['Blog content is missing'];
  if (typeof d.indexable !== 'boolean') errors.push('"Show the blog to search engines" must be on or off');
  if (!Array.isArray(d.posts)) return [...errors, 'Posts must be a list'];
  const seen = new Set();
  d.posts.forEach((p, i) => {
    const at = `Post ${i + 1}${p && isStr(p.title) && p.title.trim() ? ` ("${p.title.trim().slice(0, 40)}")` : ''}`;
    if (!p || typeof p !== 'object') { errors.push(`${at} is not a post`); return; }
    if (!isStr(p.slug) || !SLUG_RE.test(p.slug)) errors.push(`${at}: the URL name may only use lowercase letters, numbers and single hyphens`);
    else if (seen.has(p.slug)) errors.push(`${at}: another post already uses the URL name "${p.slug}"`);
    else seen.add(p.slug);
    text(errors, p.title, `${at}: title`, { max: 120 });
    text(errors, p.category, `${at}: category`, { max: 40 });
    text(errors, p.excerpt, `${at}: summary`, { max: 240 });
    if (typeof p.draft !== 'boolean') errors.push(`${at}: draft must be on or off`);
    list(errors, p.body, `${at}: article text`, { max: 200, itemMax: 4000 });
  });
  return errors;
};

export const validateHome = (d) => {
  const errors = [];
  if (!d || typeof d !== 'object') return ['Home page content is missing'];
  const h = d.hero || {};
  list(errors, h.headline, 'Hero headline', { max: 3, itemMax: 80 });
  text(errors, h.intro, 'Hero intro', { max: 400 });
  text(errors, h.secondaryButton, 'Hero second button', { max: 40 });
  const s = d.services || {};
  text(errors, s.heading, 'Services heading', { max: 80 });
  for (const slug of SERVICE_SLUGS) {
    const p = (s.panels || {})[slug];
    const at = slug === 'web-development' ? 'Web Development panel' : 'Agentic AI panel';
    if (!p) { errors.push(`${at} is missing`); continue; }
    text(errors, p.summary, `${at}: summary`, { max: 240 });
    text(errors, p.who, `${at}: who it helps`, { max: 240 });
    text(errors, p.problem, `${at}: the problem`, { max: 240 });
    text(errors, p.build, `${at}: what we build`, { max: 300 });
    list(errors, p.includes, `${at}: a project can include`, { max: 8, itemMax: 120 });
  }
  const pr = d.process || {};
  text(errors, pr.heading, 'Process heading', { max: 80 });
  if (!Array.isArray(pr.steps) || pr.steps.length < 2 || pr.steps.length > 6) errors.push('Process needs 2 to 6 steps');
  else pr.steps.forEach((st, i) => {
    text(errors, st && st.title, `Process step ${i + 1}: title`, { max: 60 });
    text(errors, st && st.text, `Process step ${i + 1}: text`, { max: 200 });
  });
  const a = d.about || {};
  text(errors, a.heading, 'About heading', { max: 100 });
  text(errors, a.headingItalic, 'About heading (italic part)', { min: 0, max: 80 });
  list(errors, a.paragraphs, 'About paragraphs', { max: 4, itemMax: 500 });
  return errors;
};

export const validate = (name, data) =>
  name === 'blog' ? validateBlog(data) : name === 'home' ? validateHome(data) : [`Unknown content "${name}"`];

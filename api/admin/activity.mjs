/* GET /api/admin/activity -> { items: [{ at, action, detail, url? }], source }
   The data store's log when one is set up; otherwise the repository's
   recent commits (every publish from the panel is a commit). */
import { send, guard, mode, gh, env } from './_lib.mjs';
import { listActivity } from './_store.mjs';

export default async function handler(req, res) {
  if (!guard(req, res)) return;
  if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed' });
  try {
    const log = await listActivity(150);
    if (log) return send(res, 200, { items: log, source: 'log' });
    if (mode() === 'github') {
      const r = await gh(`commits?sha=${encodeURIComponent(env('GITHUB_BRANCH', 'main'))}&per_page=40`);
      if (r.status !== 200) throw new Error(`GitHub returned ${r.status}`);
      return send(res, 200, { source: 'commits', items: r.body.map(c => ({ at: c.commit.author.date, action: 'commit', detail: c.commit.message.split('\n')[0], url: c.html_url })) });
    }
    return send(res, 200, { items: [], source: 'none' });
  } catch (e) { return send(res, 502, { error: e.message }); }
}

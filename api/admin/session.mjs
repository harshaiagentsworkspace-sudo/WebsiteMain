/* GET /api/admin/session -> { authed, mode, store, configured } so the panel
   knows whether to show the login and which features are set up. */
import { send, isAuthed, mode, passwordConfigured, env } from './_lib.mjs';
import { storeKind } from './_store.mjs';

export default async function handler(req, res) {
  if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed' });
  const authed = isAuthed(req);
  return send(res, 200, {
    authed, mode: mode(), configured: passwordConfigured(),
    ...(authed ? { store: storeKind(), branch: env('GITHUB_BRANCH', 'main'), repo: env('GITHUB_REPO', 'harshaiagentsworkspace-sudo/WebsiteMain') } : {}),
  });
}

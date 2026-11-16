/* Ostendic admin: app shell — login, sidebar, publish bar and routing. */
import { $, h, icon, btn, toast, modal, confirmBox } from './dom.js';
import { S, api, loadAll, dirty, discard, publish, onChange, setAuthLost, LABELS, liveNote } from './state.js';
import { setPicker } from './forms.js';
import { pickMedia, mediaView } from './media.js';
import { postsView, postEditor, newPost } from './posts.js';
import { dashboardView, enquiriesView, pagesView, pageEditor, workView, seoView, redirectsView, settingsView, activityView, ENQ, loadEnquiries } from './views.js';
import { route, go } from './router.js';

setPicker(pickMedia);

const NAV = [
  ['dashboard', 'Dashboard', 'dashboard'],
  ['enquiries', 'Enquiries', 'inbox'],
  ['posts', 'Blog posts', 'post'],
  ['pages', 'Pages', 'page'],
  ['work', 'Work', 'work'],
  ['media', 'Media', 'image'],
  ['seo', 'SEO', 'search'],
  ['redirects', 'Redirects', 'redirect'],
  ['settings', 'Settings', 'settings'],
  ['activity', 'Activity', 'activity'],
];

/* ---------- login ---------- */
function showLogin(msg) {
  $('#app').hidden = true; $('#login').hidden = false;
  const e = $('#loginErr'); e.hidden = !msg; e.textContent = msg || '';
  setTimeout(() => $('#loginPw').focus(), 50);
}
setAuthLost(showLogin);
$('#loginForm').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const b = $('#loginForm button'); b.disabled = true;
  try {
    const r = await api('POST', 'login', { password: $('#loginPw').value });
    if (r.status === 200) { $('#loginPw').value = ''; await boot(); }
    else { const e = $('#loginErr'); e.textContent = r.data.error || 'Could not log in.'; e.hidden = false; }
  } finally { b.disabled = false; }
});

/* ---------- shell ---------- */
let cleanup = null;
function renderNav() {
  const cur = route()[0];
  const nav = $('#nav'); nav.textContent = '';
  for (const [k, label, ic] of NAV) {
    const a = h('a', { href: `#/${k}`, class: `nav__i${cur === k ? ' is-on' : ''}`, 'aria-current': cur === k ? 'page' : null }, icon(ic, 18), h('span', { text: label }));
    if (k === 'enquiries' && ENQ.items) { const n = ENQ.items.filter(e => e.status === 'new').length; if (n) a.appendChild(h('span', { class: 'nav__n', text: String(n) })); }
    if (k === 'posts' && S.work.blog && S.work.blog.posts.some(p => p.draft)) a.appendChild(h('span', { class: 'nav__d', title: 'Has drafts' }));
    nav.appendChild(a);
  }
}

function render() {
  if (!S.loaded) return;
  if (cleanup) { try { cleanup(); } catch { } cleanup = null; }
  const [view, arg] = route();
  const root = $('#view'); root.textContent = ''; root.scrollTop = 0; window.scrollTo(0, 0);
  document.body.classList.remove('nav-open');
  renderNav();
  try {
    switch (view) {
      case 'dashboard': dashboardView(root); break;
      case 'enquiries': enquiriesView(root, arg); break;
      case 'posts':
        if (arg === 'new') { S.work.blog.posts.unshift(newPost()); window.__changed(); history.replaceState(null, '', '#/posts/0'); cleanup = postEditor(root, 0); }
        else if (arg !== undefined) cleanup = postEditor(root, Number(arg));
        else postsView(root);
        break;
      case 'pages': arg ? pageEditor(root, arg) : pagesView(root); break;
      case 'work': workView(root); break;
      case 'media': mediaView(root); break;
      case 'seo': seoView(root); break;
      case 'redirects': redirectsView(root); break;
      case 'settings': settingsView(root); break;
      case 'activity': activityView(root); break;
      default: go('#/dashboard');
    }
  } catch (e) {
    console.error(e);
    root.appendChild(h('div', { class: 'notice notice--bad', text: `This view failed to load: ${e.message}` }));
  }
  const t = NAV.find(n => n[0] === view);
  document.title = `${t ? t[1] : 'Admin'} · Ostendic admin`;
}
window.addEventListener('hashchange', render);

/* ---------- publish bar ---------- */
function updateBar() {
  const d = dirty();
  const bar = $('#saveBar');
  bar.hidden = d.length === 0;
  document.body.classList.toggle('has-bar', d.length > 0);
  $('#saveBarText').textContent = d.length ? `Unsaved changes: ${d.map(n => LABELS[n].toLowerCase()).join(', ')}` : '';
  const b = $('#publishBtn'); b.disabled = S.saving;
  b.querySelector('span').textContent = S.saving ? 'Publishing…' : 'Publish';
  renderNav();
}
onChange(updateBar);
window.__changed = () => updateBar();

function showErrors(res) {
  if (!res.error) return;
  modal({ title: 'Couldn’t publish', body: h('div', { class: 'stack' }, h('p', { text: res.error }),
    res.errors && res.errors.length ? h('ul', { class: 'errlist' }, res.errors.slice(0, 30).map(e => h('li', { text: e }))) : null),
  actions: [{ label: 'OK', kind: 'primary', onclick: (c) => c() }] });
}

async function doPublish() {
  const d = dirty(); if (!d.length || S.saving) return;
  const res = await publish();
  if (res.ok) { toast(liveNote(res), 'ok'); render(); } else showErrors(res);
}
$('#publishBtn').addEventListener('click', doPublish);
$('#discardBtn').addEventListener('click', async () => {
  if (!(await confirmBox('Discard changes', 'Discard all unsaved changes?', 'Discard', true))) return;
  discard(); render();
});
window.addEventListener('beforeunload', (e) => { if (dirty().length) { e.preventDefault(); e.returnValue = ''; } });
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); doPublish(); }
});

$('#logoutBtn').addEventListener('click', async () => {
  if (dirty().length && !(await confirmBox('Log out', 'You have unsaved changes. Log out and lose them?', 'Log out', true))) return;
  await api('POST', 'logout', {});
  S.loaded = false; showLogin();
});
$('#menuBtn').addEventListener('click', () => document.body.classList.toggle('nav-open'));
$('#scrim').addEventListener('click', () => document.body.classList.remove('nav-open'));

/* ---------- boot ---------- */
async function boot() {
  const s = await (await fetch('/api/admin/session', { credentials: 'same-origin' })).json();
  S.session = s;
  if (!s.configured) return showLogin('The admin password is not set up yet (ADMIN_PASSWORD in Vercel).');
  if (!s.authed) return showLogin();
  try { await loadAll(); }
  catch (e) { $('#login').hidden = true; $('#app').hidden = false; $('#view').replaceChildren(h('div', { class: 'notice notice--bad', text: e.message })); return; }
  $('#login').hidden = true; $('#app').hidden = false;
  const badge = $('#modeBadge');
  badge.textContent = s.mode === 'github' ? 'Live' : s.mode === 'local' ? 'Local' : 'Read only';
  badge.title = s.mode === 'github' ? `Publishing commits to ${s.repo} (${s.branch})` : s.mode === 'local' ? 'Saving to this computer and rebuilding' : 'Saving is not set up (GITHUB_TOKEN)';
  badge.className = `mode mode--${s.mode}`;
  $('#siteName').textContent = S.work.settings.identity.name;
  render(); updateBar();
  loadEnquiries().then(renderNav).catch(() => {});
}
boot().catch(() => showLogin('Could not reach the admin service.'));

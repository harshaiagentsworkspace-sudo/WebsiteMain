/* Ostendic admin panel.
   Loads content/blog.json and content/home.json through /api/admin/content,
   keeps an edited copy of each, and publishes only the file(s) that changed.
   All content is set with textContent / value, never as HTML. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };
  var same = function (a, b) { return JSON.stringify(a) === JSON.stringify(b); };

  /* element helper: h('div', {class: 'x', onclick: fn}, child, 'text') */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'value') el.value = v;
      else el.setAttribute(k, v === true ? '' : v);
    });
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c === null || c === undefined || c === false) continue;
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return el;
  }

  var S = {
    mode: 'none',
    saved: { blog: null, home: null },   // last published version
    sha: { blog: '', home: '' },
    work: { blog: null, home: null },    // what's being edited
    editing: -1,                          // index of the post open in the editor
    slugTouched: false,
    saving: false,
  };

  /* ---------- API ---------- */
  function api(method, path, body) {
    return fetch('/api/admin/' + path, {
      method: method, credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json', 'X-Ostendic-Admin': '1' } : { 'X-Ostendic-Admin': '1' },
      body: body ? JSON.stringify(body) : undefined,
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (data) {
        if (r.status === 401 && path !== 'login') { showLogin('Your session ended. Please log in again.'); throw new Error('auth'); }
        return { status: r.status, data: data };
      });
    });
  }

  /* ---------- messages ---------- */
  var toastTimer;
  function toast(msg) {
    var t = $('toast'); t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.hidden = true; }, 5000);
  }
  function notice(msg, list, ok) {
    var n = $('notice'); n.textContent = '';
    if (!msg) { n.hidden = true; return; }
    n.className = 'adm-notice' + (ok ? ' is-ok' : '');
    n.appendChild(h('strong', { text: msg }));
    if (list && list.length) n.appendChild(h('ul', null, ...list.map(function (e) { return h('li', { text: e }); })));
    n.hidden = false;
    n.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  /* ---------- login ---------- */
  function showLogin(msg) {
    $('app').hidden = true; $('login').hidden = false;
    var e = $('loginErr'); e.hidden = !msg; e.textContent = msg || '';
    setTimeout(function () { $('loginPw').focus(); }, 50);
  }
  $('loginForm').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var btn = ev.submitter || this.querySelector('button'); btn.disabled = true;
    api('POST', 'login', { password: $('loginPw').value }).then(function (r) {
      btn.disabled = false;
      if (r.status === 200) { $('loginPw').value = ''; start(); }
      else { var e = $('loginErr'); e.textContent = r.data.error || 'Could not log in.'; e.hidden = false; }
    }).catch(function () { btn.disabled = false; });
  });
  $('logoutBtn').addEventListener('click', function () {
    if (dirty() && !confirm('You have unsaved changes. Log out and lose them?')) return;
    api('POST', 'logout').then(function () { S.saved = { blog: null, home: null }; showLogin(); });
  });

  /* ---------- load ---------- */
  function start() {
    api('GET', 'content').then(function (r) {
      if (r.status !== 200) { $('login').hidden = true; $('app').hidden = false; notice(r.data.error || 'Could not load the content.'); return; }
      ['blog', 'home'].forEach(function (k) {
        S.saved[k] = r.data[k].data; S.sha[k] = r.data[k].sha; S.work[k] = clone(r.data[k].data);
      });
      $('login').hidden = true; $('app').hidden = false;
      var badge = $('modeBadge');
      badge.textContent = S.mode === 'github' ? 'Publishes to the live site' : S.mode === 'local' ? 'Local preview mode' : 'Saving not set up';
      badge.classList.toggle('is-off', S.mode === 'none');
      if (S.mode === 'none') notice('Saving is not set up yet. Add GITHUB_TOKEN to the Vercel project (see .env.example) to publish from here.');
      closeEditor(); renderBlog(); renderHome(); updateBar();
    }).catch(function () {});
  }

  /* ---------- tabs ---------- */
  document.querySelectorAll('.adm-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.adm-tab').forEach(function (t) {
        var on = t === tab; t.setAttribute('aria-selected', String(on)); $('view-' + t.dataset.view).hidden = !on;
      });
    });
  });

  /* ---------- dirty state + publish ---------- */
  function dirty() { return ['blog', 'home'].filter(function (k) { return S.saved[k] && !same(S.saved[k], S.work[k]); }); }
  function updateBar() {
    var d = dirty();
    $('saveBar').hidden = d.length === 0;
    $('saveBarText').textContent = 'Unsaved changes: ' + d.map(function (k) { return k === 'blog' ? 'blog' : 'home page'; }).join(' and ') + '.';
  }
  window.addEventListener('beforeunload', function (e) { if (dirty().length) { e.preventDefault(); e.returnValue = ''; } });

  $('discardBtn').addEventListener('click', function () {
    if (!confirm('Discard all unsaved changes?')) return;
    S.work.blog = clone(S.saved.blog); S.work.home = clone(S.saved.home);
    closeEditor(); renderBlog(); renderHome(); updateBar(); notice('');
  });

  $('saveBtn').addEventListener('click', function () {
    if (S.saving) return;
    var todo = dirty(); if (!todo.length) return;
    S.saving = true; var btn = $('saveBtn'); btn.disabled = true; btn.querySelector('.btn-label').textContent = 'Publishing…';
    notice('');
    var done = [];
    var next = function () {
      var k = todo.shift();
      if (!k) return finish(true);
      return api('PUT', 'content', { name: k, data: S.work[k], sha: S.sha[k] }).then(function (r) {
        if (r.status === 200) {
          S.saved[k] = clone(S.work[k]); S.sha[k] = r.data.sha; done.push(r.data); return next();
        }
        var what = k === 'blog' ? 'blog' : 'home page';
        notice(r.data.error || ('Could not save the ' + what + '.'), r.data.errors);
        return finish(false);
      });
    };
    var finish = function (ok) {
      S.saving = false; btn.disabled = false; btn.querySelector('.btn-label').textContent = 'Publish changes';
      updateBar();
      if (ok) toast(done.some(function (d) { return d.live === 'deploy'; })
        ? 'Published. The live site updates in about a minute.'
        : 'Saved. The site has been rebuilt.');
    };
    next().catch(function () { finish(false); });
  });

  /* ================= BLOG ================= */
  var slugify = function (t) {
    return String(t).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
      .replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80).replace(/-+$/, '');
  };

  $('blogIndexable').addEventListener('change', function () { S.work.blog.indexable = this.checked; updateBar(); });

  function renderBlog() {
    var b = S.work.blog;
    $('blogIndexable').checked = !!b.indexable;
    var list = $('posts'); list.textContent = '';
    if (!b.posts.length) { list.appendChild(h('li', { class: 'adm-card adm-empty', text: 'No posts yet. Create the first one.' })); }
    b.posts.forEach(function (p, i) {
      list.appendChild(h('li', { class: 'adm-card adm-post' },
        h('div', null,
          h('div', { class: 'adm-post__t', text: p.title || '(untitled)' }),
          h('div', { class: 'adm-post__meta' },
            p.draft ? h('span', { class: 'adm-pill adm-pill--draft', text: 'Draft' }) : null,
            p.category ? h('span', { class: 'adm-pill', text: p.category }) : null,
            h('span', { class: 'adm-muted', text: '/blog/' + (p.slug || '…') }))),
        h('div', { class: 'adm-post__act' },
          h('button', { class: 'adm-icon', type: 'button', title: 'Move up', 'aria-label': 'Move "' + p.title + '" up', disabled: i === 0, onclick: function () { move(i, -1); } }, '↑'),
          h('button', { class: 'adm-icon', type: 'button', title: 'Move down', 'aria-label': 'Move "' + p.title + '" down', disabled: i === b.posts.length - 1, onclick: function () { move(i, 1); } }, '↓'),
          h('button', { class: 'btn btn--ghost', type: 'button', onclick: function () { openEditor(i); } }, h('span', { class: 'btn-label', text: 'Edit' })))));
    });
    var cats = $('categories'); cats.textContent = '';
    Array.from(new Set(b.posts.map(function (p) { return p.category; }).filter(Boolean))).forEach(function (c) { cats.appendChild(h('option', { value: c })); });
  }
  function move(i, d) {
    var arr = S.work.blog.posts, j = i + d; var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    renderBlog(); updateBar();
  }

  $('newPostBtn').addEventListener('click', function () {
    S.work.blog.posts.unshift({ slug: '', category: '', title: '', excerpt: '', draft: true, body: [] });
    S.slugTouched = false; renderBlog(); openEditor(0, true); updateBar();
  });

  function openEditor(i, isNew) {
    var p = S.work.blog.posts[i]; S.editing = i;
    S.slugTouched = !isNew;
    $('editorTitle').textContent = isNew ? 'New post' : 'Edit post';
    $('pTitle').value = p.title; $('pSlug').value = p.slug; $('pCategory').value = p.category;
    $('pDraft').checked = !!p.draft; $('pExcerpt').value = p.excerpt; $('pBody').value = p.body.join('\n\n');
    refreshEditorMeta();
    $('blogList').hidden = true; $('postEditor').hidden = false; notice('');
    window.scrollTo(0, 0); $('pTitle').focus();
  }
  function closeEditor() { S.editing = -1; $('postEditor').hidden = true; $('blogList').hidden = false; }
  $('backToList').addEventListener('click', function () {
    /* a new post left completely empty is dropped rather than kept as a blank entry */
    var p = S.work.blog.posts[S.editing];
    if (p && !p.title.trim() && !p.excerpt.trim() && !p.body.length && !p.category.trim()) S.work.blog.posts.splice(S.editing, 1);
    closeEditor(); renderBlog(); updateBar();
  });

  function refreshEditorMeta() {
    var p = S.work.blog.posts[S.editing]; if (!p) return;
    $('pUrl').textContent = p.slug ? 'ostendic.com/blog/' + p.slug : '';
    var words = p.body.join(' ').trim().split(/\s+/).filter(Boolean).length;
    $('pWords').textContent = words + ' words · ' + Math.max(1, Math.round(words / 200)) + ' min read';
    document.querySelectorAll('.adm-count').forEach(function (c) { var f = $(c.dataset.for); c.textContent = f.value.length + ' / ' + f.maxLength; });
  }
  var bind = function (id, fn) { $(id).addEventListener('input', function () { var p = S.work.blog.posts[S.editing]; if (!p) return; fn(p, this); refreshEditorMeta(); updateBar(); }); };
  bind('pTitle', function (p, el) { p.title = el.value; if (!S.slugTouched) { p.slug = slugify(el.value); $('pSlug').value = p.slug; } });
  bind('pSlug', function (p, el) { S.slugTouched = true; p.slug = el.value.trim(); });
  bind('pCategory', function (p, el) { p.category = el.value; });
  bind('pExcerpt', function (p, el) { p.excerpt = el.value; });
  bind('pBody', function (p, el) {
    p.body = el.value.split(/\n\s*\n/).map(function (s) { return s.replace(/\s*\n\s*/g, ' ').trim(); }).filter(Boolean);
  });
  $('pSlug').addEventListener('blur', function () { var p = S.work.blog.posts[S.editing]; if (p) { p.slug = slugify(p.slug); this.value = p.slug; refreshEditorMeta(); updateBar(); } });
  $('pDraft').addEventListener('change', function () { var p = S.work.blog.posts[S.editing]; if (p) { p.draft = this.checked; updateBar(); } });
  $('deletePost').addEventListener('click', function () {
    var p = S.work.blog.posts[S.editing];
    if (!confirm('Delete "' + (p.title || 'this post') + '"? It is removed from the site when you publish.')) return;
    S.work.blog.posts.splice(S.editing, 1); closeEditor(); renderBlog(); updateBar();
  });

  /* ================= HOME ================= */
  var PANELS = [['web-development', 'Web Development and UI/UX Design'], ['agentic-ai-workflows', 'Agentic AI Workflows']];
  var get = function (o, path) { return path.reduce(function (a, k) { return a == null ? a : a[k]; }, o); };
  var set = function (o, path, v) { var last = path[path.length - 1]; get(o, path.slice(0, -1))[last] = v; };

  /* field types: text (one line), area (paragraph), lines (one item per line), paras (blank line between) */
  function field(label, path, type, max, hint) {
    var v = get(S.work.home, path);
    var input;
    if (type === 'text') input = h('input', { value: v || '', maxlength: max });
    else input = h('textarea', {
      rows: type === 'area' ? 3 : type === 'lines' ? Math.max(3, (v || []).length + 1) : 5,
      value: type === 'lines' ? (v || []).join('\n') : type === 'paras' ? (v || []).join('\n\n') : (v || ''),
      maxlength: type === 'area' ? max : null,
    });
    input.addEventListener('input', function () {
      var val = this.value;
      if (type === 'lines') val = val.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
      else if (type === 'paras') val = val.split(/\n\s*\n/).map(function (s) { return s.replace(/\s*\n\s*/g, ' ').trim(); }).filter(Boolean);
      set(S.work.home, path, val); updateBar();
    });
    return h('label', { class: 'adm-field' }, h('span', null, label), input, hint ? h('small', { class: 'adm-muted', text: hint }) : null);
  }
  function group(title, open) {
    var body = h('div', { class: 'adm-group__body' });
    var d = h('details', { class: 'adm-group adm-card', open: !!open }, h('summary', { text: title }), body);
    return { el: d, body: body };
  }

  function renderHome() {
    var f = $('homeForm'); f.textContent = '';
    var g = group('Hero (top of the page)', true);
    g.body.append(
      field('Headline', ['hero', 'headline'], 'lines', 80, 'One line per row (up to 3). Put {curly braces} around words to set them in italics.'),
      field('Intro paragraph', ['hero', 'intro'], 'area', 400),
      field('Second button label', ['hero', 'secondaryButton'], 'text', 40, 'The first button is always "Book a quick call".'));
    f.appendChild(g.el);

    g = group('Services');
    g.body.append(field('Section heading', ['services', 'heading'], 'text', 80));
    PANELS.forEach(function (pn) {
      var base = ['services', 'panels', pn[0]];
      g.body.appendChild(h('div', { class: 'adm-sub' }, h('h3', { text: pn[1] }),
        field('Summary', base.concat('summary'), 'area', 240),
        field('Who it helps', base.concat('who'), 'area', 240),
        field('The problem', base.concat('problem'), 'area', 240),
        field('What we build', base.concat('build'), 'area', 300),
        field('A project can include', base.concat('includes'), 'lines', 120, 'One item per line.')));
    });
    g.body.appendChild(h('p', { class: 'adm-muted', text: 'These panels also appear on the /services page.' }));
    f.appendChild(g.el);

    g = group('How a project runs (process)');
    g.body.append(field('Section heading', ['process', 'heading'], 'text', 80));
    S.work.home.process.steps.forEach(function (st, i) {
      g.body.appendChild(h('div', { class: 'adm-sub' }, h('h3', { text: 'Step ' + String(i + 1).padStart(2, '0') }),
        field('Title', ['process', 'steps', i, 'title'], 'text', 60),
        field('Text', ['process', 'steps', i, 'text'], 'area', 200)));
    });
    f.appendChild(g.el);

    g = group('About');
    g.body.append(
      field('Heading', ['about', 'heading'], 'text', 100),
      field('Heading, italic ending', ['about', 'headingItalic'], 'text', 80, 'Shown after the heading in italics. Leave empty for none.'),
      field('Paragraphs', ['about', 'paragraphs'], 'paras', 500, 'Leave an empty line between paragraphs (up to 4).'));
    f.appendChild(g.el);
  }

  /* ---------- boot ---------- */
  fetch('/api/admin/session', { credentials: 'same-origin' }).then(function (r) { return r.json(); }).then(function (s) {
    S.mode = s.mode;
    if (!s.configured) { showLogin('The admin password is not set up yet (ADMIN_PASSWORD in Vercel).'); return; }
    if (s.authed) start(); else showLogin();
  }).catch(function () { showLogin('Could not reach the admin service.'); });
})();

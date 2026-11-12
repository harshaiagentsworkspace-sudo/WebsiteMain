/* Ostendic — progressive enhancement only.
   Every page is readable and navigable with this file disabled. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- mobile navigation ---------- */
  var burger = document.getElementById('burger');
  var mnav = document.getElementById('mnav');
  if (burger && mnav) {
    var setMenu = function (open) {
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      mnav.setAttribute('aria-hidden', String(!open));
      if ('inert' in mnav) mnav.inert = !open;
      document.documentElement.style.overflow = open ? 'hidden' : '';
      if (open) {
        var first = mnav.querySelector('a');
        if (first) first.focus({ preventScroll: true });
      }
    };
    if ('inert' in mnav) mnav.inert = true;
    burger.addEventListener('click', function () {
      setMenu(!document.body.classList.contains('menu-open'));
    });
    mnav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
        setMenu(false); burger.focus();
      }
    });
    window.matchMedia('(min-width: 1025px)').addEventListener('change', function (m) {
      if (m.matches && document.body.classList.contains('menu-open')) setMenu(false);
    });
  }

  /* ---------- hero background video ----------
     The poster is painted by CSS. The 3 MB clip is attached only on wider
     screens, with motion allowed and no data-saver, so phones never pay
     for it. It pauses when scrolled out of view. */
  var vid = document.querySelector('.hero__vid[data-src]');
  if (vid) {
    var conn = navigator.connection || {};
    var wideEnough = window.matchMedia('(min-width: 768px)').matches;
    if (wideEnough && !reduce.matches && !conn.saveData) {
      vid.src = vid.getAttribute('data-src');
      vid.addEventListener('playing', function () { vid.classList.add('is-on'); }, { once: true });
      var p = vid.play();
      if (p && p.catch) p.catch(function () { /* autoplay refused: poster stays */ });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (en) {
          if (en[0].isIntersecting) { var q = vid.play(); if (q && q.catch) q.catch(function () {}); }
          else vid.pause();
        }).observe(vid);
      }
      reduce.addEventListener('change', function (m) { if (m.matches) vid.pause(); });
    }
  }

  /* ---------- service section background videos ----------
     Same rules as the hero clip, plus: the source is attached only when the
     section comes near the viewport, so the homepage doesn't download them
     up front. Paused whenever the section is off screen. */
  var bgvids = [].slice.call(document.querySelectorAll('.bgvid[data-src]'));
  if (bgvids.length && 'IntersectionObserver' in window) {
    var bconn = navigator.connection || {};
    if (window.matchMedia('(min-width: 768px)').matches && !reduce.matches && !bconn.saveData) {
      var bio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var v = en.target;
          if (en.isIntersecting) {
            if (!v.getAttribute('src')) {
              v.addEventListener('playing', function () { v.classList.add('is-on'); }, { once: true });
              v.src = v.getAttribute('data-src');
            }
            var q = v.play(); if (q && q.catch) q.catch(function () { /* autoplay refused: stays hidden */ });
          } else if (v.getAttribute('src')) v.pause();
        });
      }, { rootMargin: '200px 0px' });
      bgvids.forEach(function (v) { bio.observe(v); });
      reduce.addEventListener('change', function (m) { if (m.matches) bgvids.forEach(function (v) { v.pause(); }); });
    }
  }

  /* ---------- sequence rails (process roadmap, workflow example) ----------
     The rail fills as the list moves up through the viewport, and each step
     is marked reached when the fill passes its node. Only the rail, nodes and
     numbers change; step text is always fully visible. One passive scroll
     listener, reads batched in a single rAF, writes are a CSS variable and a
     class. Reduced motion (or no JS) shows the rail complete. */
  var seqs = [].slice.call(document.querySelectorAll('[data-progress]'));
  if (seqs.length) {
    var finish = function () {
      seqs.forEach(function (s) {
        s.style.setProperty('--p', '1');
        [].forEach.call(s.querySelectorAll('.seq__item'), function (it) { it.classList.add('is-reached'); });
      });
    };
    if (reduce.matches) finish();
    else {
      document.documentElement.classList.add('js-seq');
      var queued = false;
      var update = function () {
        queued = false;
        var vh = window.innerHeight;
        seqs.forEach(function (s) {
          var rail = s.querySelector('.seq__rail');
          var r = rail.getBoundingClientRect();
          var vertical = r.height > r.width;
          var len = vertical ? r.height : r.width;
          var box = s.getBoundingClientRect();
          /* 0 when the list's top reaches 85% of the viewport, 1 when its
             bottom reaches 55%: the fill completes while it is still in view */
          var start = vh * 0.85, end = vh * 0.55;
          var p = (start - box.top) / Math.max(1, (start - end) + box.height);
          p = p < 0 ? 0 : p > 1 ? 1 : p;
          s.style.setProperty('--p', p.toFixed(4));
          var fill = p * len;
          [].forEach.call(s.querySelectorAll('.seq__item'), function (it) {
            var n = it.querySelector('.seq__node').getBoundingClientRect();
            var at = vertical ? (n.top + n.height / 2 - r.top) : (n.left + n.width / 2 - r.left);
            it.classList.toggle('is-reached', fill >= at - 1);
          });
        });
      };
      var request = function () { if (!queued) { queued = true; requestAnimationFrame(update); } };
      window.addEventListener('scroll', request, { passive: true });
      window.addEventListener('resize', request);
      reduce.addEventListener('change', function (m) { if (m.matches) { window.removeEventListener('scroll', request); finish(); } });
      update();
    }
  }

  /* ---------- workflow ring (homepage example) ----------
     Loops forever, one ~11 s cycle:
       0 – 7.5 s   the ring draws node to node; each node lifts as it is
                   reached (4 segments of 1.875 s: 0.7 s wait, 1.175 s draw)
       7.5 – 10 s  hold at the complete state; nothing moves
       10 – 11 s   soft reset: ring strokes fade, nodes lower, text dims
     then an invisible jump back to the start (everything is faded out).
     Runs only while the section is on screen and the tab is visible, and
     always restarts from the beginning of a cycle. Reduced motion: never
     runs; the completed state (the CSS default) stays. */
  var loop = document.querySelector('[data-loop]');
  if (loop && !reduce.matches) (function () {
    var SEG = 1875, WAIT = 700, DRAW = SEG - WAIT, STEPS = 4;
    var CLOSE = SEG * STEPS, HOLD_END = CLOSE + 2500, CYCLE = HOLD_END + 1000;
    var tilt = loop.querySelector('.loop__tilt');
    var box = loop.querySelector('.loop__box');
    var nodes = loop.querySelectorAll('.loop__node');
    var shadows = loop.querySelectorAll('.loop__shadow');
    var steps = loop.querySelectorAll('.loop__step');
    var raf = 0, start = 0, phase = '', reached = -1, inView = false;
    var easeInOut = function (x) { return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };

    var setReached = function (n) {
      if (n === reached) return;
      reached = n;
      for (var k = 0; k < STEPS; k++) {
        var on = k < n;
        nodes[k].classList.toggle('is-on', on);
        shadows[k].classList.toggle('is-on', on);
        steps[k].classList.toggle('is-on', on);
      }
    };
    var setDraw = function (frac) {
      loop.style.setProperty('--draw', (100 * (1 - frac)).toFixed(3));
      loop.style.setProperty('--a', (frac * 360).toFixed(2));
    };
    /* the start of a cycle, applied with transitions off */
    var snapToStart = function () {
      loop.classList.add('is-snapping');
      loop.classList.remove('is-closed', 'is-resetting');
      setDraw(0); setReached(1); phase = 'draw';
      void loop.offsetWidth;                           // commit the jump before transitions return
      loop.classList.remove('is-snapping');
    };
    var frame = function (now) {
      var t = now - start;
      if (t >= CYCLE) { snapToStart(); start = now; t = 0; }
      if (t < CLOSE) {
        var k = Math.floor(t / SEG), within = t - k * SEG;
        var part = within > WAIT ? easeInOut((within - WAIT) / DRAW) : 0;
        setDraw((k + part) / STEPS);
        setReached(Math.min(STEPS, k + 1));
      } else if (t < HOLD_END) {
        if (phase !== 'hold') { phase = 'hold'; setDraw(1); setReached(STEPS); loop.classList.add('is-closed'); }
      } else if (phase !== 'reset') {
        phase = 'reset'; loop.classList.remove('is-closed'); loop.classList.add('is-resetting'); setReached(0);
      }
      raf = requestAnimationFrame(frame);
    };
    var run = function () {
      if (raf || !inView || document.visibilityState !== 'visible') return;
      snapToStart();
      start = performance.now();
      raf = requestAnimationFrame(frame);
    };
    var stop = function () {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      snapToStart();                                   // happens off screen or in a hidden tab
    };

    loop.classList.add('loop--live');
    snapToStart();

    var io = new IntersectionObserver(function (entries) {
      var e = entries[0];
      if (!e.isIntersecting) { inView = false; stop(); return; }
      if (e.intersectionRatio >= 0.4) { inView = true; run(); }
    }, { threshold: [0, 0.4] });
    io.observe(loop);
    var onVisibility = function () { if (document.visibilityState === 'visible') run(); else stop(); };
    document.addEventListener('visibilitychange', onVisibility);

    /* pointer parallax: desktop mouse only, at most 4 degrees */
    var fine = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)');
    var pending = null;
    var onMove = function (e) {
      if (!fine.matches || e.pointerType !== 'mouse') return;
      var r = box.getBoundingClientRect();
      var queued = pending;
      pending = [((e.clientX - r.left) / r.width - .5) * 8, ((e.clientY - r.top) / r.height - .5) * -8];
      if (queued) return;
      requestAnimationFrame(function () {
        tilt.style.setProperty('--px', Math.max(-4, Math.min(4, pending[0])).toFixed(2));
        tilt.style.setProperty('--py', Math.max(-4, Math.min(4, pending[1])).toFixed(2));
        pending = null;
      });
    };
    var onLeave = function () { tilt.style.setProperty('--px', '0'); tilt.style.setProperty('--py', '0'); };
    box.addEventListener('pointermove', onMove);
    box.addEventListener('pointerleave', onLeave);

    /* reduced motion switched on mid-session: stop and show the complete state */
    var onReduce = function (m) {
      if (!m.matches) return;
      if (raf) cancelAnimationFrame(raf);
      raf = 0; inView = false;
      loop.classList.remove('loop--live', 'is-closed', 'is-resetting');
    };
    reduce.addEventListener('change', onReduce);

    /* teardown when the page is unloaded (no SPA unmount on this static site) */
    window.addEventListener('pagehide', function (e) {
      if (e.persisted) { if (raf) cancelAnimationFrame(raf); raf = 0; return; }   // kept in bfcache: just pause
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      box.removeEventListener('pointermove', onMove);
      box.removeEventListener('pointerleave', onLeave);
      reduce.removeEventListener('change', onReduce);
    });
    window.addEventListener('pageshow', function (e) { if (e.persisted) run(); });
  })();

  /* ---------- quiet fade-in for [data-fade] (stats bar) ----------
     One 400 ms opacity fade the first time the block scrolls into view.
     Blocks already on screen at load are left alone, so nothing that is
     visible ever disappears. Reduced motion or no JS: always visible. */
  var fades = document.querySelectorAll('[data-fade]');
  if (fades.length && !reduce.matches && 'IntersectionObserver' in window) {
    var fio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        fio.unobserve(en.target);
      });
    }, { threshold: 0.2 });
    Array.prototype.forEach.call(fades, function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.classList.add('fade-pending');
      fio.observe(el);
    });
  }

  /* ---------- smooth in-page anchors (respecting reduced motion) ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (!id || id === '#') return;
    var t = document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', id);
  });

  /* ---------- enquiry form ---------- */
  var form = document.getElementById('leadForm');
  if (!form) return;
  var status = document.getElementById('formStatus');
  var submit = document.getElementById('formSubmit');
  var label = submit.querySelector('.btn-label');
  var original = label.textContent;
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var openedAt = Date.now();
  var mail = window.OSTENDIC_EMAIL || 'harsh@ostendic.com';

  var check = function (f) {
    var input = f.querySelector('input, textarea, select');
    var v = (input.value || '').trim();
    var bad = input.type === 'email' ? !emailRe.test(v)
            : input.tagName === 'TEXTAREA' ? v.length < 10
            : v.length < 2;
    f.classList.toggle('invalid', bad);
    input.setAttribute('aria-invalid', String(bad));
    return !bad;
  };
  var validate = function () {
    var ok = true;
    Array.prototype.forEach.call(form.querySelectorAll('[data-req]'), function (f) { if (!check(f)) ok = false; });
    return ok;
  };
  var setStatus = function (kind, html) {
    status.className = 'form__status' + (kind ? ' ' + kind : '');
    status.innerHTML = html || '';
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    setStatus('', '');
    if (!validate()) {
      var firstBad = form.querySelector('.invalid input, .invalid textarea');
      if (firstBad) firstBad.focus();
      setStatus('bad', 'Please check the highlighted fields.');
      return;
    }

    /* Spam trap: a filled hidden field, or a submit within two seconds of
       the page opening, is treated as a bot and dropped without a request. */
    if (form.website.value || Date.now() - openedAt < 2000) {
      form.reset();
      setStatus('ok', 'Thanks, your message has been sent.');
      return;
    }

    var extra = [];
    if (form.phone.value.trim()) extra.push('Phone/WhatsApp: ' + form.phone.value.trim());
    extra.push('Interested in: ' + form.help.value);
    var payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      company: form.company.value.trim() || null,
      budget: form.budget.value,
      project_description: form.project.value.trim() + '\n\n' + extra.join('\n'),
    };

    submit.disabled = true;
    submit.setAttribute('aria-busy', 'true');
    form.classList.add('is-sending');
    label.textContent = 'Sending…';

    var finish = function (ok) {
      submit.disabled = false;
      submit.removeAttribute('aria-busy');
      form.classList.remove('is-sending');
      label.textContent = original;
      if (ok) {
        form.reset();
        setStatus('ok', '<strong>Thanks, your enquiry has been sent.</strong> A reply will come to the email address you gave.');
      } else {
        setStatus('bad', 'Your enquiry couldn’t be sent. Please try again, or email <a href="mailto:' + mail + '">' + mail + '</a> directly.');
      }
      status.focus && status.setAttribute('tabindex', '-1');
      status.focus();
    };

    /* Real submission only. A failure is reported as a failure. */
    if (typeof window.submitLead !== 'function') { finish(false); return; }
    var timeout = new Promise(function (_, rej) { setTimeout(function () { rej(new Error('timeout')); }, 15000); });
    Promise.race([Promise.resolve(window.submitLead(payload)), timeout])
      .then(function () { finish(true); })
      .catch(function (err) { console.error('Enquiry failed:', err); finish(false); });
  });

  form.addEventListener('input', function (e) {
    var f = e.target.closest('[data-req]');
    if (f && f.classList.contains('invalid')) check(f);
  });
  form.addEventListener('focusout', function (e) {
    var f = e.target.closest('[data-req]');
    if (f && e.target.value.trim()) check(f);
  });
})();

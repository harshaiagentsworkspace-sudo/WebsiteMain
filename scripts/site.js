/* Ostendic — progressive enhancement only.
   Everything on the page is readable and usable without this file. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- mobile navigation ---------- */
  var burger = document.getElementById('burger');
  var mnav = document.getElementById('mnav');
  if (burger && mnav) {
    var setMenu = function (open) {
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
      mnav.setAttribute('aria-hidden', String(!open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) {
        var first = mnav.querySelector('a');
        if (first) first.focus({ preventScroll: true });
      }
    };
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
    window.addEventListener('resize', function () {
      if (window.innerWidth > 960 && document.body.classList.contains('menu-open')) setMenu(false);
    });
  }

  /* ---------- scroll reveal ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    var targets = document.querySelectorAll('.section > .wrap > *, .section .sec-head, .section .grid > *');
    if (targets.length) {
      document.documentElement.classList.add('js-reveal');
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
      Array.prototype.forEach.call(targets, function (t, i) {
        // never hide the first screen — it must be readable at rest
        if (t.getBoundingClientRect().top < window.innerHeight * 1.1) return;
        t.classList.add('reveal');
        t.style.transitionDelay = (Math.min(i % 4, 3) * 60) + 'ms';
        io.observe(t);
      });
    }
  }

  /* ---------- category filters (work, resources) ---------- */
  function wireFilter(groupId, gridId, emptyId) {
    var group = document.getElementById(groupId);
    var grid = document.getElementById(gridId);
    if (!group || !grid) return;
    var empty = document.getElementById(emptyId);
    group.addEventListener('click', function (e) {
      var btn = e.target.closest('.chip');
      if (!btn || btn.disabled) return;
      var want = btn.getAttribute('data-filter');
      Array.prototype.forEach.call(group.querySelectorAll('.chip'), function (c) {
        c.setAttribute('aria-pressed', String(c === btn));
      });
      var shown = 0;
      Array.prototype.forEach.call(grid.children, function (item) {
        var cat = item.getAttribute('data-cat');
        if (cat === null) return;                 // static filler cards stay put
        var show = want === 'All' || cat === want;
        item.hidden = !show;
        if (show) shown++;
      });
      if (empty) empty.style.display = shown ? 'none' : 'block';
    });
  }
  wireFilter('workFilter', 'workGrid', 'workEmpty');
  wireFilter('resFilter', 'resGrid', 'resEmpty');

  /* ---------- enquiry form ---------- */
  var form = document.getElementById('leadForm');
  if (form) {
    var status = document.getElementById('formStatus');
    var submit = document.getElementById('formSubmit');
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var validate = function () {
      var ok = true;
      Array.prototype.forEach.call(form.querySelectorAll('[data-req]'), function (f) {
        var input = f.querySelector('input, textarea, select');
        var v = (input.value || '').trim();
        var bad = input.type === 'email' ? !emailRe.test(v)
                : input.id === 'f-project' ? v.length < 10
                : v.length < 2;
        f.classList.toggle('invalid', bad);
        input.setAttribute('aria-invalid', String(bad));
        if (bad) ok = false;
      });
      return ok;
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form__status';
      status.textContent = '';
      if (!validate()) {
        var firstBad = form.querySelector('.invalid input, .invalid textarea');
        if (firstBad) firstBad.focus();
        return;
      }
      var payload = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        company: form.company.value.trim() || null,
        budget: form.budget.value,
        project_description: form.project.value.trim() + '\n\nInterest: ' + form.help.value,
      };
      submit.disabled = true;
      var label = submit.querySelector('.btn-label');
      var original = label.textContent;
      label.textContent = 'Sending…';

      var done = function (okState) {
        submit.disabled = false;
        label.textContent = okState ? 'Sent' : original;
        if (okState) {
          status.className = 'form__status ok';
          status.textContent = 'Thanks — that reached us. We reply within one business day.';
          form.reset();
        } else {
          status.className = 'form__status bad';
          status.innerHTML = 'That did not send. Please email us directly at ' +
            '<a href="mailto:' + (window.OSTENDIC_EMAIL || 'harsh@ostendic.com') + '">' +
            (window.OSTENDIC_EMAIL || 'harsh@ostendic.com') + '</a> and we will pick it up.';
        }
      };

      // Real submission. A failure is reported as a failure — never as success.
      if (typeof window.submitLead === 'function') {
        Promise.resolve(window.submitLead(payload)).then(function () { done(true); })
          .catch(function (err) { console.error('submitLead failed:', err); done(false); });
      } else {
        console.error('No lead backend available on this page.');
        done(false);
      }
    });

    form.addEventListener('input', function (e) {
      var f = e.target.closest('[data-req]');
      if (f && f.classList.contains('invalid')) validate();
    });
  }
})();

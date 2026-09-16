/* ===========================================================================
   OSTENDIC — MOTION ENGINE

   SCROLL POLICY: the browser owns scrolling. Wheel, trackpad, keyboard,
   scrollbar and touch are all 100% native — no wheel listener, no
   preventDefault, no window.scrollTo, no scroll library.

   Weight comes from the ANIMATIONS, not from the page. Scroll position is
   read cheaply (window.scrollY) and drives a damped progress value, so
   panels settle over ~600ms while the page itself never lags the user.

   One rAF loop (idles when nothing is moving), one passive scroll listener,
   one IntersectionObserver. Without JS every section is static and readable.
   =========================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var wide = window.matchMedia('(min-width: 961px)');

  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var ease = function (t) { return t * t * (3 - 2 * t); };

  /* =======================================================================
     SMOOTH ANCHORS
     scroll-behavior:smooth was removed from <html> because it also animates
     keyboard and programmatic scrolling. Anchors get it explicitly instead.
     ======================================================================= */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (!id || id === '#') return;
    var t = document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
  });

  /* =======================================================================
     3D CATEGORY STACK — progress is damped, page scroll is not
     ======================================================================= */
  var Stack = {
    stages: [],
    init: function () {
      var self = this;
      [].forEach.call(document.querySelectorAll('[data-stack]'), function (stage) {
        var panels = [].slice.call(stage.querySelectorAll('.panel'));
        if (!panels.length) return;
        if (reduce.matches || !wide.matches) { stage.classList.add('is-static'); stage.style.height = ''; return; }
        stage.classList.remove('is-static');
        /* ~0.5 viewport of scroll per panel: about 4-5 wheel notches each,
           enough for the transition to read without making the page long. */
        stage.style.height = (panels.length * 48 + 55) + 'vh';
        var s = { el: stage, panels: panels, shown: null, target: 0, top: 0, span: 1 };
        self.measure(s);
        s.target = self.progress(s);
        s.shown = s.target;
        self.stages.push(s);
        self.paint(s);
      });
    },
    /* measured once per layout change, never per frame */
    measure: function (s) {
      var y = 0, el = s.el;
      while (el) { y += el.offsetTop; el = el.offsetParent; }
      s.top = y;
      s.span = Math.max(1, s.el.offsetHeight - window.innerHeight);
    },
    progress: function (s) {
      return clamp((window.scrollY - s.top) / s.span, 0, 1) * (s.panels.length - 1);
    },
    /* returns true while still settling, so the loop knows to keep running */
    tick: function (s) {
      s.target = this.progress(s);
      var d = s.target - s.shown;
      if (Math.abs(d) < 0.0015) { if (s.shown !== s.target) { s.shown = s.target; this.paint(s); } return false; }
      s.shown += d * 0.18;          // ~600ms settle — animation damping only
      this.paint(s);
      return true;
    },
    paint: function (s) {
      var pos = s.shown, n = s.panels.length;
      for (var i = 0; i < n; i++) {
        var d = pos - i, el = s.panels[i], t, o;
        if (d >= 0) {
          var k = Math.min(d, 2.2);
          t = 'translate3d(0,' + (-k * 22) + 'px,' + (-k * 150) + 'px) scale(' + (1 - k * 0.055) + ')';
          o = d > 1.85 ? 0 : 1;
        } else if (d <= -1) {
          t = 'translate3d(0,130%,0) scale(0.96)'; o = 0;
        } else {
          var u = ease(clamp(1 + d, 0, 1));
          t = 'translate3d(0,' + ((1 - u) * 118) + '%,0) scale(' + (0.962 + u * 0.038) + ')';
          o = clamp(u / 0.18, 0, 1);
        }
        el.style.transform = t; el.style.opacity = o; el.style.zIndex = 10 + i;
      }
    }
  };

  /* =======================================================================
     PROCESS ROADMAP — rail fill + active step + paired visual
     ======================================================================= */
  var Road = {
    roads: [],
    init: function () {
      var self = this;
      [].forEach.call(document.querySelectorAll('[data-road]'), function (el) {
        var steps = [].slice.call(el.querySelectorAll('.step'));
        if (!steps.length) return;
        var r = {
          el: el, steps: steps,
          fill: el.querySelector('.road__fill'),
          vis: [].slice.call(el.querySelectorAll('.road__v')),
          line: el.querySelector('.road__steps'),
          active: -1, top: 0, height: 1, stepTops: []
        };
        self.measure(r);
        self.roads.push(r);
        self.tick(r);
      });
    },
    /* measured once per layout change, never per frame */
    measure: function (r) {
      var abs = function (el) { var y = 0; while (el) { y += el.offsetTop; el = el.offsetParent; } return y; };
      r.top = abs(r.line);
      r.height = Math.max(1, r.line.offsetHeight);
      r.stepTops = r.steps.map(abs);
    },
    tick: function (r) {
      var scroll = window.scrollY, vh = window.innerHeight;
      var lineTop = r.top - scroll;
      if (lineTop + r.height < -200 || lineTop > vh + 200) return;
      var mark = vh * 0.58;
      var p = clamp((mark - lineTop) / r.height, 0, 1);
      if (r.fill) r.fill.style.height = (p * 100).toFixed(2) + '%';
      var idx = 0;
      for (var i = 0; i < r.steps.length; i++) {
        if (r.stepTops[i] - scroll <= mark) idx = i;
      }
      if (idx === r.active) return;
      r.active = idx;
      for (var j = 0; j < r.steps.length; j++) r.steps[j].classList.toggle('is-on', j === idx);
      for (var k = 0; k < r.vis.length; k++) r.vis[k].classList.toggle('is-on', k === idx);
    }
  };

  /* =======================================================================
     TRUST DECK — one card flips at a time, forever, paused when off-screen
     ======================================================================= */
  var Deck = {
    init: function () {
      var deck = document.querySelector('[data-deck]');
      if (!deck || reduce.matches) return;
      var cards = [].slice.call(deck.querySelectorAll('.flip'));
      if (!cards.length) return;
      var i = 0, visible = true, timer = null;
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }, { threshold: 0.12 }).observe(deck);
      }
      var tick = function () {
        if (visible) { cards[i].classList.toggle('is-flipped'); i = (i + 1) % cards.length; }
        timer = setTimeout(tick, i === 0 ? 1400 : 620);
      };
      timer = setTimeout(tick, 900);
      window.addEventListener('pagehide', function () { clearTimeout(timer); });
    }
  };

  /* =======================================================================
     REVEALS — scroll-entry only, never a blanket on-load fade
     ======================================================================= */
  var Reveal = {
    init: function () {
      if (reduce.matches || !('IntersectionObserver' in window)) return;
      var targets = [].slice.call(document.querySelectorAll('[data-rv]'));
      if (!targets.length) return;
      document.documentElement.classList.add('js-reveal');
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
      targets.forEach(function (t) {
        if (t.getBoundingClientRect().top < window.innerHeight * 0.95) return;
        t.classList.add('rv');
        io.observe(t);
      });
    }
  };

  /* =======================================================================
     LOOP — runs only while something is actually moving
     ======================================================================= */
  var running = false, idle = 0;

  function frame() {
    var busy = false;
    for (var i = 0; i < Stack.stages.length; i++) { if (Stack.tick(Stack.stages[i])) busy = true; }
    for (var j = 0; j < Road.roads.length; j++) Road.tick(Road.roads[j]);
    // keep spinning briefly after the last change so nothing stops mid-settle
    idle = busy ? 0 : idle + 1;
    if (idle > 30) { running = false; return; }
    requestAnimationFrame(frame);
  }

  function wake() {
    idle = 0;
    if (!running) { running = true; requestAnimationFrame(frame); }
  }

  function boot() {
    Stack.init();
    Road.init();
    Deck.init();
    Reveal.init();
    // passive: the browser is never blocked waiting on us
    window.addEventListener('scroll', wake, { passive: true });
    var relayout = function () {
      Stack.stages.length = 0; Road.roads.length = 0;
      Stack.init(); Road.init(); wake();
    };
    window.addEventListener('resize', relayout);
    // fonts and images change layout after first paint
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
    window.addEventListener('load', relayout);
    wake();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

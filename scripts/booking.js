/* Ostendic — booking embed (/book only).
   Loads the scheduling provider configured in build/data.mjs (Calendly or
   Cal.com) inline. Dates, time slots, the details form and the booking
   itself all live in the provider's embed; this file only manages the
   surrounding states:
     loading  → until the provider reports the calendar is ready
     error    → script blocked / failed, or nothing ready after 15 s
     done     → ONLY when the provider fires its own "booked" event
   Nothing here simulates availability or confirms a booking by itself. */
(function () {
  'use strict';
  var panel = document.getElementById('booking');
  var mount = document.getElementById('bookingEmbed');
  if (!panel || !mount) return;
  var provider = panel.getAttribute('data-provider');
  var url = panel.getAttribute('data-url');
  var states = {};
  Array.prototype.forEach.call(panel.querySelectorAll('[data-state]'), function (el) {
    states[el.getAttribute('data-state')] = el;
  });
  var current = 'loading';
  var show = function (name) {
    current = name;
    Object.keys(states).forEach(function (k) { states[k].hidden = k !== name; });
    panel.classList.toggle('is-ready', name === 'ready');
    panel.classList.toggle('is-done', name === 'done');
    if (name === 'done') { mount.hidden = true; states.done.focus(); }
  };
  var ready = function () { if (current === 'loading') show('ready'); };
  var booked = function () { show('done'); };
  var fail = function () { if (current === 'loading') { show('error'); mount.hidden = true; } };
  var timer = setTimeout(fail, 15000);
  var clear = function () { clearTimeout(timer); };

  var loadScript = function (src, onerror) {
    var s = document.createElement('script');
    s.src = src; s.async = true;
    s.onerror = function () { clear(); onerror(); };
    document.head.appendChild(s);
    return s;
  };

  if (provider === 'calendly') {
    /* The markup is Calendly's documented inline widget
       (div.calendly-inline-widget with data-url); widget.js initialises it
       on load. The script is loaded after the page has finished loading,
       like next/script's "lazyOnload". Calendly reports its own state to
       the page via postMessage; only those messages change our states. */
    window.addEventListener('message', function (e) {
      if (e.origin !== 'https://calendly.com' || !e.data || typeof e.data.event !== 'string') return;
      if (e.data.event === 'calendly.event_type_viewed' || e.data.event === 'calendly.profile_page_viewed') { clear(); ready(); }
      if (e.data.event === 'calendly.event_scheduled') { clear(); booked(); }
    });
    var lazy = function () { loadScript('https://assets.calendly.com/assets/external/widget.js', fail); };
    if (document.readyState === 'complete') lazy();
    else window.addEventListener('load', lazy, { once: true });
    return;
  }

  if (provider === 'cal') {
    var link = new URL(url).pathname.replace(/^\/+|\/+$/g, '');
    /* Cal.com's documented embed loader */
    (function (C, A, L) {
      var p = function (a, ar) { a.q.push(ar); };
      var d = C.document;
      C.Cal = C.Cal || function () {
        var cal = C.Cal, ar = arguments;
        if (!cal.loaded) {
          cal.ns = {}; cal.q = cal.q || [];
          var s = d.head.appendChild(d.createElement('script'));
          s.src = A; s.onerror = function () { clear(); fail(); };
          cal.loaded = true;
        }
        if (ar[0] === L) {
          var api = function () { p(api, arguments); };
          var namespace = ar[1]; api.q = api.q || [];
          if (typeof namespace === 'string') { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ['initNamespace', namespace]); }
          else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, 'https://app.cal.com/embed/embed.js', 'init');
    var Cal = window.Cal;
    Cal('init', { origin: 'https://cal.com' });
    Cal('inline', { elementOrSelector: '#bookingEmbed', calLink: link, config: { layout: 'month_view', theme: 'light' } });
    Cal('ui', { theme: 'light', hideEventTypeDetails: false, layout: 'month_view', styles: { branding: { brandColor: '#0E4F47' } } });
    Cal('on', { action: 'linkReady', callback: function () { clear(); ready(); } });
    Cal('on', { action: 'linkFailed', callback: function () { clear(); fail(); } });
    Cal('on', { action: 'bookingSuccessfulV2', callback: function () { clear(); booked(); } });
    Cal('on', { action: 'bookingSuccessful', callback: function () { clear(); booked(); } });
    return;
  }

  clear(); fail();
})();

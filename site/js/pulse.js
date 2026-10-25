/* Cadence Pulse landing page.
   The page's outside links live here, in one place. Each link in pulse.html carries data-link
   and an href fallback with the same URL, so the page still works without JavaScript. */
var PULSE_LINKS = {
  start: 'https://app.founderscadence.com/fund/start',
  call: 'https://cal.com/founderscadence/30min-cadence',
  demo: 'https://app.founderscadence.com/demo' // + /fund#VC2, /founder#F4 ...
};

(function () {
  document.querySelectorAll('[data-link]').forEach(function (a) {
    var key = a.getAttribute('data-link');
    var base = PULSE_LINKS[key];
    if (!base) return;
    if (key === 'demo') {
      // keep the screen path after /demo
      var rest = a.getAttribute('href').split('/demo')[1] || '';
      a.href = base + rest;
    } else {
      a.href = base;
    }
  });

  // sections fade and rise as they scroll into view, once
  var items = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(function (el) { io.observe(el); });
})();

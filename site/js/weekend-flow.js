/* Scroll animations: the weekend flow build-up, the edition cards and the Intelligence bars.
   Weekend flow: plays the build-up once when the card scrolls into view.
   Save as site/js/weekend-flow.js and load it with <script src="js/weekend-flow.js" defer></script>. */
(function () {
  var reduceAll = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceAll && 'IntersectionObserver' in window) {
    // edition cards and Intelligence bars: reveal once when they scroll into view
    var reveal = function (el, onIn) {
      el.setAttribute('data-anim', '');
      var o = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { el.classList.add('is-in'); if (onIn) onIn(); o.disconnect(); } });
      }, { threshold: 0.3 });
      o.observe(el);
    };
    var grid = document.querySelector('.edm-grid');
    if (grid) reveal(grid);
    var app = document.querySelector('.app');
    if (app) {
      var bars = app.querySelectorAll('.bar i');
      bars.forEach(function (b, i) { b.style.setProperty('--i', i); });
      var nums = [];
      bars.forEach(function (b) {
        var n = b.parentNode.nextElementSibling;
        if (n && /^\d+$/.test(n.textContent.trim())) { nums.push(n); n.setAttribute('data-to', n.textContent.trim()); n.textContent = '0'; }
      });
      reveal(app, function () {
        nums.forEach(function (n, i) {
          var to = Number(n.getAttribute('data-to')), start = null, wait = 200 + i * 110;
          setTimeout(function () {
            requestAnimationFrame(function tick(t) {
              if (start === null) start = t;
              var p = Math.min(1, (t - start) / 1000);
              n.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
              if (p < 1) requestAnimationFrame(tick);
            });
          }, wait);
        });
      });
    }
  }

  var flow = document.querySelector('[data-wkf]');
  if (!flow) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return; // everything stays visible, no animation

  flow.setAttribute('data-anim', '');

  function countUp(el, target, delay) {
    var start = null, dur = 900;
    el.textContent = '0';
    setTimeout(function () {
      function tick(t) {
        if (start === null) start = t;
        var p = Math.min(1, (t - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, delay);
  }

  function play() {
    flow.classList.add('is-in');
    // light up the matching chips in the expert library when the expert blocks land
    var chips = document.querySelectorAll('.wk2-chip.on');
    setTimeout(function () { chips.forEach(function (c) { c.classList.add('wkf-lit'); }); }, 1450);
    // count up the payback numbers
    flow.querySelectorAll('[data-count]').forEach(function (el, i) {
      countUp(el, Number(el.getAttribute('data-count')), 2150 + i * 120);
    });
    // then keep a quiet flow running on the connectors
    setTimeout(function () { flow.classList.add('is-done'); }, 3400);
  }

  // replay hook (used by the preview page; harmless on the live site)
  window.wkfReplay = function () {
    flow.classList.remove('is-in', 'is-done');
    document.querySelectorAll('.wk2-chip.wkf-lit').forEach(function (c) { c.classList.remove('wkf-lit'); });
    void flow.offsetWidth;
    play();
  };

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { play(); io.disconnect(); }
    });
  }, { threshold: 0.3 });
  io.observe(flow);
})();

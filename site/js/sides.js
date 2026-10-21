/* One Pulse, two winners: tabs that switch by themselves every 7 s until the visitor picks one.
   Pauses while off-screen; no auto-switch under prefers-reduced-motion. */
(function () {
  var ROTATE = 7000;
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-sides]').forEach(function (root) {
    var list = root.querySelector('[role="tablist"]');
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    var auto = !still;
    var timer = document.createElement('span');
    timer.className = 'sides-timer';
    timer.setAttribute('aria-hidden', 'true');
    timer.style.setProperty('--t', ROTATE + 'ms');
    var current = 0;

    function show(i, focus) {
      current = i;
      tabs.forEach(function (t, j) {
        var on = j === i;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      list.style.setProperty('--i', i);
      if (timer.parentNode) timer.parentNode.removeChild(timer);
      if (auto) {
        // restart the timer line inside the active tab; its end moves to the next tab
        timer.style.animation = 'none';
        tabs[i].appendChild(timer);
        void timer.offsetWidth;
        timer.style.animation = '';
      }
      if (focus) tabs[i].focus();
    }

    function stop() {
      auto = false;
      if (timer.parentNode) timer.parentNode.removeChild(timer);
    }

    timer.addEventListener('animationend', function () {
      if (auto) show((current + 1) % tabs.length);
    });

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { stop(); show(i); });
    });
    list.addEventListener('keydown', function (e) {
      var k = e.key, n = tabs.length, to = null;
      if (k === 'ArrowRight' || k === 'ArrowDown') to = (current + 1) % n;
      else if (k === 'ArrowLeft' || k === 'ArrowUp') to = (current - 1 + n) % n;
      else if (k === 'Home') to = 0;
      else if (k === 'End') to = n - 1;
      if (to === null) return;
      e.preventDefault();
      stop();
      show(to, true);
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { root.classList.toggle('in', en.isIntersecting); });
      }, { threshold: 0, rootMargin: '-10% 0px' }).observe(root);
    } else {
      root.classList.add('in');
    }

    show(0);
  });
})();

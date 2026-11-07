/* For funds / For founders switch: a pill slides to the clicked side, then the page changes. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.switch').forEach(function (sw) {
    var cur = sw.querySelector('a[aria-current="page"]');
    if (!cur) return;
    var pill = document.createElement('span');
    pill.className = 'switch-pill';
    pill.setAttribute('aria-hidden', 'true');
    sw.insertBefore(pill, sw.firstChild);

    function place(a) {
      sw.style.setProperty('--x', a.offsetLeft + 'px');
      sw.style.setProperty('--w', a.offsetWidth + 'px');
      sw.querySelectorAll('a').forEach(function (x) { x.classList.toggle('on', x === a); });
    }
    function reset() {
      sw.classList.add('no-anim');
      place(cur);
      sw.offsetWidth; // apply without animating
      sw.classList.remove('no-anim');
    }

    sw.classList.add('js');
    reset();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(reset);
    window.addEventListener('resize', reset);
    window.addEventListener('pageshow', function (e) { if (e.persisted) reset(); });

    sw.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
      e.preventDefault();
      if (a === cur) return;
      place(a);
      setTimeout(function () { window.location.href = a.href; }, reduce ? 0 : 300);
    });
  });
})();

/* Phone menu: the Menu button opens the panel with the page links; a link, Close or Escape shuts it. */
(function () {
  var btn = document.querySelector('.nav-toggle');
  var panel = document.getElementById('nav-panel');
  if (!btn || !panel) return;
  var header = btn.closest('header');
  function set(open) {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    panel.hidden = !open;
    document.documentElement.classList.toggle('menu-open', open);
    // keep focus inside the open menu: everything beside the header is inert
    for (var el = header; el && el !== document.body; el = el.parentElement) {
      Array.prototype.forEach.call(el.parentElement.children, function (sib) {
        if (sib !== el && sib.tagName !== 'SCRIPT') sib.inert = open;
      });
    }
  }
  btn.addEventListener('click', function () { set(panel.hidden); });
  panel.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) { set(false); btn.focus(); }
  });
  window.addEventListener('resize', function () {
    if (!panel.hidden && getComputedStyle(btn).display === 'none') set(false); // wide again: links are back in the bar
  });
})();

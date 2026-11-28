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

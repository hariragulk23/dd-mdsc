/* Diagnóstico de la cafetera italiana y comparador de cafeína. Sin dependencias. */
(function () {
  'use strict';
  var dx = document.querySelector('[data-dx]');
  if (dx) {
    var opts = dx.querySelectorAll('[data-dx-key]');
    var empty = dx.querySelector('[data-dx-empty]');
    Array.prototype.forEach.call(opts, function (b) {
      b.addEventListener('click', function () {
        var key = b.getAttribute('data-dx-key');
        Array.prototype.forEach.call(opts, function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
        Array.prototype.forEach.call(dx.querySelectorAll('[data-dx-res]'), function (r) { r.hidden = r.getAttribute('data-dx-res') !== key; });
        if (empty) empty.hidden = true;
      });
    });
  }

  var caf = document.querySelector('[data-caf]');
  if (caf) {
    var MAX = 90;
    var bar = caf.querySelector('[data-caf-decaf]'), mgOut = caf.querySelector('[data-caf-decaf-mg]');
    var inp = caf.querySelector('[data-caf-in]'), out = caf.querySelector('[data-caf-out]'), sum = caf.querySelector('[data-caf-sum]');
    var upd = function () {
      var g = parseInt(inp.value, 10), mg = g; /* 0,1 % de g gramos = g miligramos */
      out.textContent = g + ' g';
      mgOut.textContent = mg + ' mg';
      bar.setAttribute('data-mg', String(mg));
      bar.style.width = Math.min(100, (mg / MAX) * 100) + '%';
      sum.textContent = 'Con ' + g + ' g de café descafeinado, la taza tiene como máximo unos ' + mg + ' mg de cafeína.';
    };
    inp.addEventListener('input', upd);
    upd();
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce && 'IntersectionObserver' in window) {
      caf.classList.add('is-pending');
      var io = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { caf.classList.remove('is-pending'); io.disconnect(); }
      }, { threshold: 0.3 });
      io.observe(caf);
    }
  }
})();

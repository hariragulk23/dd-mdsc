/* Franja de fotos: entrada suave al hacer scroll. Sin dependencias. */
(function () {
  'use strict';
  var bands = document.querySelectorAll('.photo-band');
  if (!bands.length) return;
  document.documentElement.classList.add('pb-js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    for (var i = 0; i < bands.length; i++) bands[i].classList.add('is-in');
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.15 });
  for (var k = 0; k < bands.length; k++) io.observe(bands[k]);
})();

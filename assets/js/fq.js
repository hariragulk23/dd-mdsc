/* FAQ v2: acordeón accesible con animación suave. Sin dependencias. */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('fq-js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function panel(d) { return d.querySelector('.fq__a'); }

  function openItem(d) {
    var p = panel(d);
    d.open = true;
    if (reduce || !p || !p.animate) return;
    d.setAttribute('data-busy', '1');
    var h = p.scrollHeight;
    var a = p.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }],
      { duration: 380, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
    a.onfinish = a.oncancel = function () { d.removeAttribute('data-busy'); };
  }

  function closeItem(d) {
    var p = panel(d);
    if (reduce || !p || !p.animate) { d.open = false; return; }
    d.setAttribute('data-busy', '1');
    var h = p.offsetHeight;
    var a = p.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }],
      { duration: 260, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });
    a.onfinish = function () { d.open = false; d.removeAttribute('data-busy'); };
    a.oncancel = function () { d.removeAttribute('data-busy'); };
  }

  document.addEventListener('click', function (e) {
    var s = e.target.closest ? e.target.closest('.fq__item > summary') : null;
    if (!s) return;
    var d = s.parentNode;
    e.preventDefault();
    if (d.hasAttribute('data-busy')) return;
    if (d.open) { closeItem(d); return; }
    var list = d.closest('.fq__list');
    if (list) {
      var others = list.querySelectorAll('.fq__item[open]');
      for (var i = 0; i < others.length; i++) if (others[i] !== d) closeItem(others[i]);
    }
    openItem(d);
  });

  // abrir una pregunta desde un enlace con #id
  if (location.hash) {
    try {
      var t = document.querySelector(location.hash);
      if (t && t.classList && t.classList.contains('fq__item')) t.open = true;
    } catch (err) { /* hash no válido */ }
  }

  // entrada suave al hacer scroll
  var blocks = document.querySelectorAll('.fq');
  if (!('IntersectionObserver' in window) || reduce) {
    for (var b = 0; b < blocks.length; b++) blocks[b].classList.add('is-in');
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  for (var k = 0; k < blocks.length; k++) io.observe(blocks[k]);
})();

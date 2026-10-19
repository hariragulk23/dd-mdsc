/* glossary.js: live search, topic filters, scroll reveal */
(function () {
  'use strict';
  var root = document.querySelector('[data-gl]');
  if (!root) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  root.classList.add('is-ready');

  var cards = [].slice.call(root.querySelectorAll('.gl-card'));
  var input = root.querySelector('[data-gl-search]');
  var chips = [].slice.call(root.querySelectorAll('[data-gl-cat]'));
  var count = root.querySelector('[data-gl-count]');
  var empty = root.querySelector('[data-gl-empty]');
  var cat = 'all';
  var norm = function (s) { return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); };
  cards.forEach(function (c) { c._text = norm(c.textContent + ' ' + (c.getAttribute('data-terms') || '')); });

  var apply = function () {
    var q = norm(input.value.trim());
    var n = 0;
    cards.forEach(function (c) {
      var ok = (cat === 'all' || c.getAttribute('data-cat') === cat) && (!q || c._text.indexOf(q) > -1);
      c.hidden = !ok;
      if (ok) { n++; c.classList.add('is-in'); }
    });
    count.textContent = n === 1 ? '1 término' : n + ' términos';
    empty.hidden = n !== 0;
  };
  input.addEventListener('input', apply);
  chips.forEach(function (b) {
    b.addEventListener('click', function () {
      cat = b.getAttribute('data-gl-cat');
      chips.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      apply();
    });
  });

  if (hasIO && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var i = cards.indexOf(e.target);
          e.target.style.transitionDelay = ((i % 3) * 0.08) + 's';
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    cards.forEach(function (c) { io.observe(c); });
  } else {
    cards.forEach(function (c) { c.classList.add('is-in'); });
  }
})();

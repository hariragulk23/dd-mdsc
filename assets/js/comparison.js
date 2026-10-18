/* comparison.js: column focus, expandable rows */
(function () {
  'use strict';
  var root = document.querySelector('[data-compare]');
  if (!root) return;
  root.classList.add('is-ready');

  var picks = [].slice.call(root.querySelectorAll('[data-pick]'));
  var heads = [].slice.call(root.querySelectorAll('.cmp-col'));

  function setPick(k) {
    if (k !== 'all' && root.getAttribute('data-pick') === k) k = 'all';
    root.setAttribute('data-pick', k);
    picks.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-pick') === k)); });
    heads.forEach(function (h) { h.setAttribute('aria-pressed', String(h.getAttribute('data-col') === k)); });
  }
  picks.forEach(function (b) { b.addEventListener('click', function () { setPick(b.getAttribute('data-pick')); }); });
  heads.forEach(function (h) { h.addEventListener('click', function () { setPick(h.getAttribute('data-col')); }); });

  [].slice.call(root.querySelectorAll('.cmp-label')).forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });
  });

  setPick('all');
})();

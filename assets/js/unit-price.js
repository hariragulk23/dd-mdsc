/* Precio por kg junto al precio de cada bolsa de 250 g (obligatorio en España).
   El texto ya viene escrito en el HTML; este script lo recalcula con el precio de products.js. */
(function () {
  'use strict';
  var EN = (document.documentElement.getAttribute('lang') || 'es').slice(0, 2) === 'en';
  var list = window.MSC_PRODUCTS || [];
  var by = {};
  list.forEach(function (p) { if (p && p.id) by[p.id] = p; });
  function eur(n) { return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }); }
  if (EN) eur = function (n) { return n.toLocaleString('en-GB', { style: 'currency', currency: 'EUR' }); };
  function run() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-unit-price]'), function (el) {
      var p = by[el.getAttribute('data-unit-price')];
      if (!p || !(p.price > 0)) return;
      el.textContent = eur(p.price / 0.25) + '/kg';
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();

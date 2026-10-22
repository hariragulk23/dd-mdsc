/* Calculadora de coste del café por taza y lista de señales. Sin dependencias. */
(function () {
  'use strict';
  function eur(n) { return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }); }
  function num(n, d) { return n.toLocaleString('es-ES', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }

  var calc = document.querySelector('[data-calc]');
  if (calc) {
    var kg = calc.querySelector('[data-in="kg"]'), g = calc.querySelector('[data-in="g"]'), cup = calc.querySelector('[data-in="cup"]');
    var out = function (k) { return calc.querySelector('[data-out="' + k + '"]'); };
    var res = function (k) { return calc.querySelector('[data-res="' + k + '"]'); };
    var svg = calc.querySelector('.calc__cup'), sum = calc.querySelector('[data-sum]');
    var update = function () {
      var K = parseFloat(kg.value), G = parseFloat(g.value), C = parseFloat(cup.value);
      var cost = (G / 1000) * K, share = (cost / C) * 100, rise = (G / 1000) * 10;
      out('kg').textContent = num(K) + ' €/kg';
      out('g').textContent = num(G) + ' g';
      out('cup').textContent = eur(C);
      res('cost').textContent = eur(cost);
      res('share').textContent = (share > 100 ? 'más del 100' : num(share)) + ' %';
      res('rise').textContent = '+' + eur(rise) + ' por taza';
      svg.style.setProperty('--fill', String(Math.max(0, Math.min(1, share / 100))));
      sum.textContent = 'Con ' + num(G) + ' g de café a ' + num(K) + ' €/kg, el grano cuesta ' + eur(cost) +
        ' de una taza de ' + eur(C) + (share > 100 ? '.' : ' (' + num(share) + ' %).');
    };
    [kg, g, cup].forEach(function (el) { el.addEventListener('input', update); });
    update();
  }

  var chk = document.querySelector('[data-chk]');
  if (chk) {
    var boxes = chk.querySelectorAll('input[type="checkbox"]');
    var dots = chk.querySelectorAll('.chk__beans i');
    var msg = chk.querySelector('[data-chk-res]');
    var upd = function () {
      var n = 0;
      Array.prototype.forEach.call(boxes, function (b) { if (b.checked) n++; });
      Array.prototype.forEach.call(dots, function (d, i) { d.classList.toggle('on', i < n); });
      msg.textContent = n === 0 ? 'Marca las señales que encuentres.'
        : n <= 1 ? 'Es un café normal con precio de especialidad. Pregunta antes de volver.'
        : n <= 3 ? 'Van por buen camino. Pregunta por el origen la próxima vez.'
        : 'Pagas por trabajo real, no por decoración.';
    };
    Array.prototype.forEach.call(boxes, function (b) { b.addEventListener('change', upd); });
    upd();
  }
})();

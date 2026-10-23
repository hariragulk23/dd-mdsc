/* Calculadora de coste del café por taza y lista de señales (ES / EN). Sin dependencias.
   El idioma sale de <html lang="...">. */
(function () {
  'use strict';
  var LANG = ((document.documentElement.getAttribute('lang') || 'es').slice(0, 2) === 'en') ? 'en' : 'es';
  var LOC = LANG === 'en' ? 'en-GB' : 'es-ES';
  var T = {
    es: {
      kg: function (n) { return n + ' €/kg'; }, pct: function (n) { return n + ' %'; }, over: 'más del 100 %',
      rise: function (v) { return '+' + v + ' por taza'; },
      sum: function (G, K, cost, C, share) { return 'Con ' + G + ' g de café a ' + K + ' €/kg, el grano cuesta ' + cost + ' de una taza de ' + C + (share === null ? '.' : ' (' + share + ' %).'); },
      c0: 'Marca las señales que encuentres.', c1: 'Es un café normal con precio de especialidad. Pregunta antes de volver.',
      c3: 'Van por buen camino. Pregunta por el origen la próxima vez.', c5: 'Pagas por trabajo real, no por decoración.'
    },
    en: {
      kg: function (n) { return '€' + n + '/kg'; }, pct: function (n) { return n + '%'; }, over: 'over 100%',
      rise: function (v) { return '+' + v + ' per cup'; },
      sum: function (G, K, cost, C, share) { return 'With ' + G + ' g of coffee at €' + K + '/kg, the beans cost ' + cost + ' of a ' + C + ' cup' + (share === null ? '.' : ' (' + share + '%).'); },
      c0: 'Tick the signs you find.', c1: "It's ordinary coffee at a specialty price. Ask questions before you come back.",
      c3: 'On the right track. Ask about the origin next time.', c5: "You're paying for real work, not decoration."
    }
  }[LANG];
  function eur(n) { return n.toLocaleString(LOC, { style: 'currency', currency: 'EUR' }); }
  function num(n, d) { return n.toLocaleString(LOC, { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }

  var calc = document.querySelector('[data-calc]');
  if (calc) {
    var kg = calc.querySelector('[data-in="kg"]'), g = calc.querySelector('[data-in="g"]'), cup = calc.querySelector('[data-in="cup"]');
    var out = function (k) { return calc.querySelector('[data-out="' + k + '"]'); };
    var res = function (k) { return calc.querySelector('[data-res="' + k + '"]'); };
    var svg = calc.querySelector('.calc__cup'), sum = calc.querySelector('[data-sum]');
    var update = function () {
      var K = parseFloat(kg.value), G = parseFloat(g.value), C = parseFloat(cup.value);
      var cost = (G / 1000) * K, share = (cost / C) * 100, rise = (G / 1000) * 10;
      out('kg').textContent = T.kg(num(K));
      out('g').textContent = num(G) + ' g';
      out('cup').textContent = eur(C);
      res('cost').textContent = eur(cost);
      res('share').textContent = share > 100 ? T.over : T.pct(num(share));
      res('rise').textContent = T.rise(eur(rise));
      svg.style.setProperty('--fill', String(Math.max(0, Math.min(1, share / 100))));
      sum.textContent = T.sum(num(G), num(K), eur(cost), eur(C), share > 100 ? null : num(share));
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
      msg.textContent = n === 0 ? T.c0 : n <= 1 ? T.c1 : n <= 3 ? T.c3 : T.c5;
    };
    Array.prototype.forEach.call(boxes, function (b) { b.addEventListener('change', upd); });
    upd();
  }
})();

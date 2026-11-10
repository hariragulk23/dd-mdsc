/* journal-tools-3.js: test del molinillo y comparador de cursos. Solo en español. */
(function () {
  'use strict';
  function eur(n) { return n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'; }

  // --- Test del molinillo
  var mq = document.querySelector('[data-jt="molinillo"]');
  if (mq) {
    var out = mq.querySelector('.jt-result');
    var pick = function (n) { var el = mq.querySelector('input[name="' + n + '"]:checked'); return el ? el.value : null; };
    mq.addEventListener('change', function () {
      var m = pick('jt-metodo'), t = pick('jt-tazas'), p = pick('jt-precio');
      if (!m || !t || !p) return;
      var title, text;
      if (m === 'espresso') {
        if (p === 'bajo') {
          title = 'Un manual de muelas apto para espresso';
          text = 'Con menos de 60 € es difícil encontrar un eléctrico que muela bien para espresso. Busca un manual que diga expresamente que sirve para espresso, con ajuste fino.';
        } else if (t === 'muchas' || p === 'alto') {
          title = 'Un eléctrico de muelas apto para espresso';
          text = 'Para varias tazas al día te ahorrará tiempo. Busca ajuste continuo o pasos muy pequeños, y poca retención.';
        } else {
          title = 'Un manual de muelas apto para espresso';
          text = 'Con este presupuesto, un buen manual muele mejor para espresso que muchos eléctricos de su precio.';
        }
      } else {
        if (t === 'muchas' && p !== 'bajo') {
          title = 'Un eléctrico de muelas para filtro';
          text = 'Para varias tazas al día, un eléctrico es más cómodo. No necesitas que sea apto para espresso: con uno para filtro te basta.';
        } else {
          title = 'Un manual de muelas';
          text = 'Es la mejor relación calidad-precio para ' + (m === 'moka' ? 'cafetera italiana' : m === 'prensa' ? 'prensa francesa' : 'filtro y AeroPress') + '. Silencioso, sin enchufe y con una molienda uniforme.';
        }
      }
      out.innerHTML = '<strong></strong><span></span>';
      out.querySelector('strong').textContent = title;
      out.querySelector('span').textContent = text;
      out.hidden = false;
    });
  }

  // --- Comparador de cursos
  var cc = document.querySelector('[data-jt="cursos"]');
  if (cc) {
    var res = cc.querySelector('.jt-result');
    var val = function (k) { var v = parseFloat((cc.querySelector('[data-jt-in="' + k + '"]').value || '').replace(',', '.')); return isFinite(v) && v > 0 ? v : null; };
    var calc = function () {
      var r = {};
      ['a', 'b'].forEach(function (s) {
        var pr = val(s + '-precio'), h = val(s + '-horas'), o = cc.querySelector('[data-jt-out="' + s + '"]');
        if (pr && h) { r[s] = pr / h; o.textContent = eur(r[s]) + ' por hora de práctica'; }
        else { o.textContent = '—'; }
      });
      if (r.a && r.b) {
        var diff = Math.abs(r.a - r.b);
        if (diff < 0.01) res.textContent = 'Los dos cursos salen igual por hora de práctica.';
        else res.textContent = 'El curso ' + (r.a < r.b ? 'A' : 'B') + ' sale mejor: ' + eur(diff) + ' menos por cada hora de práctica.';
        res.hidden = false;
      } else { res.hidden = true; }
    };
    cc.addEventListener('input', calc);
  }
})();

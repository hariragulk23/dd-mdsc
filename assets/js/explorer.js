/* explorer.js: tabs, score slider, label decoder and roast compare */
(function () {
  'use strict';
  var root = document.querySelector('[data-explorer]');
  if (!root) return;

  /* Tabs */
  var tabs = [].slice.call(root.querySelectorAll('[role="tab"]'));
  var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
  function select(i, focus) {
    tabs.forEach(function (t, k) {
      var on = k === i;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      panels[k].hidden = !on;
    });
    if (focus) tabs[i].focus();
  }
  root.classList.add('is-ready');
  select(0, false);
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(i, false); });
    t.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') n = 0;
      else if (e.key === 'End') n = tabs.length - 1;
      if (n !== null) { e.preventDefault(); select(n, true); }
    });
  });

  /* Score slider */
  var score = root.querySelector('[data-score]');
  if (score) {
    var input = score.querySelector('[data-score-input]');
    var out = score.querySelector('[data-score-out]');
    var band = score.querySelector('[data-score-band]');
    var desc = score.querySelector('[data-score-desc]');
    var BANDS = [
      { name: 'Por debajo de 80 · no es especialidad', text: 'Café comercial. Queda fuera de la especialidad.' },
      { name: 'Muy bueno · ya es especialidad', text: 'Limpio, dulce y con un carácter reconocible.' },
      { name: 'Excelente', text: 'Más claridad y complejidad. Aquí suelen estar los cafés que los buenos tostadores destacan.' },
      { name: 'Excepcional', text: 'Rango poco frecuente, reservado a lotes muy destacados.' }
    ];
    var updateScore = function () {
      var v = parseFloat(input.value);
      var b = v < 80 ? 0 : v < 85 ? 1 : v < 90 ? 2 : 3;
      out.textContent = (v % 1 === 0) ? String(v) : String(v).replace('.', ',');
      band.textContent = BANDS[b].name;
      desc.textContent = BANDS[b].text;
      score.setAttribute('data-band', String(b));
      input.setAttribute('aria-valuetext', out.textContent + ' puntos, ' + BANDS[b].name);
    };
    input.addEventListener('input', updateScore);
    updateScore();
  }

  /* Label decoder */
  var label = root.querySelector('[data-label]');
  if (label) {
    var INFO = {
      origen: ['País y región', 'Dónde se cultivó. Cuanto más concreto, mejor trazabilidad.'],
      finca: ['Finca o productor', 'Quién lo cultivó. En el café de especialidad suele figurar el nombre.'],
      altitud: ['Altitud', 'Metros sobre el nivel del mar. Se suele asociar a granos más densos y a más acidez.'],
      variedad: ['Variedad', 'La planta de café: Caturra, Bourbon, Geisha… Cada una aporta un carácter propio.'],
      proceso: ['Proceso', 'Cómo se retiró la fruta del grano. Lavado: taza limpia. Natural: más fruta y cuerpo. Honey: dulzor y equilibrio.'],
      tueste: ['Fecha de tueste', 'El dato más útil para saber si está fresco. Si no aparece, pregunta.'],
      notas: ['Notas de cata', 'Sabores que el tostador ha encontrado en la taza. Son una guía, no una promesa.']
    };
    var keys = [].slice.call(label.querySelectorAll('[data-key]'));
    var infoT = label.querySelector('[data-label-title]');
    var infoP = label.querySelector('[data-label-text]');
    var showKey = function (k) {
      keys.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-key') === k ? 'true' : 'false'); });
      infoT.textContent = INFO[k][0];
      infoP.textContent = INFO[k][1];
    };
    keys.forEach(function (b) {
      b.addEventListener('click', function () { showKey(b.getAttribute('data-key')); });
    });
    showKey('origen');
  }

  /* Roast compare */
  var rc = root.querySelector('[data-rc-root]');
  if (rc) {
    var btns = [].slice.call(rc.querySelectorAll('[data-rc-btn]'));
    var cells = [].slice.call(rc.querySelectorAll('[data-esp]'));
    var setRc = function (k) {
      rc.setAttribute('data-rc', k);
      btns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-rc-btn') === k ? 'true' : 'false'); });
      cells.forEach(function (c) { c.textContent = c.getAttribute('data-' + k); });
    };
    btns.forEach(function (b) {
      b.addEventListener('click', function () { setRc(b.getAttribute('data-rc-btn')); });
    });
    setRc('esp');
  }

  /* Pronunciation (only where the browser can speak) */
  var say = root.querySelector('[data-say]');
  if (say && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) {
    say.hidden = false;
    say.addEventListener('click', function () {
      window.speechSynthesis.cancel();
      var u = new window.SpeechSynthesisUtterance('café de especialidad');
      u.lang = 'es-ES';
      u.rate = 0.9;
      u.onstart = function () { say.setAttribute('aria-pressed', 'true'); };
      u.onend = u.onerror = function () { say.setAttribute('aria-pressed', 'false'); };
      window.speechSynthesis.speak(u);
    });
  }
})();

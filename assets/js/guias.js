/* guias.js — interactions for the Guías page. ES5, no libraries.
   Everything works without JavaScript; this file only adds interaction. */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js-g');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function headerOffset() { return 96; }

  // Smooth scroll that also works when the site uses Lenis.
  function goTo(el) {
    if (!el) return;
    if (window.lenis && typeof window.lenis.scrollTo === 'function') {
      window.lenis.scrollTo(el, { offset: -headerOffset() });
    } else {
      var y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset();
      window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    }
  }

  // Draw-in strokes: give every outline a path length of 1.
  $$('.g-art .g-line').forEach(function (n) { n.setAttribute('pathLength', '1'); });

  /* ---------- Calculator link ---------- */
  var brew = $('[data-brew]');
  var calcSec = brew ? brew.closest('section') : null;
  if (calcSec && !calcSec.id) calcSec.id = 'calculadora';
  if (calcSec && !calcSec.hasAttribute('data-chapter')) calcSec.setAttribute('data-chapter', 'Calculadora');

  function useInCalc(method) {
    if (!brew) return;
    var b = brew.querySelector('[data-method="' + method + '"]');
    if (b) b.click();
    goTo(brew);
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-use-method]') : null;
    if (t) { e.preventDefault(); useInCalc(t.getAttribute('data-use-method')); }
  });

  /* ---------- Quiz ---------- */
  var quiz = $('[data-quiz]');
  if (quiz) {
    var answers = {};
    var RESULTS = {
      '1-limpia-facil': ['aeropress', 'AeroPress', 'Rápida, fácil de limpiar y con una taza limpia. Perdona los errores de principiante.'],
      '1-limpia-exp': ['v60', 'V60', 'La taza más aromática para una persona. Cada ajuste se nota, ideal si te gusta experimentar.'],
      '1-cuerpo-facil': ['moka', 'Moka', 'Café intenso con la cafetera que seguramente ya tienes. Con buen café y dos trucos, cambia mucho.'],
      '1-cuerpo-exp': ['espresso', 'Espresso', 'Máxima intensidad y control. Necesita máquina y molino, y mucha práctica.'],
      '2-limpia-facil': ['chemex', 'Chemex', 'Prepara varias tazas limpias de una vez y queda preciosa en la mesa.'],
      '2-limpia-exp': ['chemex', 'Chemex', 'Varias tazas limpias y aromáticas, con margen para ajustar el vertido.'],
      '2-cuerpo-facil': ['prensa', 'Prensa francesa', 'La forma más sencilla de hacer café con cuerpo para varias personas.'],
      '2-cuerpo-exp': ['prensa', 'Prensa francesa', 'Con cuerpo para compartir. Juega con la molienda y el tiempo de reposo.']
    };
    var CALC = { v60: 1, chemex: 1, aeropress: 1, prensa: 1, espresso: 1 };
    var out = $('[data-quiz-result]', quiz);
    $$('.g-q', quiz).forEach(function (fs) {
      var key = fs.getAttribute('data-q');
      $$('button', fs).forEach(function (b) {
        b.addEventListener('click', function () {
          $$('button', fs).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
          answers[key] = b.getAttribute('data-v');
          render();
        });
      });
    });
    function render() {
      if (!answers.q1 || !answers.q2 || !answers.q3) {
        var left = 3 - (answers.q1 ? 1 : 0) - (answers.q2 ? 1 : 0) - (answers.q3 ? 1 : 0);
        out.innerHTML = '<p class="muted">Te ' + (left === 1 ? 'queda 1 pregunta.' : 'quedan ' + left + ' preguntas.') + '</p>';
        return;
      }
      var r = RESULTS[answers.q1 + '-' + answers.q2 + '-' + answers.q3];
      out.classList.add('is-done');
      out.innerHTML = '<p class="small muted">Tu método</p><p class="g-res-name">' + r[1] + '</p><p>' + r[2] + '</p>' +
        '<div class="btn-row"><a class="btn btn--ghost" href="#metodo-' + r[0] + '" data-goto>Ver la receta</a>' +
        (CALC[r[0]] ? '<button type="button" class="btn btn--primary" data-use-method="' + r[0] + '">Usar en la calculadora</button>' : '') + '</div>';
    }
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[data-goto], .g-stage-tabs a, .g-toc-list a') : null;
    if (!a) return;
    var id = a.getAttribute('href');
    if (!id || id.charAt(0) !== '#') return;
    var el = document.getElementById(id.slice(1));
    if (!el) return;
    e.preventDefault();
    goTo(el);
    closeToc();
  });

  /* ---------- Methods: scroll-driven stage ---------- */
  var methods = $$('.g-method');
  var stageName = $('[data-stage-name]');
  function setActive(id) {
    $$('.g-stage-art').forEach(function (a) { a.classList.toggle('is-on', a.getAttribute('data-stage') === id); });
    $$('.g-stage-tabs a').forEach(function (a) { a.classList.toggle('is-on', a.getAttribute('data-tab') === id); });
    var m = document.getElementById('metodo-' + id);
    if (stageName && m) stageName.textContent = $('h3', m).textContent;
  }
  if (methods.length) {
    if (hasIO) {
      // A method counts as "current" when it crosses the middle band of the screen.
      var mid = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          if (en.isIntersecting) setActive(en.target.getAttribute('data-method-id'));
        });
      }, { rootMargin: '-45% 0px -45% 0px' });
      // Separate observer to switch on bars and the inline drawing (mobile).
      var vis = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) { if (en.isIntersecting) en.target.classList.add('is-on'); });
      }, { threshold: 0.25 });
      methods.forEach(function (m) { mid.observe(m); vis.observe(m); });
    } else {
      methods.forEach(function (m) { m.classList.add('is-on'); });
    }
    setActive(methods[0].getAttribute('data-method-id'));
  }

  /* ---------- Grind ---------- */
  var grind = $('[data-grind]');
  if (grind) {
    var range = $('[data-grind-range]', grind);
    var svg = $('[data-grind-svg]', grind);
    var data = $$('.g-grind-data li', grind).map(function (li) {
      var s = li.querySelectorAll('span');
      return { name: li.querySelector('b').textContent, like: s[0].textContent, use: s[1].textContent, r: parseFloat(li.getAttribute('data-r')) };
    });
    var NS = 'http://www.w3.org/2000/svg';
    var cols = 7, cell = 320 / cols, seed = 7;
    function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    var fills = ['#5B2E1B', '#6E3A22', '#4A2516', '#7C4729'];
    var parts = [];
    for (var y = 0; y < cols; y++) {
      for (var x = 0; x < cols; x++) {
        var cx = x * cell + cell / 2 + (rnd() - 0.5) * cell * 0.5;
        var cy = y * cell + cell / 2 + (rnd() - 0.5) * cell * 0.5;
        var dx = cx - 160, dy = cy - 160;
        if (Math.sqrt(dx * dx + dy * dy) > 150) continue;
        var pts = [], n = 6 + Math.floor(rnd() * 3);
        for (var k = 0; k < n; k++) {
          var ang = (k / n) * Math.PI * 2, rr = 4 * (0.7 + rnd() * 0.5);
          pts.push((cx + Math.cos(ang) * rr).toFixed(1) + ',' + (cy + Math.sin(ang) * rr).toFixed(1));
        }
        var p = document.createElementNS(NS, 'polygon');
        p.setAttribute('points', pts.join(' '));
        p.setAttribute('class', 'g-p');
        p.setAttribute('fill', fills[Math.floor(rnd() * fills.length)]);
        svg.appendChild(p);
        parts.push(p);
      }
    }
    function upd() {
      var d = data[+range.value];
      $('[data-grind-name]', grind).textContent = d.name;
      $('[data-grind-like]', grind).textContent = d.like;
      $('[data-grind-use]', grind).textContent = d.use;
      range.setAttribute('aria-valuetext', d.name + ': ' + d.use);
      parts.forEach(function (p, i) {
        var j = 0.85 + ((i * 37) % 30) / 100;
        p.style.transform = 'scale(' + (d.r * j).toFixed(2) + ') rotate(' + ((i * 47) % 360) + 'deg)';
      });
    }
    range.addEventListener('input', upd);
    upd();
  }

  /* ---------- Diagnosis ---------- */
  var diag = $('[data-diag]');
  if (diag) {
    var dot = $('[data-dot]', diag);
    $$('.g-sym', diag).forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-sym');
        $$('.g-sym', diag).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        $$('.g-diag-out', diag).forEach(function (o) { o.hidden = o.getAttribute('data-out') !== k; });
        var o = $('[data-out="' + k + '"]', diag);
        dot.style.left = (parseFloat(o.getAttribute('data-x')) * 100) + '%';
        dot.style.top = (parseFloat(o.getAttribute('data-y')) * 100) + '%';
        diag.classList.add('has-pick');
        diag.classList.toggle('is-good', k === 'equilibrado');
      });
    });
  }

  /* ---------- Water drop fills when it comes into view ---------- */
  var drop = $('.g-water-big');
  if (drop) {
    if (hasIO && !reduce) {
      var dio = new IntersectionObserver(function (ents) {
        if (ents[0].isIntersecting) { drop.classList.add('is-on'); dio.disconnect(); }
      }, { threshold: 0.4 });
      dio.observe(drop);
    } else { drop.classList.add('is-on'); }
  }

  /* ---------- Water ---------- */
  var tds = $('[data-tds]');
  if (tds) {
    var inp = $('[data-tds-in]', tds), o2 = $('[data-tds-out]', tds);
    inp.addEventListener('input', function () {
      var v = parseFloat(inp.value);
      o2.className = 'g-tds-out';
      if (isNaN(v)) { o2.textContent = 'Escribe el número de la etiqueta.'; return; }
      if (v < 75) { o2.textContent = 'Muy blanda: el café puede saber plano o ácido.'; o2.classList.add('is-low'); }
      else if (v <= 250) { o2.textContent = (v >= 100 && v <= 200) ? 'Muy buena para café.' : 'Válida para café.'; o2.classList.add('is-ok'); }
      else { o2.textContent = 'Dura: apaga los sabores y deja cal en la cafetera.'; o2.classList.add('is-high'); }
    });
  }

  /* ---------- Bag label ---------- */
  var label = $('[data-label]');
  if (label) {
    $$('.g-spot', label).forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-spot');
        $$('.g-spot', label).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        $$('[data-spot-info]', label).forEach(function (li) { li.classList.toggle('is-on', li.getAttribute('data-spot-info') === k); });
      });
    });
  }

  /* ---------- Storage questions ---------- */
  $$('.g-myth').forEach(function (b) {
    b.addEventListener('click', function () {
      b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
    });
  });

  /* ---------- Floating chapter index ---------- */
  var toc = $('[data-toc]'), tocList = $('[data-toc-list]'), tocBtn = $('[data-toc-btn]');
  var tocNow = $('[data-toc-now]'), tocProg = $('[data-toc-prog]');
  var chapters = $$('[data-chapter]');
  function closeToc() { if (tocList) { tocList.hidden = true; tocBtn.setAttribute('aria-expanded', 'false'); } }
  if (toc && chapters.length) {
    toc.hidden = false;
    chapters.forEach(function (c) {
      if (!c.id) return;
      var li = document.createElement('li');
      li.innerHTML = '<a href="#' + c.id + '">' + c.getAttribute('data-chapter') + '</a>';
      tocList.appendChild(li);
    });
    tocBtn.addEventListener('click', function () {
      var open = tocList.hidden;
      tocList.hidden = !open;
      tocBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeToc(); });
    document.addEventListener('click', function (e) { if (!toc.contains(e.target)) closeToc(); });

    var first = chapters[0], footer = $('.site-footer'), ticking = false;
    function onScroll() {
      ticking = false;
      var vh = window.innerHeight;
      var start = first.getBoundingClientRect().top < vh * 0.6;
      var end = footer ? footer.getBoundingClientRect().top < vh * 0.9 : false;
      toc.classList.toggle('is-shown', start && !end);
      var cur = null;
      chapters.forEach(function (c) { if (c.getBoundingClientRect().top < vh * 0.4) cur = c; });
      if (cur) tocNow.textContent = cur.getAttribute('data-chapter');
      $$('a', tocList).forEach(function (a) { a.setAttribute('aria-current', cur && a.getAttribute('href') === '#' + cur.id ? 'true' : 'false'); });
      var max = document.documentElement.scrollHeight - vh;
      var p = max > 0 ? Math.min(1, window.pageYOffset / max) : 0;
      tocProg.style.strokeDashoffset = (94.25 * (1 - p)).toFixed(2);
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();
  }
})();

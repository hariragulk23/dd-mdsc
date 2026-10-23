/* =========================================================
   Madrid Specialty Coffee — interacción de los artículos del Journal
   Mejora progresiva: sin JavaScript todo el contenido se lee igual.
   ========================================================= */
(function () {
  'use strict';

  /* Elige el método según las tres respuestas (función pura). */
  function pickMethod(q1, q2, q3) {
    if (q3 === 'A' && (q1 === 'A' || q1 === 'C')) return 'espresso';
    if (q2 === 'A') return 'aeropress';
    if (q1 === 'B') return 'v60';
    if (q1 === 'A') return 'prensa';
    return 'aeropress';
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { pickMethod: pickMethod };
  }
  if (typeof document === 'undefined') return;

  var EN = (document.documentElement.getAttribute('lang') || 'es').slice(0, 2) === 'en';
  var LOC = EN ? 'en-GB' : 'es-ES';
  var T = EN
    ? { quizMsg: 'Answer the three questions to see your method.' }
    : { quizMsg: 'Responde las tres preguntas para ver tu método.' };

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* 1. Barra de progreso de lectura */
  var bar = document.querySelector('.read-progress');
  if (bar) {
    var blocks = document.querySelectorAll('.art-body, .art-wide');
    var ticking = false;
    var updateBar = function () {
      ticking = false;
      if (!blocks.length) return;
      var y = window.pageYOffset || document.documentElement.scrollTop;
      var start = blocks[0].getBoundingClientRect().top + y;
      var end = blocks[blocks.length - 1].getBoundingClientRect().bottom + y - window.innerHeight;
      var p = end > start ? (y - start) / (end - start) : 0;
      p = Math.max(0, Math.min(1, p));
      bar.style.setProperty('--p', p.toFixed(4));
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(updateBar); }
    }, { passive: true });
    window.addEventListener('resize', updateBar);
    updateBar();
  }

  /* 2. Aparición de bloques */
  var reveals = document.querySelectorAll('[data-reveal]');
  if (reveals.length) {
    if (!hasIO || reduced) {
      for (var r = 0; r < reveals.length; r++) reveals[r].classList.add('is-in');
    } else {
      var revealIO = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            entries[i].target.classList.add('is-in');
            revealIO.unobserve(entries[i].target);
          }
        }
      }, { threshold: 0.12 });
      for (var k = 0; k < reveals.length; k++) revealIO.observe(reveals[k]);
    }
  }

  /* 3. Quiz */
  var quiz = document.querySelector('[data-quiz]');
  if (quiz) {
    var msg = quiz.querySelector('.quiz-msg');
    var results = quiz.querySelectorAll('.quiz-result');
    var showBtn = quiz.querySelector('[data-quiz-show]');
    var resetBtn = quiz.querySelector('[data-quiz-reset]');
    var answer = function (name) {
      var el = quiz.querySelector('input[name="' + name + '"]:checked');
      return el ? el.value : null;
    };
    var hideResults = function () {
      for (var i = 0; i < results.length; i++) results[i].classList.remove('is-on');
    };
    if (showBtn) {
      showBtn.addEventListener('click', function () {
        var a1 = answer('q1'), a2 = answer('q2'), a3 = answer('q3');
        hideResults();
        if (!a1 || !a2 || !a3) {
          if (msg) msg.textContent = T.quizMsg;
          return;
        }
        if (msg) msg.textContent = '';
        var method = pickMethod(a1, a2, a3);
        var target = quiz.querySelector('.quiz-result[data-result="' + method + '"]');
        if (target) {
          target.classList.add('is-on');
          var h = target.querySelector('h3') || target;
          h.setAttribute('tabindex', '-1');
          h.focus();
        }
      });
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        var inputs = quiz.querySelectorAll('input[type="radio"]');
        for (var i = 0; i < inputs.length; i++) inputs[i].checked = false;
        hideResults();
        if (msg) msg.textContent = '';
        if (inputs.length) inputs[0].focus();
      });
    }
  }

  /* 4. Frescura del café */
  var fresh = document.querySelector('[data-fresh]');
  if (fresh) {
    var range = fresh.querySelector('input[type="range"]');
    var out = fresh.querySelector('[data-fresh-out]');
    var bands = fresh.querySelectorAll('.fresh-bands li');
    var updateFresh = function () {
      var v = Number(range.value);
      if (out) out.textContent = String(v);
      for (var i = 0; i < bands.length; i++) {
        var from = Number(bands[i].getAttribute('data-from'));
        var to = Number(bands[i].getAttribute('data-to'));
        if (v >= from && v <= to) bands[i].setAttribute('aria-current', 'true');
        else bands[i].removeAttribute('aria-current');
      }
    };
    if (range) {
      range.addEventListener('input', updateFresh);
      updateFresh();
    }
  }

  /* 5. Tarjetas que se giran */
  var flips = document.querySelectorAll('.flip');
  for (var f = 0; f < flips.length; f++) {
    flips[f].addEventListener('click', function () {
      var on = this.getAttribute('aria-pressed') === 'true';
      this.setAttribute('aria-pressed', on ? 'false' : 'true');
    });
  }

  /* 6. Contadores */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && hasIO && !reduced) {
    var animate = function (el) {
      var original = el.textContent;
      var end = parseFloat(el.getAttribute('data-count'));
      var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';
      var t0 = null;
      var tick = function (t) {
        if (t0 === null) t0 = t;
        var p = Math.min(1, (t - t0) / 1200);
        var v = end * (1 - Math.pow(1 - p, 3));
        el.textContent = prefix + v.toLocaleString(LOC, { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix;
        if (p < 1) window.requestAnimationFrame(tick);
        else el.textContent = original;
      };
      window.requestAnimationFrame(tick);
    };
    var countIO = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          animate(entries[i].target);
          countIO.unobserve(entries[i].target);
        }
      }
    }, { threshold: 0.4 });
    for (var c = 0; c < counters.length; c++) countIO.observe(counters[c]);
  }
})();

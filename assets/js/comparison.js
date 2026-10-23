/* comparison.js v2: photo slider with auto-peek, scroll reveal, row highlight */
(function () {
  'use strict';
  var root = document.querySelector('[data-cv]');
  if (!root) return;
  var EN = (document.documentElement.getAttribute('lang') || 'es').slice(0, 2) === 'en';
  var S = EN ? { sp: '% specialty, ', tor: '% torrefacto' } : { sp: '% especialidad, ', tor: '% torrefacto' };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  root.classList.add('is-ready');

  /* Photo slider */
  var slider = root.querySelector('[data-cv-slider]');
  if (slider) {
    var range = slider.querySelector('.cv-range');
    var touched = false;
    var setPos = function (v) {
      v = Math.max(0, Math.min(100, v));
      slider.style.setProperty('--pos', v + '%');
      range.value = String(Math.round(v));
      range.setAttribute('aria-valuetext', Math.round(v) + S.sp + Math.round(100 - v) + S.tor);
    };
    range.addEventListener('input', function () { touched = true; setPos(parseFloat(range.value)); });
    var peek = function () {
      var keys = [[0, 50], [700, 26], [1500, 74], [2200, 50]];
      var start = null;
      var frame = function (t) {
        if (touched) return;
        if (start === null) start = t;
        var el = t - start;
        if (el >= 2200) { setPos(50); return; }
        var i = 0;
        while (i < keys.length - 2 && el >= keys[i + 1][0]) i++;
        var p = (el - keys[i][0]) / (keys[i + 1][0] - keys[i][0]);
        var e = 0.5 - 0.5 * Math.cos(Math.PI * p);
        setPos(keys[i][1] + (keys[i + 1][1] - keys[i][1]) * e);
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    };
    setPos(50);
    if (!reduce && hasIO) {
      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { sio.disconnect(); if (!touched) peek(); }
        });
      }, { threshold: 0.6 });
      sio.observe(slider);
    }
  }

  /* Cards appear on scroll */
  var cards = [].slice.call(root.querySelectorAll('.cv-card'));
  if (hasIO && !reduce) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); cio.unobserve(e.target); }
      });
    }, { threshold: 0.2 });
    cards.forEach(function (c) { cio.observe(c); });
  } else {
    cards.forEach(function (c) { c.classList.add('is-in'); });
  }

  /* Highlight the same row in all three cards */
  var rows = [].slice.call(root.querySelectorAll('.cv-list > div[data-row]'));
  var hot = function (key) {
    rows.forEach(function (r) { r.classList.toggle('is-hot', key !== null && r.getAttribute('data-row') === key); });
  };
  rows.forEach(function (r) {
    var key = r.getAttribute('data-row');
    r.addEventListener('mouseenter', function () { hot(key); });
    r.addEventListener('mouseleave', function () { hot(null); });
    r.addEventListener('click', function () { hot(r.classList.contains('is-hot') ? null : key); });
  });
})();

/* home.js: scroll story, horizontal services gallery, mobile CTA */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* 1. Scroll story */
  var sx = document.querySelector('[data-sx]');
  if (sx && hasIO) {
    var card = sx.querySelector('[data-sx-card]');
    var steps = [].slice.call(sx.querySelectorAll('[data-step]'));
    var num = sx.querySelector('[data-sx-num]');
    var score = sx.querySelector('[data-sx-score]');
    var raf = null;
    var countUp = function () {
      if (!score) return;
      if (reduce) { score.textContent = '84'; return; }
      var start = null;
      if (raf) cancelAnimationFrame(raf);
      var tick = function (t) {
        if (!start) start = t;
        var p = Math.min(1, (t - start) / 1100);
        score.textContent = String(Math.round(84 * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    var current = null;
    var activate = function (n) {
      if (n === current) return;
      current = n;
      card.setAttribute('data-active', n);
      steps.forEach(function (s) { s.classList.toggle('is-active', s.getAttribute('data-step') === n); });
      if (num) num.textContent = '0' + n;
      if (n === '1') countUp();
    };
    sx.classList.add('is-ready');
    var mobile = window.matchMedia('(max-width: 899px)').matches;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) activate(e.target.getAttribute('data-step')); });
    }, { rootMargin: mobile ? '-62% 0px -22% 0px' : '-45% 0px -45% 0px' });
    steps.forEach(function (s) { io.observe(s); });
    activate('1');
  }

  /* 2. Horizontal services gallery */
  var hs = document.querySelector('[data-hs]');
  if (hs) {
    var track = hs.querySelector('[data-hs-track]');
    var viewport = hs.querySelector('[data-hs-viewport]');
    var bar = hs.querySelector('[data-hs-bar]');
    var cur = hs.querySelector('[data-hs-current]');
    var hint = hs.querySelector('[data-hs-hint]');
    var total = track.querySelectorAll('.hs-card:not(.hs-card--end)').length;
    var mq = window.matchMedia('(min-width: 900px) and (min-height: 620px)');
    var dist = 0;
    var ticking = false;
    var update = function () {
      ticking = false;
      var p;
      if (hs.classList.contains('is-pinned')) {
        var top = hs.getBoundingClientRect().top;
        p = dist ? Math.min(1, Math.max(0, -top / dist)) : 0;
        track.style.transform = 'translate3d(' + (-p * dist).toFixed(1) + 'px,0,0)';
      } else {
        var max = viewport.scrollWidth - viewport.clientWidth;
        p = max > 0 ? viewport.scrollLeft / max : 0;
      }
      if (bar) bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      var idx = Math.min(total, Math.floor(p * total) + 1);
      if (cur) cur.textContent = (idx < 10 ? '0' : '') + idx;
    };
    var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    var setup = function () {
      var pin = mq.matches && !reduce;
      hs.classList.toggle('is-pinned', pin);
      if (pin) {
        track.style.transform = '';
        var vs = window.getComputedStyle(viewport);
        dist = Math.max(0, track.scrollWidth + parseFloat(vs.paddingLeft) + parseFloat(vs.paddingRight) - viewport.clientWidth);
        hs.style.height = (dist + window.innerHeight) + 'px';
        if (hint) hint.textContent = 'Sigue bajando para recorrerlos ↓';
      } else {
        dist = 0;
        hs.style.height = '';
        track.style.transform = '';
        if (hint) hint.textContent = 'Desliza para ver más →';
      }
      update();
      if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') window.ScrollTrigger.refresh();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    viewport.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', setup);
    window.addEventListener('load', setup);
    setup();
  }

  /* 3. Mobile CTA bar */
  var mcta = document.querySelector('[data-mcta]');
  var heroEl = document.querySelector('.hero');
  var foot = document.querySelector('.site-footer');
  if (mcta && heroEl && foot && hasIO) {
    var heroVis = true, footVis = false;
    var sync = function () { mcta.classList.toggle('is-on', !heroVis && !footVis); };
    new IntersectionObserver(function (e) { heroVis = e[0].isIntersecting; sync(); }).observe(heroEl);
    new IntersectionObserver(function (e) { footVis = e[0].isIntersecting; sync(); }).observe(foot);
  }
})();

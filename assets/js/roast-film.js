/* Vídeo del tueste: carga solo cuando se ve, se pausa al salir, con botón de pausa.
   Con "reducir movimiento" o ahorro de datos no arranca solo. */
(function () {
  'use strict';
  var films = document.querySelectorAll('[data-roast-film]');
  if (!films.length) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var small = window.matchMedia ? window.matchMedia('(max-width: 700px)') : { matches: false };
  var CH = [[0, 'Carga y control'], [2, 'Curva de tueste'], [4, 'Toma de muestra'], [6, 'Descarga'], [8, 'Enfriado']];

  function chapter(t) { var c = CH[0][1]; for (var i = 0; i < CH.length; i++) if (t >= CH[i][0]) c = CH[i][1]; return c; }

  Array.prototype.forEach.call(films, function (f) {
    var v = f.querySelector('video'), btn = f.querySelector('[data-rf-toggle]');
    var chip = f.querySelector('[data-rf-chapter]'), bar = f.querySelector('[data-rf-bar]');
    if (!v || !btn) return;
    var loaded = false, userPaused = false, lastChapter = '';

    function load() {
      if (loaded) return;
      v.src = small.matches ? v.getAttribute('data-src-small') : v.getAttribute('data-src');
      loaded = true;
    }
    function label(playing) {
      btn.textContent = playing ? 'Pausar vídeo' : 'Reproducir vídeo';
      btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    }
    function play() {
      load();
      var p = v.play();
      if (p && p.catch) p.catch(function () { label(false); });
    }
    v.addEventListener('play', function () { label(true); });
    v.addEventListener('pause', function () { label(false); });
    v.addEventListener('timeupdate', function () {
      var t = v.currentTime || 0, d = v.duration || 10.5;
      if (bar) bar.style.width = Math.min(100, (t / d) * 100) + '%';
      if (chip) {
        var c = chapter(t);
        if (c !== lastChapter) {
          lastChapter = c; chip.textContent = c;
          chip.classList.add('is-swap'); void chip.offsetWidth; chip.classList.remove('is-swap');
        }
      }
    });
    btn.addEventListener('click', function () {
      if (v.paused) { userPaused = false; play(); } else { userPaused = true; v.pause(); }
    });
    label(false);

    if (reduce || saveData) { userPaused = true; return; }
    if (!('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { if (!userPaused) play(); }
        else if (loaded && !v.paused) v.pause();
      });
    }, { threshold: 0.4 }).observe(f);
  });
})();

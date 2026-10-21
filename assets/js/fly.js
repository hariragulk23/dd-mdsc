/* "Añadido al carrito": una miniatura vuela hasta el botón del carrito. Sin dependencias. */
(function () {
  'use strict';
  if (!window.Element || !Element.prototype.animate) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-add],[data-buy],[data-sticky-buy]') : null;
    if (!btn || btn.getAttribute('aria-disabled') === 'true') return;
    var fab = document.querySelector('.sp-fab');
    if (!fab) return;
    var to = fab.getBoundingClientRect();
    if (!to.width) return;

    var img = null;
    var card = btn.closest('.sp-card');
    if (card) img = card.querySelector('img');
    if (!img) { var pd = document.querySelector('[data-pd]'); if (pd) img = pd.querySelector('.pd-main img'); }

    var from = (img && img.getBoundingClientRect().width) ? img.getBoundingClientRect() : btn.getBoundingClientRect();
    if (from.bottom < 0 || from.top > window.innerHeight) from = btn.getBoundingClientRect();

    var size = 64;
    var sx = from.left + from.width / 2 - size / 2, sy = from.top + from.height / 2 - size / 2;
    var dx = (to.left + to.width / 2 - size / 2) - sx, dy = (to.top + to.height / 2 - size / 2) - sy;

    var el;
    if (img && img.currentSrc) { el = document.createElement('img'); el.src = img.currentSrc; el.alt = ''; }
    else { el = document.createElement('span'); el.style.background = '#A3132B'; }
    el.className = 'fly-bag';
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText += 'position:fixed;z-index:9999;pointer-events:none;width:' + size + 'px;height:' + size +
      'px;left:' + sx + 'px;top:' + sy + 'px;border-radius:12px;object-fit:cover;box-shadow:0 10px 30px rgba(35,25,21,.35);will-change:transform,opacity;';
    document.body.appendChild(el);

    var lift = Math.max(70, Math.min(160, Math.abs(dy) * 0.4));
    var a = el.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: 'translate(' + dx * 0.5 + 'px,' + (dy * 0.5 - lift) + 'px) scale(.8) rotate(-6deg)', opacity: 1, offset: 0.5 },
      { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.2) rotate(0deg)', opacity: 0.15 }
    ], { duration: 720, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });
    var done = function () { if (el.parentNode) el.parentNode.removeChild(el); };
    a.onfinish = done; a.oncancel = done;
  });
})();

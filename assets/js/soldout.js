/* Cafés agotados.
   Los precios existen en dos sitios: assets/js/products.js (lo que ve el cliente) y
   netlify/functions/lib/catalog.js (pago y feed de Google). Para marcar un café sin stock:
   "available": false en products.js y añade su id a UNAVAILABLE en netlify/functions/lib/catalog.js.
   Este archivo se carga DESPUÉS de products.js y ANTES de shop.js. */
(function () {
  'use strict';
  var EN = (document.documentElement.getAttribute('lang') || 'es').slice(0, 2) === 'en';
  var S = EN ? {
    out: 'Sold out',
    outAria: ': sold out',
    outTemp: 'Temporarily sold out',
    outTempAria: ': temporarily sold out',
    noteA: 'Temporarily sold out. <a href="https://wa.me/34665747463?text=',
    waQ1: 'Hello, when will ',
    waQ2: ' be back in stock?',
    noteB: '" target="_blank" rel="noopener">Ask us on WhatsApp</a>'
  } : {
    out: 'Agotado',
    outAria: ': agotado',
    outTemp: 'Agotado temporalmente',
    outTempAria: ': agotado temporalmente',
    noteA: 'Agotado temporalmente. <a href="https://wa.me/34665747463?text=',
    waQ1: 'Hola, ¿cuándo vuelve ',
    waQ2: '?',
    noteB: '" target="_blank" rel="noopener">Pregúntanos por WhatsApp</a>'
  };
  function dn(p) { return EN && p.name_en ? p.name_en : p.name; }
  var P = window.MSC_PRODUCTS || [];
  var out = {};
  P.forEach(function (p) { if (p && p.available === false) out[p.id] = p; });
  if (!Object.keys(out).length) return;
  var KEY = 'msc_cart_v1';

  // 1. Quitar del carrito guardado los cafés agotados
  try {
    var a = JSON.parse(window.localStorage.getItem(KEY) || '[]');
    if (Array.isArray(a)) {
      var b = a.filter(function (l) { return !(l && out[l.id]); });
      if (b.length !== a.length) window.localStorage.setItem(KEY, JSON.stringify(b));
    }
  } catch (e) { /* almacenamiento no disponible */ }

  function pageId() { var pd = document.querySelector('[data-pd]'); return pd ? pd.getAttribute('data-pd') : null; }

  // 2. Bloquear "Añadir" (fase de captura: llega antes que shop.js)
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-add],[data-buy],[data-sticky-buy]') : null;
    if (!t) return;
    var id = t.getAttribute('data-add') || pageId();
    if (id && out[id]) { e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation(); }
  }, true);

  // 3. Marcar la interfaz
  function setBtn(el, soldout, text, label) {
    if (soldout) {
      el.classList.add('is-soldout'); el.setAttribute('aria-disabled', 'true');
      if (text && el.textContent !== text) el.textContent = text;
      if (label) {
        if (el.hasAttribute('aria-label') && !el.hasAttribute('data-label-orig')) el.setAttribute('data-label-orig', el.getAttribute('aria-label'));
        if (el.getAttribute('aria-label') !== label) el.setAttribute('aria-label', label);
      }
    } else if (el.classList.contains('is-soldout')) {
      el.classList.remove('is-soldout'); el.removeAttribute('aria-disabled');
      if (el.hasAttribute('data-label-orig')) { el.setAttribute('aria-label', el.getAttribute('data-label-orig')); el.removeAttribute('data-label-orig'); }
      else el.removeAttribute('aria-label');
    }
  }
  function mark() {
    document.querySelectorAll('[data-add]').forEach(function (btn) {
      var bid = btn.getAttribute('data-add');
      setBtn(btn, !!out[bid], S.out, out[bid] ? dn(out[bid]) + S.outAria : null);
    });
    document.querySelectorAll('.sp-card').forEach(function (card) {
      var btn = card.querySelector('[data-add]');
      var id = btn && btn.getAttribute('data-add');
      if (!id || !out[id] || card.classList.contains('is-soldout')) return;
      card.classList.add('is-soldout');
      var badges = card.querySelector('.sp-badges');
      if (badges && !badges.querySelector('.sp-badge--out')) {
        var s = document.createElement('span'); s.className = 'sp-badge sp-badge--out'; s.textContent = S.out;
        badges.insertBefore(s, badges.firstChild);
      }
    });
    var pid = pageId();
    if (pid && out[pid]) {
      var buy = document.querySelector('[data-buy]'); if (buy) setBtn(buy, true, S.outTemp, dn(out[pid]) + S.outTempAria);
      var st = document.querySelector('[data-sticky-buy]'); if (st) setBtn(st, true, S.out, dn(out[pid]) + S.outAria);
      var price = document.querySelector('.pd-price');
      if (price && !document.querySelector('.pd-soldout')) {
        var n = document.createElement('p'); n.className = 'pd-soldout'; n.setAttribute('role', 'status');
        n.innerHTML = S.noteA +
          encodeURIComponent(S.waQ1 + dn(out[pid]) + S.waQ2) + S.noteB;
        price.parentNode.insertBefore(n, price.nextSibling);
      }
    }
  }
  function start() {
    mark();
    var busy = false;
    new MutationObserver(function () {
      if (busy) return; busy = true; mark(); busy = false;
    }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-add'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();

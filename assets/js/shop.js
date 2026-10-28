/* shop.js: carrito, tienda y fichas de producto */
(function () {
  'use strict';
  var EN = (document.documentElement.getAttribute('lang') || 'es').slice(0, 2) === 'en';
  var S = EN ? {
    fab: 'Cart <b data-cart-count>0</b>',
    head: '<div class="sp-dh"><h2 id="sp-cart-title">Your cart</h2><button type="button" class="sp-x" aria-label="Close cart">×</button></div>',
    total1: '<div class="sp-df"><div class="sp-total"><span>Total</span><b data-total>€0.00</b></div>',
    postal: '<label class="sp-postal"><span>Delivery postcode</span><input type="text" inputmode="numeric" maxlength="5" autocomplete="postal-code" data-postal placeholder="28001"></label>',
    terms: '<label class="sp-terms"><input type="checkbox" data-terms> <span>I have read and accept the <a href="/en/terms-of-sale" target="_blank" rel="noopener">terms of sale</a></span></label>',
    payBtn: '<button type="button" class="sp-btn" data-pay disabled>Pay by card</button>',
    waBtn: '<a class="sp-btn sp-btn--ghost" data-wa href="#" target="_blank" rel="noopener">Order on WhatsApp</a>',
    small: '<small>Prices include VAT. Secure payment with Stripe. We only ship to mainland Spain for now.</small>',
    toastBtn: '</span><button type="button">View cart</button>',
    added: ' added',
    waHello: 'Hello, I would like to place this order at Madrid Specialty Coffee:\n',
    waTail: '\n\nName:\nDelivery address:',
    open: 'Open cart, ',
    item1: ' item',
    itemN: ' items',
    empty: '<li class="sp-cart-empty">Your cart is empty.<br>Start with the <a href="/en/shop">shop</a>.</li>',
    grind: 'Grind',
    dec: 'Remove one',
    inc: 'Add one',
    shipFrom: 'Free shipping from ',
    shipLeftA: 'You are <b>',
    shipLeftB: '</b> away from free shipping',
    shipFree: '<b>You have free shipping</b>',
    pEmpty: 'Enter your postcode to calculate shipping.',
    pBad: 'Check the postcode (5 digits).',
    pIsland: 'For now we only ship to mainland Spain. Message us on WhatsApp to ask about your delivery.',
    payTxt: 'Pay by card',
    paying: 'Opening payment…',
    payFail: 'We could not open the payment page. Order your coffee on WhatsApp.',
    offline: 'No connection. Try again or order on WhatsApp.',
    count1: '1 coffee',
    countN: ' coffees',
    yourCoffee: 'Your coffee',
    alsoLike: 'You might also like: ',
    viewCoffee: 'View the coffee',
    addDot: 'Add · ',
    cup1: ' cup a day',
    cupN: ' cups a day',
    dsep: '.',
    ofCoffee: ' of coffee a month',
    add: 'Add ',
    bag1: ' bag',
    bagN: ' bags',
    notNote: 'Not a note of this coffee',
    guideUrl: '/en/guides?metodo='
  } : {
    fab: 'Carrito <b data-cart-count>0</b>',
    head: '<div class="sp-dh"><h2 id="sp-cart-title">Tu carrito</h2><button type="button" class="sp-x" aria-label="Cerrar carrito">×</button></div>',
    total1: '<div class="sp-df"><div class="sp-total"><span>Total</span><b data-total>0,00 €</b></div>',
    postal: '<label class="sp-postal"><span>Código postal de envío</span><input type="text" inputmode="numeric" maxlength="5" autocomplete="postal-code" data-postal placeholder="28001"></label>',
    terms: '<label class="sp-terms"><input type="checkbox" data-terms> <span>He leído y acepto las <a href="condiciones-compra.html" target="_blank" rel="noopener">condiciones de compra</a></span></label>',
    payBtn: '<button type="button" class="sp-btn" data-pay disabled>Pagar con tarjeta</button>',
    waBtn: '<a class="sp-btn sp-btn--ghost" data-wa href="#" target="_blank" rel="noopener">Pedir por WhatsApp</a>',
    small: '<small>Precios con IVA incluido. Pago seguro con Stripe. Envíos solo a la España peninsular por ahora.</small>',
    toastBtn: '</span><button type="button">Ver carrito</button>',
    added: ' añadido',
    waHello: 'Hola, quiero hacer este pedido en Madrid Specialty Coffee:\n',
    waTail: '\n\nNombre:\nDirección de envío:',
    open: 'Abrir carrito, ',
    item1: ' producto',
    itemN: ' productos',
    empty: '<li class="sp-cart-empty">Tu carrito está vacío.<br>Empieza por la <a href="tienda.html">tienda</a>.</li>',
    grind: 'Molienda',
    dec: 'Quitar una',
    inc: 'Añadir una',
    shipFrom: 'Envío gratis a partir de ',
    shipLeftA: 'Te faltan <b>',
    shipLeftB: '</b> para el envío gratis',
    shipFree: '<b>Tienes envío gratis</b>',
    pEmpty: 'Introduce tu código postal para calcular el envío.',
    pBad: 'Revisa el código postal (5 cifras).',
    pIsland: 'De momento enviamos solo a la España peninsular. Escríbenos por WhatsApp para consultar tu envío.',
    payTxt: 'Pagar con tarjeta',
    paying: 'Abriendo pago…',
    payFail: 'No se pudo abrir el pago. Pide tu café por WhatsApp.',
    offline: 'Sin conexión. Inténtalo de nuevo o pide por WhatsApp.',
    count1: '1 café',
    countN: ' cafés',
    yourCoffee: 'Tu café',
    alsoLike: 'También te puede gustar: ',
    viewCoffee: 'Ver el café',
    addDot: 'Añadir · ',
    cup1: ' taza al día',
    cupN: ' tazas al día',
    dsep: ',',
    ofCoffee: ' de café al mes',
    add: 'Añadir ',
    bag1: ' bolsa',
    bagN: ' bolsas',
    notNote: 'No es una nota de este café',
    guideUrl: 'guias.html?metodo='
  };
  var P = window.MSC_PRODUCTS || [];
  var CFG = window.MSC_SHOP || { wa: '', freeShip: 35 };
  var byId = {};
  P.forEach(function (p) { byId[p.id] = p; });
  var GRINDS = { grano: 'En grano', espresso: 'Molido para espresso', moka: 'Molido para moka', filtro: 'Molido para filtro', prensa: 'Molido para prensa' };
  if (EN) GRINDS = { grano: 'Whole bean', espresso: 'Ground for espresso', moka: 'Ground for moka pot', filtro: 'Ground for filter', prensa: 'Ground for French press' };
  function pname(p) { return EN && p.name_en ? p.name_en : p.name; }
  function pdesc(p) { return EN && p.desc_en ? p.desc_en : p.desc; }
  function purl(p) { return EN && p.url_en ? p.url_en : p.url; }
  var KEY = 'msc_cart_v1';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  document.documentElement.classList.add('js-shop');

  function eur(n) { return n.toFixed(2).replace('.', ',') + ' €'; }
  if (EN) eur = function (n) { return n.toLocaleString('en-GB', { style: 'currency', currency: 'EUR' }); };
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- Cart state ---------- */
  function load() {
    try {
      var a = JSON.parse(window.localStorage.getItem(KEY) || '[]');
      return Array.isArray(a) ? a.filter(function (l) { return byId[l.id] && GRINDS[l.grind] && l.qty > 0; }).map(function (l) { return { id: l.id, grind: l.grind, qty: Math.min(20, Math.floor(l.qty)) }; }) : [];
    } catch (e) { return []; }
  }
  var held = [];
  if (EN) {
    var load0 = load;
    load = function () { var all = load0(); held = all.filter(function (l) { return byId[l.id].eco; }); return all.filter(function (l) { return !byId[l.id].eco; }); };
    save = function () { try { window.localStorage.setItem(KEY, JSON.stringify(cart.concat(held))); } catch (e) {} };
  }
  var cart = load();
  function save() { try { window.localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} }
  function count() { return cart.reduce(function (s, l) { return s + l.qty; }, 0); }
  function total() { return cart.reduce(function (s, l) { return s + l.qty * byId[l.id].price; }, 0); }
  function findLine(id, grind) { for (var i = 0; i < cart.length; i++) { if (cart[i].id === id && cart[i].grind === grind) return i; } return -1; }
  function add(id, grind, qty) {
    if (!byId[id]) return;
    if (EN && byId[id].eco) return;
    grind = GRINDS[grind] ? grind : 'grano';
    qty = Math.max(1, Math.min(20, qty || 1));
    var i = findLine(id, grind);
    if (i > -1) cart[i].qty = Math.min(20, cart[i].qty + qty); else cart.push({ id: id, grind: grind, qty: qty });
    save(); render(); bump(); toast(qty + ' × ' + pname(byId[id]) + S.added);
  }
  function setQty(i, q) { if (q <= 0) cart.splice(i, 1); else cart[i].qty = Math.min(20, q); save(); render(); }
  function setGrind(i, g) {
    var l = cart[i]; var j = findLine(l.id, g);
    if (j > -1 && j !== i) { cart[j].qty = Math.min(20, cart[j].qty + l.qty); cart.splice(i, 1); } else { l.grind = g; }
    save(); render();
  }

  /* ---------- Cart UI ---------- */
  var fab = document.createElement('button');
  fab.type = 'button'; fab.className = 'sp-fab'; fab.setAttribute('aria-haspopup', 'dialog');
  fab.innerHTML = S.fab;
  var scrim = document.createElement('div'); scrim.className = 'sp-scrim';
  var drawer = document.createElement('aside');
  drawer.className = 'sp-drawer'; drawer.setAttribute('role', 'dialog'); drawer.setAttribute('aria-modal', 'true'); drawer.setAttribute('aria-labelledby', 'sp-cart-title');
  drawer.innerHTML = S.head +
    '<div class="sp-ship" data-ship></div><ul class="sp-lines" data-lines></ul>' +
    S.total1 +
    S.postal +
    '<p class="sp-postal-msg" data-postal-msg role="status"></p>' +
    S.terms +
    S.payBtn +
    S.waBtn +
    S.small + '</div>';
  var toastEl = document.createElement('div'); toastEl.className = 'sp-toast'; toastEl.setAttribute('role', 'status');
  document.body.appendChild(fab); document.body.appendChild(scrim); document.body.appendChild(drawer); document.body.appendChild(toastEl);
  var lastFocus = null;
  function openCart() { lastFocus = document.activeElement; document.documentElement.classList.add('is-cart-open'); fab.setAttribute('aria-expanded', 'true'); setTimeout(function () { $('.sp-x', drawer).focus(); }, 50); }
  function closeCart() { document.documentElement.classList.remove('is-cart-open'); fab.setAttribute('aria-expanded', 'false'); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  fab.addEventListener('click', openCart);
  scrim.addEventListener('click', closeCart);
  $('.sp-x', drawer).addEventListener('click', closeCart);
  document.addEventListener('keydown', function (e) {
    if (!document.documentElement.classList.contains('is-cart-open')) return;
    if (e.key === 'Escape') closeCart();
    if (e.key === 'Tab') {
      var f = $$('button:not([disabled]), a[href], select', drawer); if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  var toastTimer = null;
  function toast(msg) {
    toastEl.innerHTML = '<span>' + esc(msg) + S.toastBtn;
    $('button', toastEl).addEventListener('click', function () { toastEl.classList.remove('is-on'); openCart(); });
    toastEl.classList.add('is-on'); clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 3200);
  }
  function bump() { if (reduce) return; fab.classList.remove('is-bump'); void fab.offsetWidth; fab.classList.add('is-bump'); }
  function waText() {
    var t = S.waHello;
    cart.forEach(function (l) { var p = byId[l.id]; t += '- ' + l.qty + ' × ' + pname(p) + ' 250 g (' + GRINDS[l.grind] + '): ' + eur(l.qty * p.price) + '\n'; });
    t += 'Total: ' + eur(total()) + S.waTail;
    return t;
  }
  function render() {
    var n = count(), tot = total();
    $$('[data-cart-count]').forEach(function (e) { e.textContent = String(n); });
    fab.setAttribute('aria-label', S.open + n + (n === 1 ? S.item1 : S.itemN));
    var lines = $('[data-lines]', drawer);
    if (!cart.length) {
      lines.innerHTML = S.empty;
    } else {
      lines.innerHTML = cart.map(function (l, i) {
        var p = byId[l.id];
        var opts = Object.keys(GRINDS).map(function (g) { return '<option value="' + g + '"' + (g === l.grind ? ' selected' : '') + '>' + GRINDS[g] + '</option>'; }).join('');
        return '<li class="sp-line"><img src="' + esc(p.img) + '" alt="" width="64" height="64">' +
          '<div><h3>' + esc(pname(p)) + '</h3><label class="sr" for="g' + i + '">' + S.grind + '</label><select id="g' + i + '" data-grind-i="' + i + '">' + opts + '</select></div>' +
          '<div class="sp-line-r"><b>' + eur(l.qty * p.price) + '</b><span class="sp-mini"><button type="button" data-dec="' + i + '" aria-label="' + S.dec + '">−</button><span>' + l.qty + '</span><button type="button" data-inc="' + i + '" aria-label="' + S.inc + '">+</button></span></div></li>';
      }).join('');
    }
    $('[data-total]', drawer).textContent = eur(tot);
    var ship = $('[data-ship]', drawer); var left = CFG.freeShip - tot;
    ship.innerHTML = (tot <= 0 ? S.shipFrom + eur(CFG.freeShip) : left > 0 ? S.shipLeftA + eur(left) + S.shipLeftB : S.shipFree) +
      '<div class="sp-ship-bar"><i style="--p:' + Math.min(100, Math.round(tot / CFG.freeShip * 100)) + '%"></i></div>';
    refreshPay();
    var wa = $('[data-wa]', drawer);
    if (cart.length && CFG.wa) { wa.removeAttribute('aria-disabled'); wa.href = 'https://wa.me/' + CFG.wa + '?text=' + encodeURIComponent(waText()); }
    else { wa.setAttribute('aria-disabled', 'true'); wa.href = '#'; }
  }
  var postalIn = $('[data-postal]', drawer), termsIn = $('[data-terms]', drawer), payBtn = $('[data-pay]', drawer), postalMsg = $('[data-postal-msg]', drawer);
  var NON_MAINLAND = /^(07|35|38|51|52)/;
  var postalState = function () {
    var v = (postalIn.value || '').trim();
    if (!v) return 'empty';
    if (!/^\d{5}$/.test(v)) return 'bad';
    if (NON_MAINLAND.test(v)) return 'island';
    return 'ok';
  };
  function refreshPay() {
    var st = postalState();
    var msg = st === 'empty' ? S.pEmpty
      : st === 'bad' ? S.pBad
      : st === 'island' ? S.pIsland
      : '';
    postalMsg.textContent = msg;
    var ready = cart.length > 0 && st === 'ok' && termsIn.checked && !!CFG.stripe;
    payBtn.disabled = !ready;
    if (!CFG.stripe) payBtn.textContent = S.payTxt;
    else payBtn.textContent = S.payTxt;
  }
  postalIn.addEventListener('input', refreshPay);
  termsIn.addEventListener('change', refreshPay);
  payBtn.addEventListener('click', function () {
    if (payBtn.disabled) return;
    payBtn.disabled = true; payBtn.textContent = S.paying;
    fetch('/.netlify/functions/create-checkout', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(EN ? { postal: postalIn.value.trim(), items: cart.map(function (l) { return { id: l.id, grind: l.grind, qty: l.qty }; }), lang: 'en' } : { postal: postalIn.value.trim(), items: cart.map(function (l) { return { id: l.id, grind: l.grind, qty: l.qty }; }) })
    }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (x) {
        if (x.ok && x.d.url) { window.location.href = x.d.url; return; }
        toast(x.d.error || S.payFail);
        refreshPay();
      })
      .catch(function () { toast(S.offline); refreshPay(); });
  });

  drawer.addEventListener('click', function (e) {
    var t = e.target;
    if (t.hasAttribute('data-inc')) { var i = +t.getAttribute('data-inc'); setQty(i, cart[i].qty + 1); }
    if (t.hasAttribute('data-dec')) { var j = +t.getAttribute('data-dec'); setQty(j, cart[j].qty - 1); }
    if (t.hasAttribute('data-wa') && t.getAttribute('aria-disabled') === 'true') e.preventDefault();
  });
  drawer.addEventListener('change', function (e) { if (e.target.hasAttribute('data-grind-i')) setGrind(+e.target.getAttribute('data-grind-i'), e.target.value); });
  window.addEventListener('storage', function (e) { if (e.key === KEY) { cart = load(); render(); } });
  render();

  /* Quick add buttons (cards, quiz, related) */
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-add]') : null;
    if (!b) return;
    e.preventDefault();
    add(b.getAttribute('data-add'), b.getAttribute('data-grind') || 'grano', +(b.getAttribute('data-qty') || 1));
  });

  /* ---------- Reveal on scroll ---------- */
  var rev = $$('.sp-reveal, .pd-bars');
  if (hasIO && !reduce) {
    var rio = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); rio.unobserve(x.target); } }); }, { threshold: 0.15 });
    rev.forEach(function (el) { rio.observe(el); });
  } else rev.forEach(function (el) { el.classList.add('is-in'); });

  /* English: the organic coffee is not offered (cards, filter chip, calculator option, map dot) */
  if (EN) P.filter(function (p) { return p.eco; }).forEach(function (p) {
    $$('.sp-card[data-eco="1"], [data-f-tog="eco"], option[value="' + p.id + '"], .sp-dot[href="' + p.url + '"]').forEach(function (e) { e.parentNode.removeChild(e); });
  });

  /* ---------- Tienda: filters + sort ---------- */
  var grid = $('[data-grid]');
  if (grid) {
    var cards = $$('.sp-card', grid);
    var state = { fam: 'all', met: 'all', eco: false, decaf: false, sort: 'rec' };
    var countEl = $('[data-count]'), emptyEl = $('[data-empty]');
    var apply = function () {
      var n = 0;
      cards.forEach(function (c) {
        var ok = (state.fam === 'all' || (' ' + c.dataset.fam + ' ').indexOf(' ' + state.fam + ' ') > -1) &&
          (state.met === 'all' || (' ' + c.dataset.met + ' ').indexOf(' ' + state.met + ' ') > -1) &&
          (!state.eco || c.dataset.eco === '1') && (!state.decaf || c.dataset.decaf === '1');
        c.hidden = !ok; if (ok) n++;
      });
      var sorted = cards.slice().sort(function (a, b) {
        if (state.sort === 'asc') return a.dataset.price - b.dataset.price;
        if (state.sort === 'desc') return b.dataset.price - a.dataset.price;
        if (state.sort === 'sca') return (b.dataset.sca || 0) - (a.dataset.sca || 0);
        return a.dataset.order - b.dataset.order;
      });
      sorted.forEach(function (c) { grid.appendChild(c); });
      if (countEl) countEl.textContent = n === 1 ? S.count1 : n + S.countN;
      if (emptyEl) emptyEl.hidden = n !== 0;
    };
    $$('[data-f-fam]').forEach(function (b) { b.addEventListener('click', function () { state.fam = b.dataset.fFam; $$('[data-f-fam]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); apply(); }); });
    $$('[data-f-met]').forEach(function (b) { b.addEventListener('click', function () { state.met = b.dataset.fMet; $$('[data-f-met]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); apply(); }); });
    $$('[data-f-tog]').forEach(function (b) { b.addEventListener('click', function () { var k = b.dataset.fTog; state[k] = !state[k]; b.setAttribute('aria-pressed', String(state[k])); apply(); }); });
    var sortSel = $('[data-sort]'); if (sortSel) sortSel.addEventListener('change', function () { state.sort = sortSel.value; apply(); });
    var reset = $('[data-reset]'); if (reset) reset.addEventListener('click', function () {
      state = { fam: 'all', met: 'all', eco: false, decaf: false, sort: state.sort };
      $$('[data-f-fam]').forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.fFam === 'all')); });
      $$('[data-f-met]').forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.fMet === 'all')); });
      $$('[data-f-tog]').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      apply();
    });
    apply();
  }

  /* ---------- Tienda: quiz ---------- */
  var quiz = $('[data-quiz-shop]');
  if (quiz) {
    var ans = {};
    var res = $('[data-quiz-out]', quiz);
    var score = function () {
      if (ans.caf === 'no') return ['descafeinado'];
      var s = {};
      P.forEach(function (p) {
        if (p.decaf) return;
        if (EN && p.eco) return;
        var v = 0;
        if (ans.met && p.ideal.indexOf(ans.met) > -1) v += 3;
        if (ans.fam && p.families.indexOf(ans.fam) > -1) v += 3;
        if (ans.fam === 'frutal' && p.profile.acidez >= 4) v += 1;
        if (ans.fam === 'intenso' && p.profile.intensidad >= 4) v += 4;
        if (ans.milk === 'si') v += p.profile.cuerpo >= 4 ? 2 : p.profile.cuerpo >= 3 ? 1 : 0;
        if (ans.milk === 'no') v += p.profile.acidez >= 3 ? 1 : 0;
        s[p.id] = v;
      });
      return Object.keys(s).sort(function (a, b) { return s[b] - s[a] || byId[a].order - byId[b].order; });
    };
    $$('[data-q]', quiz).forEach(function (grp) {
      $$('[data-v]', grp).forEach(function (b) {
        b.addEventListener('click', function () {
          ans[grp.dataset.q] = b.dataset.v;
          $$('[data-v]', grp).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
          if (ans.met && ans.fam && ans.milk && ans.caf) {
            var top = score(), p = byId[top[0]], alt = top[1] ? byId[top[1]] : null;
            res.innerHTML = '<img src="' + esc(p.img) + '" alt="" width="110" height="110"><div><p>' + S.yourCoffee + '</p><h3>' + esc(pname(p)) + '</h3><p>' + esc(pdesc(p)) + '</p>' +
              (alt ? '<p style="margin-top:8px">' + S.alsoLike + '<a href="' + esc(purl(alt)) + '" style="color:var(--cielo)">' + esc(pname(alt)) + '</a></p>' : '') +
              '<div class="sp-row"><a class="sp-btn sp-btn--ghost" href="' + esc(purl(p)) + '">' + S.viewCoffee + '</a><button type="button" class="sp-btn" data-add="' + p.id + '">' + S.addDot + eur(p.price) + '</button></div></div>';
            res.classList.add('is-on');
          }
        });
      });
    });
  }

  /* ---------- Tienda: monthly calculator ---------- */
  var mon = $('[data-month]');
  if (mon) {
    var cups = $('[data-m-cups]', mon), met = $('[data-m-met]', mon), cof = $('[data-m-coffee]', mon);
    var cupsOut = $('[data-m-cups-out]', mon), gOut = $('[data-m-g]', mon), bOut = $('[data-m-bags]', mon), addB = $('[data-m-add]', mon);
    var upd = function () {
      var c = +cups.value, dose = +met.value, g = c * dose * 30, bags = Math.max(1, Math.ceil(g / 250)), p = byId[cof.value];
      cupsOut.textContent = c + (c === 1 ? S.cup1 : S.cupN);
      gOut.textContent = (g >= 1000 ? (g / 1000).toFixed(1).replace('.', S.dsep) + ' kg' : g + ' g') + S.ofCoffee;
      bOut.textContent = String(bags);
      addB.setAttribute('data-add', p.id); addB.setAttribute('data-qty', String(bags));
      addB.textContent = S.add + bags + (bags === 1 ? S.bag1 : S.bagN) + ' · ' + eur(bags * p.price);
    };
    [cups, met, cof].forEach(function (el) { el.addEventListener('input', upd); el.addEventListener('change', upd); });
    upd();
  }

  /* ---------- Ficha: gallery, buy box, sticky ---------- */
  var pd = $('[data-pd]');
  if (pd) {
    var pid = pd.dataset.pd;
    var mainImg = $('.pd-main img', pd);
    $$('.pd-thumb', pd).forEach(function (t) {
      t.addEventListener('click', function () {
        $$('.pd-thumb', pd).forEach(function (x) { x.setAttribute('aria-pressed', String(x === t)); });
        mainImg.style.opacity = '0';
        setTimeout(function () { mainImg.src = t.dataset.src; mainImg.alt = t.dataset.alt; mainImg.style.opacity = '1'; }, reduce ? 0 : 180);
      });
    });
    var grind = 'grano', qty = 1, qOut = $('[data-qty-out]', pd);
    $$('[data-grind]', $('.pd-grinds', pd)).forEach(function (b) {
      b.addEventListener('click', function () { grind = b.dataset.grind; $$('[data-grind]', $('.pd-grinds', pd)).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); });
    });
    var setQ = function (v) { qty = Math.max(1, Math.min(20, v)); qOut.textContent = String(qty); };
    $('[data-qty-dec]', pd).addEventListener('click', function () { setQ(qty - 1); });
    $('[data-qty-inc]', pd).addEventListener('click', function () { setQ(qty + 1); });
    var buy = $('[data-buy]', pd);
    buy.addEventListener('click', function () { add(pid, grind, qty); });
    var sticky = $('[data-sticky]');
    if (sticky) {
      $('[data-sticky-buy]', sticky).addEventListener('click', function () { add(pid, grind, qty); });
      var mqS = window.matchMedia('(max-width: 959px)');
      var footEl = document.querySelector('.site-footer');
      var tickS = false;
      var checkS = function () {
        tickS = false;
        var past = buy.getBoundingClientRect().bottom < 0;
        var atFoot = footEl ? footEl.getBoundingClientRect().top < window.innerHeight : false;
        var on = past && !atFoot && mqS.matches;
        sticky.classList.toggle('is-on', on);
        document.documentElement.classList.toggle('has-sticky', on);
      };
      window.addEventListener('scroll', function () { if (!tickS) { tickS = true; requestAnimationFrame(checkS); } }, { passive: true });
      window.addEventListener('resize', checkS);
      checkS();
    }
  }

  /* ---------- Ficha: flavour wheel ---------- */
  var wheel = $('[data-wheel]');
  if (wheel) {
    var cT = $('[data-wheel-title]', wheel), cS = $('[data-wheel-sub]', wheel);
    var defT = cT.textContent, defS = cS.textContent;
    var segs = $$('.pd-seg', wheel);
    var show = function (s) {
      segs.forEach(function (x) { x.classList.toggle('is-hot', x === s); });
      if (!s) { cT.textContent = defT; cS.textContent = defS; return; }
      cT.textContent = s.dataset.label;
      cS.textContent = s.dataset.notes || S.notNote;
    };
    segs.forEach(function (s) {
      s.addEventListener('mouseenter', function () { show(s); });
      s.addEventListener('focus', function () { show(s); });
      s.addEventListener('click', function () { show(s); });
      s.addEventListener('mouseleave', function () { show(null); });
      s.addEventListener('blur', function () { show(null); });
    });
  }

  /* ---------- Ficha: brew tabs + calculator ---------- */
  var brew = $('[data-brew-pd]');
  if (brew) {
    var tabs = $$('[data-tab]', brew), panels = $$('[data-panel]', brew);
    var selectTab = function (k) {
      tabs.forEach(function (t) { t.setAttribute('aria-selected', String(t.dataset.tab === k)); t.tabIndex = t.dataset.tab === k ? 0 : -1; });
      panels.forEach(function (p) { p.hidden = p.dataset.panel !== k; });
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { selectTab(t.dataset.tab); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
        if (n !== null) { e.preventDefault(); selectTab(tabs[n].dataset.tab); tabs[n].focus(); }
      });
    });
    panels.forEach(function (p) {
      var c = $('[data-cups]', p); if (!c) return;
      var dose = +p.dataset.dose, water = +p.dataset.water, max = +p.dataset.max, n = 1;
      var out = $('output', c), dOut = $('[data-dose-out]', p), wOut = $('[data-water-out]', p), link = $('[data-calc-link]', p);
      var upd2 = function () {
        out.textContent = String(n);
        dOut.textContent = (dose * n) + ' g';
        wOut.textContent = (water * n) + (p.dataset.panel === 'espresso' ? ' g' : ' ml');
        if (link) link.href = S.guideUrl + p.dataset.guia + '&dosis=' + Math.min(60, dose * n);
      };
      $('[data-cdec]', c).addEventListener('click', function () { n = Math.max(1, n - 1); upd2(); });
      $('[data-cinc]', c).addEventListener('click', function () { n = Math.min(max, n + 1); upd2(); });
      upd2();
    });
    selectTab(tabs[0].dataset.tab);
  }
})();

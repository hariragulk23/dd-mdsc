/* Resumen del pedido en la página de confirmación.
   Lee ?session_id=... (lo añade Stripe), pide el resumen a la función y vacía el carrito. */
(function () {
  'use strict';
  var EN = (document.documentElement.getAttribute('lang') || 'es').slice(0, 2) === 'en';
  var S = EN ? {
    free: 'Free',
    mail1: 'We have sent your receipt to ',
    mail2: '. If you cannot see it, check your spam folder.'
  } : {
    free: 'Gratis',
    mail1: 'Te hemos enviado el recibo a ',
    mail2: '. Si no lo ves, revisa la carpeta de spam.'
  };
  /* English: the function sends Spanish grind and product names; show the English ones */
  var GR = { 'En grano': 'Whole bean', 'Molido para espresso': 'Ground for espresso', 'Molido para moka': 'Ground for moka pot', 'Molido para filtro': 'Ground for filter', 'Molido para prensa': 'Ground for French press' };
  var PN = { 'Descafeinado Colombia': 'Decaf Colombia' };
  var box = document.getElementById('order-summary');
  if (!box) return;
  var m = /[?&]session_id=([^&#]+)/.exec(window.location.search);
  if (!m) return;
  var id = decodeURIComponent(m[1]);
  try { window.history.replaceState(null, '', window.location.pathname); } catch (e) { /* sin historial */ }

  var KEY = 'msc_cart_v1';
  function eur(cents, cur) {
    try { return (cents / 100).toLocaleString('es-ES', { style: 'currency', currency: (cur || 'eur').toUpperCase() }); }
    catch (e) { return (cents / 100).toFixed(2).replace('.', ',') + ' €'; }
  }
  if (EN) eur = function (cents, cur) {
    try { return (cents / 100).toLocaleString('en-GB', { style: 'currency', currency: (cur || 'eur').toUpperCase() }); }
    catch (e) { return '€' + (cents / 100).toFixed(2); }
  };
  function q(sel) { return box.querySelector(sel); }

  box.setAttribute('aria-busy', 'true');
  fetch('/.netlify/functions/order-summary?session_id=' + encodeURIComponent(id), { headers: { Accept: 'application/json' } })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('http ' + r.status)); })
    .then(function (d) {
      if (!d || !d.paid) return;
      var ul = q('[data-os-items]');
      (d.items || []).forEach(function (line) {
        var li = document.createElement('li');
        var mm = /^(\d+)x\s+(.+?)\s*\((.+)\)$/.exec(line);
        if (mm) {
          var b = document.createElement('b'); b.textContent = mm[1] + ' × ' + (EN && PN[mm[2]] ? PN[mm[2]] : mm[2]);
          var s = document.createElement('span'); s.textContent = EN && GR[mm[3]] ? GR[mm[3]] : mm[3];
          li.appendChild(b); li.appendChild(s);
        } else { li.textContent = line; }
        ul.appendChild(li);
      });
      q('[data-os-shipping]').textContent = d.shipping > 0 ? eur(d.shipping, d.currency) : S.free;
      q('[data-os-total]').textContent = eur(d.total, d.currency);
      if (d.email) {
        var mail = q('[data-os-mail]');
        mail.textContent = S.mail1 + d.email + S.mail2;
        mail.hidden = false;
      }
      box.hidden = false;
      box.classList.add('is-in');
      try { window.localStorage.removeItem(KEY); } catch (e) { /* sin almacenamiento */ }
    })
    .catch(function () { /* si falla, la página se queda con el texto fijo */ })
    .then(function () { box.removeAttribute('aria-busy'); });
})();

/* Mensajes de error claros en los formularios (contacto, boletín, desistimiento).
   Sin JavaScript, el navegador sigue validando con sus mensajes propios. */
(function () {
  'use strict';
  var forms = document.querySelectorAll('form[data-netlify]');
  if (!forms.length) return;
  function msg(el) {
    var v = el.validity;
    if (v.valueMissing) return el.type === 'checkbox' ? 'Marca esta casilla para continuar.' : 'Este campo es obligatorio.';
    if (v.typeMismatch && el.type === 'email') return 'Escribe un email válido, por ejemplo nombre@dominio.com.';
    if (v.rangeOverflow && el.type === 'date') return 'La fecha no puede ser posterior a hoy.';
    if (v.rangeUnderflow) return 'Revisa la fecha.';
    if (v.tooShort) return 'Es demasiado corto.';
    if (v.patternMismatch) return 'Revisa el formato.';
    return 'Revisa este campo.';
  }
  function holder(el) { return el.closest('label') || el; }
  function errEl(el) {
    var id = (el.id || el.name || 'campo') + '-error';
    var e = document.getElementById(id);
    if (!e) {
      e = document.createElement('p'); e.className = 'field-error'; e.id = id;
      var h = holder(el); h.parentNode.insertBefore(e, h.nextSibling);
    }
    return e;
  }
  function show(el) {
    var e = errEl(el); e.textContent = msg(el);
    el.setAttribute('aria-invalid', 'true');
    var d = (el.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
    if (d.indexOf(e.id) < 0) { d.push(e.id); el.setAttribute('aria-describedby', d.join(' ')); }
  }
  function clear(el) {
    el.removeAttribute('aria-invalid');
    var e = document.getElementById((el.id || el.name || 'campo') + '-error');
    if (e) e.textContent = '';
  }
  Array.prototype.forEach.call(forms, function (f) {
    f.setAttribute('novalidate', '');
    var fields = f.querySelectorAll('input, textarea, select');
    Array.prototype.forEach.call(fields, function (el) {
      if (el.type === 'hidden' || el.name === 'bot-field') return;
      var ev = (el.type === 'checkbox' || el.type === 'date') ? 'change' : 'input';
      el.addEventListener(ev, function () { if (el.getAttribute('aria-invalid') === 'true') { if (el.checkValidity()) clear(el); else show(el); } });
      el.addEventListener('blur', function () { if (el.value && !el.checkValidity()) show(el); });
    });
    f.addEventListener('submit', function (e) {
      var first = null;
      Array.prototype.forEach.call(fields, function (el) {
        if (el.type === 'hidden' || el.name === 'bot-field' || !el.willValidate) return;
        if (el.checkValidity()) clear(el); else { show(el); if (!first) first = el; }
      });
      if (first) { e.preventDefault(); first.focus(); }
    });
  });
})();

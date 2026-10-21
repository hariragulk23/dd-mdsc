// Devuelve un resumen del pedido pagado para la página de confirmación.
// Solo devuelve: productos, envío, total y el email enmascarado. Nunca la dirección ni datos de pago.
// Necesita STRIPE_SECRET_KEY (la misma que create-checkout).

const SESSION_RE = /^cs_(test|live)_[A-Za-z0-9]{10,200}$/;

const json = (status, body) => ({
  statusCode: status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body)
});

function maskEmail(e) {
  if (!e || e.indexOf('@') < 1) return '';
  const parts = e.split('@');
  return parts[0].slice(0, 1) + '***@' + parts[1];
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') return json(405, { error: 'Método no permitido.' });
  const id = String((event.queryStringParameters || {}).session_id || '');
  if (!SESSION_RE.test(id)) return json(400, { error: 'Pedido no válido.' });

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return json(503, { error: 'Resumen no disponible.' });

  try {
    const res = await fetch('https://api.stripe.com/v1/checkout/sessions/' + encodeURIComponent(id), {
      headers: { Authorization: 'Bearer ' + key }
    });
    const s = await res.json();
    if (!res.ok || !s || s.object !== 'checkout.session') return json(404, { error: 'No encontramos este pedido.' });
    if (s.payment_status !== 'paid') return json(200, { paid: false });

    const items = String((s.metadata && s.metadata.pedido) || '').split('; ').filter(Boolean).slice(0, 20);
    return json(200, {
      paid: true,
      items,
      shipping: (s.total_details && s.total_details.amount_shipping) || 0,
      total: s.amount_total || 0,
      currency: s.currency || 'eur',
      email: maskEmail(s.customer_details && s.customer_details.email)
    });
  } catch (e) {
    console.error('order-summary failed', e && e.message);
    return json(502, { error: 'No se pudo cargar el resumen.' });
  }
};

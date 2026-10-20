// Creates a Stripe Checkout session for the Madrid Specialty Coffee cart.
// Prices are read from this file, never from the browser.
// Set STRIPE_SECRET_KEY in Netlify (Site settings > Environment variables).

const CATALOG = {
 "colombia": {
  "name": "Colombia Huila",
  "price_cents": 1190
 },
 "guatemala": {
  "name": "Guatemala Huehuetenango",
  "price_cents": 1190
 },
 "india": {
  "name": "India Karnataka",
  "price_cents": 1250
 },
 "ecologico": {
  "name": "Ecológico Isnos",
  "price_cents": 1390
 },
 "italian-blend": {
  "name": "Italian Blend",
  "price_cents": 1090
 },
 "descafeinado": {
  "name": "Descafeinado Colombia",
  "price_cents": 1350
 }
};

const GRINDS = {
  grano: 'En grano',
  espresso: 'Molido para espresso',
  moka: 'Molido para moka',
  filtro: 'Molido para filtro',
  prensa: 'Molido para prensa'
};

const FREE_SHIPPING_FROM_CENTS = 3500; // 35 €
const SHIPPING_CENTS = 495;            // 4,95 € below 35 € (confirm)
const MAX_ITEMS = 50;
const SITE = 'https://madridspecialtycoffee.com';

// Postal codes outside mainland Spain (for now): Baleares 07, Canarias 35 and 38, Ceuta and Melilla 51 and 52
const NON_MAINLAND = /^(07|35|38|51|52)/;

const json = (status, body) => ({
  statusCode: status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body)
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Método no permitido.' });

  let data;
  try { data = JSON.parse(event.body || '{}'); } catch (e) { return json(400, { error: 'Pedido no válido.' }); }

  const postal = String(data.postal || '').trim();
  if (!/^\d{5}$/.test(postal)) return json(400, { error: 'Revisa el código postal.' });
  if (NON_MAINLAND.test(postal)) {
    return json(400, { error: 'De momento enviamos solo a la España peninsular. Escríbenos por WhatsApp para consultar tu envío.' });
  }

  const items = Array.isArray(data.items) ? data.items : [];
  const clean = items.map((l) => ({
    id: String(l.id || ''),
    grind: GRINDS[l.grind] ? l.grind : 'grano',
    qty: Math.floor(Number(l.qty))
  })).filter((l) => CATALOG[l.id] && l.qty >= 1 && l.qty <= 20);

  if (!clean.length) return json(400, { error: 'Tu carrito está vacío.' });
  const totalQty = clean.reduce((s, l) => s + l.qty, 0);
  if (totalQty > MAX_ITEMS) return json(400, { error: 'Máximo 50 bolsas por pedido. Escríbenos por WhatsApp para pedidos grandes.' });

  const subtotal = clean.reduce((s, l) => s + l.qty * CATALOG[l.id].price_cents, 0);
  const shipping = subtotal >= FREE_SHIPPING_FROM_CENTS ? 0 : SHIPPING_CENTS;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return json(503, { error: 'El pago con tarjeta no está disponible ahora. Pide tu café por WhatsApp.' });

  // Build the form-encoded request for Stripe's Checkout Sessions API
  const p = new URLSearchParams();
  p.append('mode', 'payment');
  p.append('locale', 'es');
  p.append('success_url', SITE + '/pedido-ok.html');
  p.append('cancel_url', SITE + '/tienda.html');
  p.append('shipping_address_collection[allowed_countries][0]', 'ES');
  p.append('phone_number_collection[enabled]', 'true');
  p.append('billing_address_collection', 'required');

  clean.forEach((l, i) => {
    const c = CATALOG[l.id];
    p.append(`line_items[${i}][quantity]`, String(l.qty));
    p.append(`line_items[${i}][price_data][currency]`, 'eur');
    p.append(`line_items[${i}][price_data][unit_amount]`, String(c.price_cents));
    p.append(`line_items[${i}][price_data][product_data][name]`, `${c.name} 250 g`);
    p.append(`line_items[${i}][price_data][product_data][description]`, GRINDS[l.grind]);
  });

  p.append('shipping_options[0][shipping_rate_data][type]', 'fixed_amount');
  p.append('shipping_options[0][shipping_rate_data][display_name]', shipping === 0 ? 'Envío gratis (pedidos desde 35 €)' : 'Envío estándar (24–48 h laborables)');
  p.append('shipping_options[0][shipping_rate_data][fixed_amount][amount]', String(shipping));
  p.append('shipping_options[0][shipping_rate_data][fixed_amount][currency]', 'eur');

  // Short order summary for the Stripe dashboard
  const summary = clean.map((l) => `${l.qty}x ${CATALOG[l.id].name} (${GRINDS[l.grind]})`).join('; ').slice(0, 450);
  p.append('metadata[pedido]', summary);
  p.append('metadata[codigo_postal]', postal);
  p.append('payment_intent_data[metadata][pedido]', summary);
  p.append('payment_intent_data[metadata][marca]', 'Madrid Specialty Coffee');

  try {
    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: p.toString()
    });
    const out = await res.json();
    if (!res.ok || !out.url) {
      console.error('Stripe error', out && out.error && out.error.message);
      return json(502, { error: 'No se pudo abrir el pago. Inténtalo de nuevo o pide tu café por WhatsApp.' });
    }
    return json(200, { url: out.url });
  } catch (e) {
    console.error('Stripe request failed', e && e.message);
    return json(502, { error: 'No se pudo abrir el pago. Inténtalo de nuevo o pide tu café por WhatsApp.' });
  }
};

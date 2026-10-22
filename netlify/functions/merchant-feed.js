// Feed de productos para Google Merchant Center (RSS 2.0 con espacio de nombres g:).
// Se sirve en https://madridspecialtycoffee.com/merchant-feed.xml (redirección en netlify.toml).
// Precio y disponibilidad salen de ./lib/catalog.js, así que siempre coinciden con el pago.

const { CATALOG, UNAVAILABLE } = require('./lib/catalog.js');
const FEED = require('./lib/feed-data.js');

const SITE = 'https://madridspecialtycoffee.com';
const BRAND = 'Madrid Specialty Coffee';
const CATEGORY = 'Food, Beverages & Tobacco > Beverages > Coffee & Tea > Coffee';

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

exports.handler = async () => {
  const items = Object.keys(FEED)
    .filter((id) => FEED[id].include && CATALOG[id] && CATALOG[id].price_cents > 0)
    .map((id) => {
      const f = FEED[id];
      const price = (CATALOG[id].price_cents / 100).toFixed(2) + ' EUR';
      const stock = (UNAVAILABLE || []).indexOf(id) >= 0 ? 'out_of_stock' : 'in_stock';
      return [
        '<item>',
        '<g:id>' + esc(id) + '</g:id>',
        '<g:title>' + esc(f.title) + '</g:title>',
        '<g:description>' + esc(f.description) + '</g:description>',
        '<g:link>' + SITE + f.path + '</g:link>',
        '<g:image_link>' + SITE + f.image + '</g:image_link>',
        '<g:availability>' + stock + '</g:availability>',
        '<g:price>' + price + '</g:price>',
        '<g:condition>new</g:condition>',
        '<g:brand>' + esc(BRAND) + '</g:brand>',
        '<g:identifier_exists>no</g:identifier_exists>',
        '<g:google_product_category>' + esc(CATEGORY) + '</g:google_product_category>',
        '<g:product_type>' + esc('Café de especialidad') + '</g:product_type>',
        '<g:unit_pricing_measure>250 g</g:unit_pricing_measure>',
        '<g:unit_pricing_base_measure>1 kg</g:unit_pricing_base_measure>',
        '</item>'
      ].join('\n');
    });

  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n<channel>\n' +
    '<title>' + esc(BRAND) + '</title>\n<link>' + SITE + '</link>\n' +
    '<description>Café de especialidad en bolsas de 250 g</description>\n' +
    items.join('\n') + '\n</channel>\n</rss>\n';

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=900' },
    body: xml
  };
};

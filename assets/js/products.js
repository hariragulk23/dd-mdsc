/* products.js: catálogo. Los precios existen en dos sitios: assets/js/products.js (lo que ve el cliente) y netlify/functions/lib/catalog.js (pago y feed de Google). Para marcar un café agotado: "available": false aquí, y añade su id a UNAVAILABLE en netlify/functions/lib/catalog.js. */
window.MSC_SHOP = { wa: "34665747463", freeShip: 35, stripe: true };
window.MSC_PRODUCTS = [
 {
  "id": "colombia",
  "available": true,
  "order": 1,
  "name": "Colombia Huila",
  "name_en": "Colombia Huila",
  "price": 11.9,
  "img": "assets/images/tienda/bolsa-colombia.jpg",
  "url": "cafe-colombia.html",
  "url_en": "/en/colombia-huila-coffee",
  "desc": "Chocolate, avellana y caña de azúcar, con un final cítrico que limpia el paladar. Equilibrado en cualquier método.",
  "desc_en": "Chocolate, hazelnut and sugar cane, with a citrus finish that cleans the palate. Well balanced with any brewing method.",
  "families": [
   "citrico",
   "dulce",
   "chocolate",
   "frutos-secos"
  ],
  "ideal": [
   "espresso",
   "filtro",
   "moka",
   "prensa"
  ],
  "profile": {
   "acidez": 3,
   "dulzor": 4,
   "cuerpo": 3,
   "intensidad": 3
  },
  "decaf": false,
  "eco": false,
  "sca": 84
 },
 {
  "id": "guatemala",
  "available": true,
  "order": 2,
  "name": "Guatemala Huehuetenango",
  "name_en": "Guatemala Huehuetenango",
  "price": 11.9,
  "img": "assets/images/tienda/bolsa-guatemala.jpg",
  "url": "cafe-guatemala.html",
  "url_en": "/en/guatemala-huehuetenango-coffee",
  "desc": "Almendra, cacao y manzana roja, con acidez suave y cuerpo equilibrado. Un café que gusta a todos.",
  "desc_en": "Almond, cocoa and red apple, with gentle acidity and a balanced body. A coffee everyone likes.",
  "families": [
   "frutal",
   "chocolate",
   "frutos-secos"
  ],
  "ideal": [
   "filtro",
   "espresso",
   "prensa"
  ],
  "profile": {
   "acidez": 2,
   "dulzor": 3,
   "cuerpo": 3,
   "intensidad": 3
  },
  "decaf": false,
  "eco": false,
  "sca": 84
 },
 {
  "id": "india",
  "available": true,
  "order": 3,
  "name": "India Karnataka",
  "name_en": "India Karnataka",
  "price": 12.5,
  "img": "assets/images/tienda/bolsa-india.jpg",
  "url": "cafe-india.html",
  "url_en": "/en/india-karnataka-coffee",
  "desc": "Banana madura, uva y macadamia, con un toque de pomelo y final a nuez. Cultivado bajo sombra.",
  "desc_en": "Ripe banana, grape and macadamia, with a hint of grapefruit and a nutty finish. Grown in the shade.",
  "families": [
   "frutal",
   "citrico",
   "frutos-secos"
  ],
  "ideal": [
   "prensa",
   "filtro",
   "espresso"
  ],
  "profile": {
   "acidez": 3,
   "dulzor": 4,
   "cuerpo": 4,
   "intensidad": 3
  },
  "decaf": false,
  "eco": false,
  "sca": 84
 },
 {
  "id": "ecologico",
  "available": true,
  "order": 4,
  "name": "Ecológico Isnos",
  "price": 13.9,
  "img": "assets/images/tienda/bolsa-ecologico.jpg",
  "url": "cafe-ecologico.html",
  "desc": "Caramelo, fresa y mandarina, con acidez viva y cuerpo ligero. Con certificación ecológica.",
  "families": [
   "frutal",
   "citrico",
   "dulce"
  ],
  "ideal": [
   "filtro"
  ],
  "profile": {
   "acidez": 4,
   "dulzor": 4,
   "cuerpo": 2,
   "intensidad": 2
  },
  "decaf": false,
  "eco": true,
  "sca": 85.5
 },
 {
  "id": "italian-blend",
  "available": true,
  "order": 5,
  "name": "Italian Blend",
  "name_en": "Italian Blend",
  "price": 10.9,
  "img": "assets/images/tienda/bolsa-italian-blend.jpg",
  "url": "cafe-italian-blend.html",
  "url_en": "/en/italian-blend-coffee",
  "desc": "Chocolate negro, especias y malta tostada, con mucho cuerpo y una crema generosa. 80 % arábica de Colombia y 20 % robusta de la India.",
  "desc_en": "Dark chocolate, spices and toasted malt, with plenty of body and a generous crema. 80% arabica from Colombia and 20% robusta from India.",
  "families": [
   "chocolate",
   "especiado"
  ],
  "ideal": [
   "espresso",
   "moka"
  ],
  "profile": {
   "acidez": 1,
   "dulzor": 2,
   "cuerpo": 5,
   "intensidad": 5
  },
  "decaf": false,
  "eco": false,
  "sca": null
 },
 {
  "id": "descafeinado",
  "available": true,
  "order": 6,
  "name": "Descafeinado Colombia",
  "name_en": "Decaf Colombia",
  "price": 13.5,
  "img": "assets/images/tienda/bolsa-descafeinado.jpg",
  "url": "cafe-descafeinado.html",
  "url_en": "/en/decaf-colombia-coffee",
  "desc": "Frutas dulces, chocolate y almendra, con un final a arándanos. Descafeinado sin renunciar al sabor.",
  "desc_en": "Sweet fruit, chocolate and almond, with a blueberry finish. Decaf without giving up flavour.",
  "families": [
   "frutal",
   "chocolate",
   "frutos-secos"
  ],
  "ideal": [
   "espresso",
   "filtro",
   "prensa",
   "moka"
  ],
  "profile": {
   "acidez": 3,
   "dulzor": 4,
   "cuerpo": 3,
   "intensidad": 2
  },
  "decaf": true,
  "eco": false,
  "sca": 85
 }
];

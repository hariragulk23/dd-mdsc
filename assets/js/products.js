/* products.js: catálogo. Los precios son provisionales. */
window.MSC_SHOP = { wa: "34665747463", freeShip: 35 };
window.MSC_PRODUCTS = [
 {
  "id": "colombia",
  "order": 1,
  "name": "Colombia Huila",
  "price": 11.9,
  "img": "assets/images/tienda/bolsa-colombia.jpg",
  "url": "cafe-colombia.html",
  "desc": "Chocolate, avellana y caña de azúcar, con un final cítrico que limpia el paladar. Equilibrado en cualquier método.",
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
  "order": 2,
  "name": "Guatemala Huehuetenango",
  "price": 11.9,
  "img": "assets/images/tienda/bolsa-guatemala.jpg",
  "url": "cafe-guatemala.html",
  "desc": "Almendra, cacao y manzana roja, con acidez suave y cuerpo equilibrado. Un café que gusta a todos.",
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
  "order": 3,
  "name": "India Karnataka",
  "price": 12.5,
  "img": "assets/images/tienda/bolsa-india.jpg",
  "url": "cafe-india.html",
  "desc": "Banana madura, uva y macadamia, con un toque de pomelo y final a nuez. Cultivado bajo sombra.",
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
  "order": 5,
  "name": "Italian Blend",
  "price": 10.9,
  "img": "assets/images/tienda/bolsa-italian-blend.jpg",
  "url": "cafe-italian-blend.html",
  "desc": "Chocolate negro, especias y malta tostada, con mucho cuerpo y una crema generosa. 80% arábica, 20% robusta.",
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
  "order": 6,
  "name": "Descafeinado Colombia",
  "price": 13.5,
  "img": "assets/images/tienda/bolsa-descafeinado.jpg",
  "url": "cafe-descafeinado.html",
  "desc": "Frutas dulces, chocolate y almendra, con un final a arándanos. Descafeinado sin renunciar al sabor.",
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

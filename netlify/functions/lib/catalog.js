const CATALOG = {
 "colombia": {
  "name": "Colombia Huila",
  "name_en": "Colombia Huila",
  "price_cents": 1190
 },
 "guatemala": {
  "name": "Guatemala Huehuetenango",
  "name_en": "Guatemala Huehuetenango",
  "price_cents": 1190
 },
 "india": {
  "name": "India Karnataka",
  "name_en": "India Karnataka",
  "price_cents": 1250
 },
 "ecologico": {
  "name": "Ecológico Isnos",
  "name_en": "Ecológico Isnos",
  "price_cents": 1390
 },
 "italian-blend": {
  "name": "Italian Blend",
  "name_en": "Italian Blend",
  "price_cents": 1090
 },
 "descafeinado": {
  "name": "Descafeinado Colombia",
  "name_en": "Decaf Colombia",
  "price_cents": 1350
 }
};

// Cafés agotados: debe coincidir con "available": false en assets/js/products.js
const UNAVAILABLE = [];

module.exports = { CATALOG, UNAVAILABLE };

// Datos de texto para el feed de Google Merchant Center.
// El PRECIO y la DISPONIBILIDAD no están aquí: salen de ./catalog.js (los mismos que usa el pago).
// include: false = no se envía a Google (por ejemplo, hasta tener claro el tema ecológico).
module.exports = {
  'colombia': {
    include: true,
    title: 'Café de especialidad Colombia Huila 250 g',
    description: 'Chocolate, avellana y caña de azúcar, con un final cítrico que limpia el paladar. Equilibrado en cualquier método. Bolsa de 250 g, en grano o molido. Tostado cada semana en lotes pequeños y molido al hacer el pedido.',
    path: '/cafe-colombia',
    image: '/assets/images/tienda/bolsa-colombia.jpg'
  },
  'guatemala': {
    include: true,
    title: 'Café de especialidad Guatemala Huehuetenango 250 g',
    description: 'Almendra, cacao y manzana roja, con acidez suave y cuerpo equilibrado. Un café que gusta a todos. Bolsa de 250 g, en grano o molido. Tostado cada semana en lotes pequeños y molido al hacer el pedido.',
    path: '/cafe-guatemala',
    image: '/assets/images/tienda/bolsa-guatemala.jpg'
  },
  'india': {
    include: true,
    title: 'Café de especialidad India Karnataka 250 g',
    description: 'Banana madura, uva y macadamia, con un toque de pomelo y final a nuez. Cultivado bajo sombra. Bolsa de 250 g, en grano o molido. Tostado cada semana en lotes pequeños y molido al hacer el pedido.',
    path: '/cafe-india',
    image: '/assets/images/tienda/bolsa-india.jpg'
  },
  'ecologico': {
    include: false, // NO enviar hasta resolver la auditoría ecológica y el nombre final del producto
    title: 'Café de especialidad Isnos Huila 250 g',
    description: 'Caramelo, fresa y mandarina, con acidez viva y cuerpo ligero. Bolsa de 250 g, en grano o molido.',
    path: '/cafe-ecologico',
    image: '/assets/images/tienda/bolsa-ecologico.jpg'
  },
  'italian-blend': {
    include: true,
    title: 'Café Italian Blend 250 g, arábica y robusta',
    description: 'Chocolate negro, especias y malta tostada, con mucho cuerpo y una crema generosa. 80 % arábica de Colombia y 20 % robusta de la India. Bolsa de 250 g, en grano o molido. Tostado cada semana en lotes pequeños y molido al hacer el pedido.',
    path: '/cafe-italian-blend',
    image: '/assets/images/tienda/bolsa-italian-blend.jpg'
  },
  'descafeinado': {
    include: true,
    title: 'Café descafeinado de especialidad Colombia 250 g',
    description: 'Frutas dulces, chocolate y almendra, con un final a arándanos. Descafeinado sin renunciar al sabor. Bolsa de 250 g, en grano o molido. Tostado cada semana en lotes pequeños y molido al hacer el pedido.',
    path: '/cafe-descafeinado',
    image: '/assets/images/tienda/bolsa-descafeinado.jpg'
  }
};

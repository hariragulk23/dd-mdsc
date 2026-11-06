// Tells the shop pages whether new orders are paused.
// Set SHOP_PAUSED to exactly "true" in Netlify (Environment variables) and redeploy to pause; anything else, or no variable, keeps the shop open.
// create-checkout.js reads the same variable, so a paused shop never reaches Stripe.

exports.handler = async () => ({
  statusCode: 200,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify({ paused: process.env.SHOP_PAUSED === 'true' })
});

// Example Stripe server for local testing
// Usage:
// 1. npm init -y
// 2. npm install express stripe cors dotenv
// 3. create a .env file with STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY
// 4. node stripe-server.js

require('dotenv').config();
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.json());
// serve the static site so you can open http://localhost:4242/checkout.html etc.
app.use(express.static(path.join(__dirname)));

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    // IMPORTANT:
    // Stripe expects amounts in the smallest currency unit (e.g., cents for USD).
    // This example assumes the incoming `price` values are in the major currency unit (e.g., ZMW Kwacha).
    // Stripe may not support ZMW for Checkout in all accounts — if it doesn't, convert to a supported currency.

    const line_items = items.map(i => ({
      price_data: {
        currency: process.env.PAYMENT_CURRENCY || 'usd', // change to 'zmw' if your Stripe account supports it
        product_data: { name: i.name },
        unit_amount: Math.round((Number(i.price) || 0) * 100),
      },
      quantity: Number(i.quantity) || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get('host')}/checkout.html`,
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Stripe test server running on http://localhost:${PORT}`));

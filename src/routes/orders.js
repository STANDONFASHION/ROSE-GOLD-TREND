const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// GET /orders/:id
router.get('/:id', auth, async (req, res, next) => {
  try {
    const order = await db('orders').where({ id: req.params.id }).first();
    if (!order) return res.status(404).json({ error: 'Not found' });

    if (order.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    const items = await db('order_items').where({ order_id: order.id });
    res.json({ ...order, items });
  } catch (err) {
    next(err);
  }
});

// POST /orders
// payload: { items: [{ product_id, quantity }] }
router.post('/', auth, async (req, res, next) => {
  const trx = await db.transaction();
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Invalid items' });

    // calculate total
    let total = 0;
    const enriched = [];
    for (const it of items) {
      const product = await trx('products').where({ id: it.product_id }).first();
      if (!product) {
        await trx.rollback();
        return res.status(400).json({ error: `Product not found: ${it.product_id}` });
      }
      const price = parseFloat(product.price);
      const qty = parseInt(it.quantity, 10) || 1;
      total += price * qty;
      enriched.push({ product_id: it.product_id, quantity: qty, price });
    }

    const [orderId] = await trx('orders').insert({ total, user_id: req.user.id });
    for (const e of enriched) {
      await trx('order_items').insert({ order_id: orderId, product_id: e.product_id, quantity: e.quantity, price: e.price });
    }

    await trx.commit();

    const newOrder = await db('orders').where({ id: orderId }).first();
    const orderItems = await db('order_items').where({ order_id: orderId });
    res.status(201).json({ ...newOrder, items: orderItems });
  } catch (err) {
    await trx.rollback();
    next(err);
  }
});

module.exports = router;

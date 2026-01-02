const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /products
router.get('/', async (req, res, next) => {
  try {
    const products = await db('products').select('*');
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// GET /products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await db('products').where({ id: req.params.id }).first();
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST /products
router.post('/', async (req, res, next) => {
  try {
    const { name, description, price } = req.body;
    // knex + sqlite compatibility: returning() is supported on PG but not sqlite.
    const inserted = await db('products').insert({ name, description, price });

    let id;
    if (Array.isArray(inserted)) {
      // Postgres returns [{ id: <val> }] or [id]
      if (inserted.length && typeof inserted[0] === 'object') id = inserted[0].id || Object.values(inserted[0])[0];
      else id = inserted[0];
    } else {
      // numeric id
      id = inserted;
    }

    const newProduct = await db('products').where({ id }).first();
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'ROSE-GOLD-TREND API' }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Routes
const productsRouter = require('./routes/products');
app.use('/products', productsRouter);

const ordersRouter = require('./routes/orders');
app.use('/orders', ordersRouter);

// Error handler
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;

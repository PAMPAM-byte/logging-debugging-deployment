require('dotenv').config();

const express = require('express');
const morgan  = require('morgan');

const itemsRouter  = require('./routes/items');
const usersRouter  = require('./routes/users');
const ordersRouter = require('./routes/orders');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────

app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── Health check ─────────────────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app:    process.env.APP_NAME || 'API',
    env:    process.env.NODE_ENV,
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/items',  itemsRouter);
app.use('/api/users',  usersRouter);
app.use('/api/orders', ordersRouter);

// ─── 404 ──────────────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Error handler ────────────────────────────────────────────────────────────

app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[${process.env.APP_NAME}] running on port ${PORT} — ${process.env.NODE_ENV}`);
});
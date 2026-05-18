const express = require('express');
const router  = express.Router();

let orders = [
  { id: 1, userId: 1, itemId: 2, quantity: 1, status: 'delivered', total: 19.99 },
  { id: 2, userId: 2, itemId: 1, quantity: 3, status: 'pending',   total: 29.97 },
  { id: 3, userId: 3, itemId: 3, quantity: 2, status: 'shipped',   total: 9.98  },
];
let nextId = 4;

const VALID_STATUSES = ['pending', 'shipped', 'delivered', 'cancelled'];

// GET /api/orders          — optionally filter by ?userId=1 or ?status=pending
router.get('/', (req, res) => {
  const { userId, status } = req.query;
  let result = orders;
  if (userId) result = result.filter(o => o.userId === Number(userId));
  if (status) result = result.filter(o => o.status === status);
  res.json(result);
});

// GET /api/orders/:id
router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === Number(req.params.id));
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// POST /api/orders
router.post('/', (req, res) => {
  const { userId, itemId, quantity } = req.body;
  if (!userId || !itemId || !quantity) {
    return res.status(400).json({ error: 'userId, itemId, and quantity are required' });
  }
  if (quantity < 1) {
    return res.status(400).json({ error: 'quantity must be at least 1' });
  }
  const newOrder = {
    id:       nextId++,
    userId:   Number(userId),
    itemId:   Number(itemId),
    quantity: Number(quantity),
    status:   'pending',
    total:    null, // would be calculated with a real DB join
  };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// PATCH /api/orders/:id/status  — update only the status field
router.patch('/:id/status', (req, res) => {
  const idx = orders.findIndex(o => o.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Order not found' });

  const { status } = req.body;
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `status must be one of: ${VALID_STATUSES.join(', ')}`,
    });
  }
  orders[idx].status = status;
  res.json(orders[idx]);
});

// DELETE /api/orders/:id
router.delete('/:id', (req, res) => {
  const idx = orders.findIndex(o => o.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Order not found' });
  orders.splice(idx, 1);
  res.status(204).send();
});

module.exports = router;
const express = require('express');
const router  = express.Router();

let items = [
  { id: 1, name: 'Widget A', price: 9.99,  category: 'basic'   },
  { id: 2, name: 'Widget B', price: 19.99, category: 'premium' },
  { id: 3, name: 'Widget C', price: 4.99,  category: 'basic'   },
];
let nextId = 4;

// GET /api/items          — optionally filter by ?category=basic
router.get('/', (req, res) => {
  const { category } = req.query;
  const result = category
    ? items.filter(i => i.category === category)
    : items;
  res.json(result);
});

// GET /api/items/:id
router.get('/:id', (req, res) => {
  const item = items.find(i => i.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

// POST /api/items
router.post('/', (req, res) => {
  const { name, price, category } = req.body;
  if (!name || price === undefined || !category) {
    return res.status(400).json({ error: 'name, price, and category are required' });
  }
  const newItem = { id: nextId++, name, price: Number(price), category };
  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT /api/items/:id
router.put('/:id', (req, res) => {
  const idx = items.findIndex(i => i.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Item not found' });
  const { name, price, category } = req.body;
  items[idx] = { ...items[idx], name, price: Number(price), category };
  res.json(items[idx]);
});

// DELETE /api/items/:id
router.delete('/:id', (req, res) => {
  const idx = items.findIndex(i => i.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Item not found' });
  items.splice(idx, 1);
  res.status(204).send();
});

module.exports = router;
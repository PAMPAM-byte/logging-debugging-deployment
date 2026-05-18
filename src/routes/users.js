const express = require('express');
const router  = express.Router();

let users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
  { id: 2, name: 'Bob Smith',     email: 'bob@example.com',   role: 'user'  },
  { id: 3, name: 'Carol White',   email: 'carol@example.com', role: 'user'  },
];
let nextId = 4;

// GET /api/users          — optionally filter by ?role=admin
router.get('/', (req, res) => {
  const { role } = req.query;
  const result = role ? users.filter(u => u.role === role) : users;
  res.json(result);
});

// GET /api/users/:id
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// POST /api/users
router.post('/', (req, res) => {
  const { name, email, role } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }
  // Prevent duplicate emails
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'Email already exists' });
  }
  const newUser = { id: nextId++, name, email, role: role || 'user' };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT /api/users/:id
router.put('/:id', (req, res) => {
  const idx = users.findIndex(u => u.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  const { name, email, role } = req.body;
  users[idx] = { ...users[idx], name, email, role };
  res.json(users[idx]);
});

// DELETE /api/users/:id
router.delete('/:id', (req, res) => {
  const idx = users.findIndex(u => u.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  users.splice(idx, 1);
  res.status(204).send();
});

module.exports = router;
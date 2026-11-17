const express = require('express');
const bcrypt = require('bcrypt');
const { get, run } = require('../db');
const { signToken } = require('../auth');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  if (username.trim().length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  try {
    const existingUser = await get('SELECT id FROM users WHERE username = ?', [username.trim()]);
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await run(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username.trim(), passwordHash]
    );

    const user = { id: result.id, username: username.trim() };
    const token = signToken(user);

    return res.status(201).json({ token, user });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Could not create account.' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    const user = await get('SELECT * FROM users WHERE username = ?', [username.trim()]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = signToken({ id: user.id, username: user.username });
    return res.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Could not log in.' });
  }
});

router.get('/me', require('../auth').requireAuth, async (req, res) => {
  return res.json({ user: req.user });
});

router.post('/logout', (req, res) => {
  return res.json({ message: 'Logged out successfully.' });
});

module.exports = router;

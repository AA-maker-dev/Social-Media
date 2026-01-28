const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { runAsync, getAsync, allAsync } = require('../db');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await allAsync('SELECT id, name, username, email, role, avatar, bio, location, website, created_at FROM users');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await getAsync('SELECT id, name, username, email, role, avatar, bio, location, website, created_at FROM users WHERE id = ?', [req.params.id]);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create user
router.post('/', async (req, res) => {
    try {
        const { email, password, name, username, role } = req.body;
        if (!email || !password || !name || !username) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const id = uuidv4();
        await runAsync(
            'INSERT INTO users (id, email, password, name, username, role) VALUES (?, ?, ?, ?, ?, ?)',
            [id, email, password, name, username, role || 'customer']
        );

        res.status(201).json({ id, email, name, username, role: role || 'customer' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get users by role
router.get('/role/:role', async (req, res) => {
    try {
        const users = await allAsync('SELECT id, name, username, email, role FROM users WHERE role = ?', [req.params.role]);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    try {
        const { name, username } = req.body;
        if (!name || !username) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        await runAsync(
            'UPDATE users SET name = ?, username = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [name, username, req.params.id]
        );

        const user = await getAsync('SELECT id, name, username, email, role FROM users WHERE id = ?', [req.params.id]);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

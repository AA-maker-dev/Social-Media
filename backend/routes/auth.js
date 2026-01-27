const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getAsync, runAsync } = require('../db');

const router = express.Router();

// User login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const user = await getAsync(
            'SELECT id, name, username, email, role FROM users WHERE email = ? AND password = ?',
            [email, password]
        );

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({ success: true, user, token: 'mock-token-' + user.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// User signup
router.post('/signup', async (req, res) => {
    try {
        const { email, password, name, username } = req.body;
        if (!email || !password || !name || !username) {
            return res.status(400).json({ error: 'All fields required' });
        }

        const id = uuidv4();
        await runAsync(
            'INSERT INTO users (id, email, password, name, username, role) VALUES (?, ?, ?, ?, ?, ?)',
            [id, email, password, name, username, 'customer']
        );

        res.status(201).json({
            success: true,
            user: { id, name, username, email, role: 'customer' },
            token: 'mock-token-' + id
        });
    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Email or username already registered' });
        }
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

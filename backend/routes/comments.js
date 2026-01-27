const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { runAsync, getAsync, allAsync } = require('../db');

const router = express.Router();

// Get all comments for a post
router.get('/post/:post_id', async (req, res) => {
    try {
        const comments = await allAsync(`
            SELECT c.id, c.text, c.created_at, u.name, u.username, u.id as user_id
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = ?
            ORDER BY c.created_at DESC
        `, [req.params.post_id]);

        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add comment
router.post('/', async (req, res) => {
    try {
        const { post_id, user_id, text } = req.body;
        if (!post_id || !user_id || !text) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const id = uuidv4();
        await runAsync(
            'INSERT INTO comments (id, post_id, user_id, text) VALUES (?, ?, ?, ?)',
            [id, post_id, user_id, text]
        );

        res.status(201).json({ id, post_id, user_id, text, created_at: new Date() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete comment
router.delete('/:id', async (req, res) => {
    try {
        await runAsync('DELETE FROM comments WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

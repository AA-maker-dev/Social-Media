const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { runAsync, getAsync, allAsync } = require('../db');

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await allAsync(`
            SELECT p.id, p.caption, p.user_id, p.likes, p.created_at, u.name, u.username
            FROM posts p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
        `);
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await getAsync(`
            SELECT p.id, p.caption, p.user_id, p.likes, p.created_at, u.name, u.username
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.id = ?
        `, [req.params.id]);

        if (!post) return res.status(404).json({ error: 'Post not found' });

        const reactions = await allAsync(
            'SELECT reaction_type, count FROM post_reactions WHERE post_id = ?',
            [req.params.id]
        );

        res.json({ ...post, reactions });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create post
router.post('/', async (req, res) => {
    try {
        const { user_id, caption } = req.body;
        if (!user_id || !caption) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const id = uuidv4();
        await runAsync(
            'INSERT INTO posts (id, user_id, caption) VALUES (?, ?, ?)',
            [id, user_id, caption]
        );

        res.status(201).json({ id, user_id, caption, likes: 0, created_at: new Date() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Like post
router.post('/:id/like', async (req, res) => {
    try {
        await runAsync(
            'UPDATE posts SET likes = likes + 1 WHERE id = ?',
            [req.params.id]
        );

        const post = await getAsync('SELECT * FROM posts WHERE id = ?', [req.params.id]);
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add reaction
router.post('/:id/reaction', async (req, res) => {
    try {
        const { reaction_type } = req.body;
        const id = uuidv4();

        const existing = await getAsync(
            'SELECT * FROM post_reactions WHERE post_id = ? AND reaction_type = ?',
            [req.params.id, reaction_type]
        );

        if (existing) {
            await runAsync(
                'UPDATE post_reactions SET count = count + 1 WHERE post_id = ? AND reaction_type = ?',
                [req.params.id, reaction_type]
            );
        } else {
            await runAsync(
                'INSERT INTO post_reactions (id, post_id, reaction_type, count) VALUES (?, ?, ?, 1)',
                [id, req.params.id, reaction_type]
            );
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get posts by user
router.get('/user/:user_id', async (req, res) => {
    try {
        const posts = await allAsync(`
            SELECT p.id, p.caption, p.user_id, p.likes, p.created_at, u.name, u.username
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.user_id = ?
            ORDER BY p.created_at DESC
        `, [req.params.user_id]);

        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

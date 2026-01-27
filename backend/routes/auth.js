const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { body } = require('express-validator');
const { getAsync, runAsync } = require('../db');
const { generateToken } = require('../middleware/auth');
const { handleValidationErrors, asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Validation rules
const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required')
];

const signupValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain uppercase, lowercase, and number'),
    body('name').trim().notEmpty().withMessage('Name required'),
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username required')
        .matches(/^@?[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores')
];

// User login
router.post('/login', loginValidation, handleValidationErrors, asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await getAsync(
        'SELECT id, name, username, email, password, role FROM users WHERE email = ?',
        [email]
    );

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    
    // Don't send password back
    delete user.password;

    res.json({ 
        success: true, 
        user, 
        token 
    });
}));

// User signup
router.post('/signup', signupValidation, handleValidationErrors, asyncHandler(async (req, res) => {
    let { email, password, name, username } = req.body;
    
    // Ensure username has @ prefix
    if (!username.startsWith('@')) {
        username = '@' + username;
    }

    // Check if user exists
    const existingUser = await getAsync(
        'SELECT id FROM users WHERE email = ? OR username = ?',
        [email, username]
    );

    if (existingUser) {
        return res.status(409).json({ error: 'Email or username already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const id = uuidv4();
    await runAsync(
        'INSERT INTO users (id, email, password, name, username, role) VALUES (?, ?, ?, ?, ?, ?)',
        [id, email, hashedPassword, name, username, 'customer']
    );

    const user = { id, name, username, email, role: 'customer' };
    const token = generateToken(user);

    res.status(201).json({
        success: true,
        user,
        token
    });
}));

module.exports = router;

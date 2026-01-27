const { validationResult } = require('express-validator');

// Validation error handler
function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error: 'Validation failed',
            details: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    
    next();
}

// Global error handler
function errorHandler(err, req, res, next) {
    console.error('Error:', err);
    
    // Mongoose/Database errors
    if (err.code === 'SQLITE_CONSTRAINT') {
        return res.status(409).json({ 
            error: 'Database constraint violation',
            message: err.message 
        });
    }
    
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
    }
    
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
    }
    
    // Default error
    res.status(err.status || 500).json({ 
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}

// Async handler wrapper
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

module.exports = {
    handleValidationErrors,
    errorHandler,
    asyncHandler
};

const jwt = require('jsonwebtoken');

// Generate JWT token
function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role
    };
    
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
}

// Verify JWT token
function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return null;
    }
}

// Authentication middleware
function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }
        
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.substring(7) 
            : authHeader;
        
        const decoded = verifyToken(token);
        
        if (!decoded) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Authentication failed' });
    }
}

// Optional authentication (doesn't fail if no token)
function optionalAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader) {
            const token = authHeader.startsWith('Bearer ') 
                ? authHeader.substring(7) 
                : authHeader;
            
            const decoded = verifyToken(token);
            if (decoded) {
                req.user = decoded;
            }
        }
        
        next();
    } catch (err) {
        next();
    }
}

// Role-based authorization
function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        
        next();
    };
}

module.exports = {
    generateToken,
    verifyToken,
    authenticate,
    optionalAuth,
    authorize
};

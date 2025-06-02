// backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info (id, role, username) to request object
        req.user = decoded.user; 

        next(); // ไปยัง middleware/controller ถัดไป
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

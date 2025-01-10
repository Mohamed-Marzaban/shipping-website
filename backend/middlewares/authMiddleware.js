const jwt = require('jsonwebtoken');

const authenticateAndAuthorize = (allowedRoles) => {
    return (req, res, next) => {
        try {
            const token = req.cookies.authToken;
            if (!token) {
                return res.status(401).json({ message: 'Access token is missing' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (!allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Access denied: no permission ' });
            }

            req.user = decoded;


            next();
        } catch (error) {
            console.error('Authorization error:', error.message);
            res.status(401).json({ message: 'Invalid or expired token' });
        }
    };
};

module.exports = authenticateAndAuthorize;
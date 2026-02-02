const User = require('../models/User');

const isAdmin = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        next();
    } catch (error) {
        console.error('isAdmin middleware error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = isAdmin;

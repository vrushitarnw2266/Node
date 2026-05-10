const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token = req.cookies.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.redirect('/login?error=Not authorized, token failed');
        }
    } else {
        res.redirect('/login?error=Not authorized, no token');
    }
};

module.exports = { protect };

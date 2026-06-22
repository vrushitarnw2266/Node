const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to extract user and make it available in templates
const checkUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkeyfortaskmanagementapp123');
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
        res.locals.user = user;
      } else {
        req.user = null;
        res.locals.user = null;
      }
    } catch (err) {
      req.user = null;
      res.locals.user = null;
      res.clearCookie('token');
    }
  } else {
    req.user = null;
    res.locals.user = null;
  }
  next();
};

// Middleware to require authentication (redirects to login if not authenticated)
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  next();
};

// Middleware to check specific roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.redirect('/login');
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).render('error', {
        message: 'Access Denied: You do not have the required permissions.',
        title: 'Forbidden'
      });
    }
    next();
  };
};

module.exports = { checkUser, requireAuth, authorizeRoles };

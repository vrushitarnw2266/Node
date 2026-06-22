const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to create JWT token
const maxAge = 24 * 60 * 60; // 1 day in seconds
const createToken = (id, username, role) => {
  return jwt.sign(
    { id, username, role },
    process.env.JWT_SECRET || 'supersecretkeyfortaskmanagementapp123',
    { expiresIn: maxAge }
  );
};

// GET Register page
exports.register_get = (req, res) => {
  if (req.user) {
    return res.redirect('/tasks');
  }
  res.render('register', { error: null });
};

// POST Register user
exports.register_post = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render('register', { error: 'Username is already taken' });
    }

    // Create and save user
    const user = new User({ username, password, role: role || 'user' });
    await user.save();

    // Create JWT and cookie
    const token = createToken(user._id, user.username, user.role);
    res.cookie('token', token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.redirect('/tasks');
  } catch (err) {
    console.error(err);
    let errorMsg = 'An error occurred during registration.';
    if (err.errors) {
      // mongoose validation errors
      errorMsg = Object.values(err.errors).map(val => val.message).join(', ');
    }
    res.render('register', { error: errorMsg });
  }
};

// GET Login page
exports.login_get = (req, res) => {
  if (req.user) {
    return res.redirect('/tasks');
  }
  res.render('login', { error: null });
};

// POST Login user
exports.login_post = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.render('login', { error: 'Invalid username or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('login', { error: 'Invalid username or password' });
    }

    // Create JWT and cookie
    const token = createToken(user._id, user.username, user.role);
    res.cookie('token', token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.redirect('/tasks');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'An error occurred during login.' });
  }
};

// GET Logout user
exports.logout_get = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};

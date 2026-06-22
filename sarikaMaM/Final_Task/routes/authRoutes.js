const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Registration routes
router.get('/register', authController.register_get);
router.post('/register', authController.register_post);

// Login routes
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);

// Logout route
router.get('/logout', authController.logout_get);

module.exports = router;

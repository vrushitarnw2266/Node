const express = require('express');
const router = express.Router();
const { 
    renderHome, 
    renderAbout, 
    renderServices, 
    renderContact, 
    renderLogin, 
    renderRegister 
} = require('../controllers/pageController');

router.get('/', renderHome);
router.get('/about', renderAbout);
router.get('/services', renderServices);
router.get('/contact', renderContact);
router.get('/login', renderLogin);
router.get('/register', renderRegister);

module.exports = router;

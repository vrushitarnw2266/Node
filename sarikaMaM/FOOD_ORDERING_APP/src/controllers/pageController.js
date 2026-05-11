const fs = require('fs');
const path = require('path');

const renderHome = (req, res) => {
    res.render('index', { page: 'home' });
};

const renderAbout = (req, res) => {
    res.render('about', { page: 'about' });
};

const renderServices = (req, res) => {
    res.render('services', { page: 'services' });
};

const renderContact = (req, res) => {
    res.render('contact', { page: 'contact' });
};

const renderLogin = (req, res) => {
    const error = req.query.error || null;
    res.render('login', { page: 'login', error });
};

const renderRegister = (req, res) => {
    res.render('register', { page: 'register', error: null });
};

const renderMenuCategory = (req, res) => {
    const category = req.params.category.toLowerCase();
    const menuPath = path.join(__dirname, '../data/menu.json');
    
    fs.readFile(menuPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error loading menu data');
        }
        
        const menuData = JSON.parse(data);
        const categoryData = menuData[category];
        
        if (!categoryData) {
            return res.status(404).render('index', { page: 'home' }); // Redirect or show error
        }
        
        res.render('menu-category', { 
            page: 'menu', 
            category: category.charAt(0).toUpperCase() + category.slice(1),
            items: categoryData 
        });
    });
};

module.exports = {
    renderHome,
    renderAbout,
    renderServices,
    renderContact,
    renderLogin,
    renderRegister,
    renderMenuCategory
};


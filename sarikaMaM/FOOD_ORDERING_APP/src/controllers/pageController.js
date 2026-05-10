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

module.exports = {
    renderHome,
    renderAbout,
    renderServices,
    renderContact,
    renderLogin,
    renderRegister
};

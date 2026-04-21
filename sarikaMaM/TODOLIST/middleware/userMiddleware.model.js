// Middleware for logging requests
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
};

// Middleware for basic validation (example: check if email is provided)
const validateTodo = (req, res, next) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).send('Name and email are required');
    }
    next();
};

module.exports = {
    logger,
    validateTodo
};
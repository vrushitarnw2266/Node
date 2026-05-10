const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.render('register', { page: 'register', error: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            const token = generateToken(user._id);
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            });
            res.redirect('/');
        } else {
            res.render('register', { page: 'register', error: 'Invalid user data' });
        }
    } catch (error) {
        res.render('register', { page: 'register', error: 'Server error during registration' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id);
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
            res.redirect('/');
        } else {
            res.render('login', { page: 'login', error: 'Invalid email or password' });
        }
    } catch (error) {
        res.render('login', { page: 'login', error: 'Server error during login' });
    }
};

const logoutUser = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.redirect('/');
};

module.exports = { registerUser, loginUser, logoutUser };

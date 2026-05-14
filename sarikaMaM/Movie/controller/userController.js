const User = require('../models/userModel');

const signup = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, fullname } = req.body;
    if (password !== confirmPassword) return res.status(400).send('Passwords do not match');

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) return res.status(400).send('User already exists');

    const newUser = new User({ username, email, password, fullname });
    await newUser.save();

    res.redirect('/login');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const login = async (req, res) => {
  try {
    
    const { username, password } = req.body;
    const user = await User.findOne({ $or: [{ username }, { email: username }] }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).send('Invalid credentials');
    }

    // Set cookie for user session
    res.cookie('userId', user._id.toString(), { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.redirect('/');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const logout = (req, res) => {
  res.clearCookie('userId');
  res.redirect('/login');
};

const getUserProfile = async (req, res) => {
  res.status(200).json({ message: 'Profile endpoint' });
};

module.exports = { signup, login, logout, getUserProfile };

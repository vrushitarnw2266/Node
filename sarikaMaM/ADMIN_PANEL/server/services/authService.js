const User = require('../models/User');

const registerUser = async (userData) => {
  const { name, email, password, role, avatar } = userData;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    avatar
  });

  return user;
};

module.exports = {
  registerUser
};

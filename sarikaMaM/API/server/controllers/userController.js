const User = require('../models/User');
const Task = require('../models/Task');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ name: 1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Prevent changing own role (otherwise admin can lock themselves out)
    if (user._id.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error('Cannot update your own role');
    }

    const { role } = req.body;
    if (!role || !['user', 'admin'].includes(role)) {
      res.status(400);
      throw new Error('Please provide a valid role (user or admin)');
    }

    user.role = role;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user and their tasks
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error('Cannot delete your own admin account');
    }

    // Delete all tasks associated with this user
    await Task.deleteMany({ assignedTo: user._id });

    // Delete user
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User and their tasks deleted successfully', userId: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  updateUserRole,
  deleteUser,
};

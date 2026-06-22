const Task = require('../models/Task');
const Category = require('../models/Category');
const User = require('../models/User');

// GET all tasks (with multiuser and admin capabilities)
exports.getTasks = async (req, res) => {
  try {
    const showAll = req.query.all === 'true';
    let query = { user: req.user._id };
    let viewTitle = 'My Tasks';

    // If admin and requests all tasks, query all tasks
    if (showAll && req.user.role === 'admin') {
      query = {};
      viewTitle = 'All User Tasks';
    }

    const tasks = await Task.find(query)
      .populate('category')
      .populate('user')
      .sort({ createdAt: -1 });

    res.render('taskList', {
      tasks,
      viewTitle,
      showAll,
      success: req.query.success || null,
      error: req.query.error || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to retrieve tasks', title: 'Error' });
  }
};

// GET task creation form
exports.getTaskCreate = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    const users = req.user.role === 'admin' ? await User.find().sort({ username: 1 }) : [];

    res.render('taskForm', {
      task: null,
      categories,
      users,
      title: 'Create Task'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to open task form', title: 'Error' });
  }
};

// POST create task
exports.postTaskCreate = async (req, res) => {
  const { title, description, category, assignedUser } = req.body;

  try {
    // Determine user assignment
    let targetUserId = req.user._id;
    if (req.user.role === 'admin' && assignedUser) {
      targetUserId = assignedUser;
    }

    // Verify category exists
    const cat = await Category.findById(category);
    if (!cat) {
      return res.status(400).render('error', { message: 'Invalid category specified', title: 'Bad Request' });
    }

    // Create task
    const task = new Task({
      title,
      description,
      category,
      user: targetUserId
    });
    await task.save();

    // Update user's tasks array reference
    await User.findByIdAndUpdate(targetUserId, { $push: { tasks: task._id } });

    res.redirect('/tasks?success=Task created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to create task', title: 'Error' });
  }
};

// GET task edit form
exports.getTaskEdit = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).render('error', { message: 'Task not found', title: 'Not Found' });
    }

    // Authorization check
    if (req.user.role !== 'admin' && task.user.toString() !== req.user._id.toString()) {
      return res.status(403).render('error', { message: 'Unauthorized access to this task', title: 'Forbidden' });
    }

    const categories = await Category.find().sort({ name: 1 });
    const users = req.user.role === 'admin' ? await User.find().sort({ username: 1 }) : [];

    res.render('taskForm', {
      task,
      categories,
      users,
      title: 'Edit Task'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to load task details', title: 'Error' });
  }
};

// POST update task
exports.postTaskEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, status, assignedUser } = req.body;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).render('error', { message: 'Task not found', title: 'Not Found' });
    }

    // Authorization check
    if (req.user.role !== 'admin' && task.user.toString() !== req.user._id.toString()) {
      return res.status(403).render('error', { message: 'Unauthorized access to this task', title: 'Forbidden' });
    }

    const oldUserId = task.user.toString();
    let newUserId = oldUserId;

    if (req.user.role === 'admin' && assignedUser) {
      newUserId = assignedUser;
    }

    task.title = title;
    task.description = description;
    task.category = category;
    task.status = status || 'pending';
    task.user = newUserId;

    await task.save();

    // If the assigned user was changed, update tasks lists for both users
    if (oldUserId !== newUserId) {
      await User.findByIdAndUpdate(oldUserId, { $pull: { tasks: task._id } });
      await User.findByIdAndUpdate(newUserId, { $push: { tasks: task._id } });
    }

    res.redirect('/tasks?success=Task updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to update task', title: 'Error' });
  }
};

// POST delete task
exports.postTaskDelete = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).render('error', { message: 'Task not found', title: 'Not Found' });
    }

    // Authorization check
    if (req.user.role !== 'admin' && task.user.toString() !== req.user._id.toString()) {
      return res.status(403).render('error', { message: 'Unauthorized access to this task', title: 'Forbidden' });
    }

    // Remove task
    await Task.findByIdAndDelete(id);

    // Remove task reference from user
    await User.findByIdAndUpdate(task.user, { $pull: { tasks: task._id } });

    res.redirect('/tasks?success=Task deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to delete task', title: 'Error' });
  }
};

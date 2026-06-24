const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get all tasks (Admin gets all, User gets assigned to them)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    let tasks;

    if (req.user.role === 'admin') {
      // Admin sees everything
      tasks = await Task.find({})
        .populate('assignedTo', 'name email role')
        .populate('createdBy', 'name email role')
        .sort({ createdAt: -1 });
    } else {
      // User sees only tasks assigned to them
      tasks = await Task.find({ assignedTo: req.user._id })
        .populate('assignedTo', 'name email role')
        .populate('createdBy', 'name email role')
        .sort({ createdAt: -1 });
    }

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, category, assignedTo } = req.body;

    if (!title || !dueDate) {
      res.status(400);
      throw new Error('Please provide title and due date');
    }

    let taskAssignee = req.user._id;

    // If admin is creating the task, they can assign it to someone else
    if (req.user.role === 'admin' && assignedTo) {
      // Check if target user exists
      const userExists = await User.findById(assignedTo);
      if (!userExists) {
        res.status(404);
        throw new Error('Assigned user not found');
      }
      taskAssignee = assignedTo;
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate,
      category: category || 'General',
      assignedTo: taskAssignee,
      createdBy: req.user._id,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email role');

    res.status(201).json(populatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Check ownership: Admins can edit anything, Users can only edit tasks assigned to them
    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }

    const { title, description, status, priority, dueDate, category, assignedTo } = req.body;

    // Apply updates
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
    if (category) task.category = category;

    // Admins can reassign tasks
    if (req.user.role === 'admin' && assignedTo) {
      const userExists = await User.findById(assignedTo);
      if (!userExists) {
        res.status(404);
        throw new Error('New assigned user not found');
      }
      task.assignedTo = assignedTo;
    }

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email role');

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Check ownership: Admins can delete anything, Users can only delete their own tasks
    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this task');
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully', taskId: req.params.id });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task stats for dashboard cards
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { assignedTo: req.user._id };
    const tasks = await Task.find(query);

    const stats = {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      highPriority: tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length,
    };

    res.json(stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};

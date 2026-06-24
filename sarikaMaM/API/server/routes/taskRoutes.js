const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // protect all task routes

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/stats')
  .get(getTaskStats);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;

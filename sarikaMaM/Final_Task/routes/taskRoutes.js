const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { requireAuth } = require('../middleware/authMiddleware');

// All task routes require authentication
router.use(requireAuth);

router.get('/', taskController.getTasks);
router.get('/create', taskController.getTaskCreate);
router.post('/create', taskController.postTaskCreate);
router.get('/edit/:id', taskController.getTaskEdit);
router.post('/edit/:id', taskController.postTaskEdit);
router.post('/delete/:id', taskController.postTaskDelete);

module.exports = router;

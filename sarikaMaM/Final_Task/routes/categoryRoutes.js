const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { requireAuth, authorizeRoles } = require('../middleware/authMiddleware');

// All category routes require authentication
router.use(requireAuth);

// Anyone logged in can see categories
router.get('/', categoryController.getCategories);

// Only admins can create or delete categories
router.post('/create', authorizeRoles('admin'), categoryController.postCategoryCreate);
router.post('/delete/:id', authorizeRoles('admin'), categoryController.postCategoryDelete);

module.exports = router;

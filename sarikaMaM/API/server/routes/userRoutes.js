const express = require('express');
const router = express.Router();
const {
  getUsers,
  updateUserRole,
  deleteUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect); // protect all user routes
router.use(admin);   // restrict to admin role only

router.route('/')
  .get(getUsers);

router.route('/:id/role')
  .put(updateUserRole);

router.route('/:id')
  .delete(deleteUser);

module.exports = router;

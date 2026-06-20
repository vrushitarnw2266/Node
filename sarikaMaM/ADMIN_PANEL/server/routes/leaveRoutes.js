const express = require('express');
const router = express.Router();
const {
  getAllLeaves,
  applyLeave,
  updateLeaveStatus
} = require('../controllers/leaveController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
  .get(getAllLeaves)
  .post(applyLeave);

router.route('/:id')
  .patch(authorize('admin'), updateLeaveStatus);

module.exports = router;

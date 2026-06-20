const express = require('express');
const router = express.Router();
const {
  getAllFeedback,
  createFeedback
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
  .get(getAllFeedback)
  .post(authorize('student'), createFeedback);

module.exports = router;

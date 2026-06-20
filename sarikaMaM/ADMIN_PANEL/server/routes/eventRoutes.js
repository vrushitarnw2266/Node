const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
  .get(getAllEvents)
  .post(authorize('admin'), createEvent);

router.route('/:id')
  .get(getEventById)
  .put(authorize('admin'), updateEvent)
  .delete(authorize('admin'), deleteEvent);

module.exports = router;

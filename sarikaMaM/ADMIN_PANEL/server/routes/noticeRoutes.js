const express = require('express');
const router = express.Router();
const {
  getAllNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice
} = require('../controllers/noticeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
  .get(getAllNotices)
  .post(authorize('admin', 'faculty'), createNotice);

router.route('/:id')
  .get(getNoticeById)
  .put(authorize('admin', 'faculty'), updateNotice)
  .delete(authorize('admin', 'faculty'), deleteNotice);

module.exports = router;

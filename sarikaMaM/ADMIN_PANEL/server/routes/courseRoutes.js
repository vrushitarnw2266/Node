const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
  .get(getAllCourses)
  .post(authorize('admin'), createCourse);

router.route('/:id')
  .get(getCourseById)
  .put(authorize('admin'), updateCourse)
  .delete(authorize('admin'), deleteCourse);

module.exports = router;

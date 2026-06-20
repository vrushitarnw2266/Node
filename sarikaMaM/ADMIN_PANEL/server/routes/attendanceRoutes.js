const express = require('express');
const router = express.Router();
const {
  getAttendanceByDateAndCourse,
  markAttendance,
  getStudentAttendanceSummary
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
  .get(getAttendanceByDateAndCourse)
  .post(authorize('admin', 'faculty'), markAttendance);

router.route('/student/:studentId')
  .get(getStudentAttendanceSummary);

module.exports = router;

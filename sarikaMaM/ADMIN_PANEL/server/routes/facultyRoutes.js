const express = require('express');
const router = express.Router();
const {
  getAllFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty
} = require('../controllers/facultyController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect); // Require authentication for all faculty routes

router.route('/')
  .get(getAllFaculty)
  .post(authorize('admin'), createFaculty);

router.route('/:id')
  .get(getFacultyById)
  .put(authorize('admin'), updateFaculty)
  .delete(authorize('admin'), deleteFaculty);

module.exports = router;

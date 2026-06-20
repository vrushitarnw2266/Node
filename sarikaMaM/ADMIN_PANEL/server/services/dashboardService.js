const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Course = require('../models/Course');
const Event = require('../models/Event');
const Leave = require('../models/Leave');
const Feedback = require('../models/Feedback');

const getDashboardStats = async () => {
  const [
    studentsCount,
    facultyCount,
    coursesCount,
    eventsCount,
    pendingLeavesCount,
    feedbackRecords
  ] = await Promise.all([
    Student.countDocuments(),
    Faculty.countDocuments(),
    Course.countDocuments(),
    Event.countDocuments(),
    Leave.countDocuments({ status: 'pending' }),
    Feedback.find()
  ]);

  const avgRating = feedbackRecords.length
    ? (feedbackRecords.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbackRecords.length).toFixed(1)
    : '0.0';

  return {
    students: studentsCount,
    faculty: facultyCount,
    courses: coursesCount,
    events: eventsCount,
    pendingLeaves: pendingLeavesCount,
    avgRating
  };
};

module.exports = {
  getDashboardStats
};

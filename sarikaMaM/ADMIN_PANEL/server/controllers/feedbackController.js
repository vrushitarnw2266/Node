const Feedback = require('../models/Feedback');

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Private
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create feedback
// @route   POST /api/feedback
// @access  Private/Student
const createFeedback = async (req, res) => {
  const { courseName, facultyName, rating, comment } = req.body;

  try {
    const feedback = await Feedback.create({
      studentName: req.user ? req.user.name : 'Anonymous Student',
      courseName,
      facultyName,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllFeedback,
  createFeedback
};

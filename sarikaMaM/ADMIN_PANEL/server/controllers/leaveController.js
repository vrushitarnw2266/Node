const Leave = require('../models/Leave');

// @desc    Get all leaves
// @route   GET /api/leaves
// @access  Private
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Apply for leave
// @route   POST /api/leaves
// @access  Private
const applyLeave = async (req, res) => {
  const { type, reason, startDate, endDate } = req.body;

  try {
    const leave = await Leave.create({
      applicantName: req.user ? req.user.name : 'Unknown User',
      role: req.user ? req.user.role : 'student',
      type,
      reason,
      startDate,
      endDate,
      status: 'pending'
    });

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update leave status
// @route   PATCH /api/leaves/:id
// @access  Private/Admin
const updateLeaveStatus = async (req, res) => {
  const { status } = req.body;

  try {
    if (!status || !['pending', 'approved', 'rejected'].includes(status.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid leave status provided' });
    }

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave record not found' });
    }

    leave.status = status.toLowerCase();
    const updatedLeave = await leave.save();

    res.json(updatedLeave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllLeaves,
  applyLeave,
  updateLeaveStatus
};

const Faculty = require('../models/Faculty');
const User = require('../models/User');

// @desc    Get all faculty
// @route   GET /api/faculty
// @access  Private
const getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find();
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get faculty by ID
// @route   GET /api/faculty/:id
// @access  Private
const getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create faculty
// @route   POST /api/faculty
// @access  Private/Admin
const createFaculty = async (req, res) => {
  const { name, email, facultyId, phone, department, designation, joiningDate } = req.body;

  try {
    // Check if faculty already exists in DB
    const facultyExists = await Faculty.findOne({ $or: [{ email }, { facultyId }] });
    if (facultyExists) {
      return res.status(400).json({ message: 'Faculty with this email or ID already exists' });
    }

    // Check if user account already exists
    let user = await User.findOne({ email });
    if (!user) {
      // Create user login credentials
      user = await User.create({
        name,
        email,
        password: 'password123', // Default password
        role: 'faculty',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
      });
    }

    // Create faculty profile
    const faculty = await Faculty.create({
      user: user._id,
      facultyId,
      name,
      email,
      phone,
      department,
      designation,
      joiningDate,
      status: 'active'
    });

    res.status(201).json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update faculty
// @route   PUT /api/faculty/:id
// @access  Private/Admin
const updateFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Fields to update
    const fieldsToUpdate = [
      'name', 'email', 'facultyId', 'phone', 'department',
      'designation', 'joiningDate', 'status'
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        faculty[field] = req.body[field];
      }
    });

    const updatedFaculty = await faculty.save();

    // Update corresponding user details if linked
    if (faculty.user) {
      await User.findByIdAndUpdate(faculty.user, {
        name: faculty.name,
        email: faculty.email
      });
    }

    res.json(updatedFaculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete faculty
// @route   DELETE /api/faculty/:id
// @access  Private/Admin
const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Remove matching login user
    if (faculty.user) {
      await User.findByIdAndDelete(faculty.user);
    }

    await faculty.deleteOne();

    res.json({ success: true, message: 'Faculty deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty
};

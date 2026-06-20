const Student = require('../models/Student');
const User = require('../models/User');

// @desc    Get all students
// @route   GET /api/students
// @access  Private
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create student
// @route   POST /api/students
// @access  Private/Admin
const createStudent = async (req, res) => {
  const { name, email, rollNo, phone, course, department, year, semester } = req.body;

  try {
    // Check if student already exists in DB
    const studentExists = await Student.findOne({ $or: [{ email }, { rollNo }] });
    if (studentExists) {
      return res.status(400).json({ message: 'Student with this email or roll number already exists' });
    }

    // Check if user account already exists
    let user = await User.findOne({ email });
    if (!user) {
      // Create authenticated user login account
      user = await User.create({
        name,
        email,
        password: 'password123', // Default password
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
      });
    }

    // Create student profile
    const student = await Student.create({
      user: user._id,
      rollNo,
      name,
      email,
      phone,
      course,
      department,
      year,
      semester,
      status: 'active',
      presentDays: 45, // Defaults matching seed statistics
      totalDays: 50
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Fields to update
    const fieldsToUpdate = [
      'name', 'email', 'rollNo', 'phone', 'course',
      'department', 'year', 'semester', 'status',
      'presentDays', 'totalDays'
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        student[field] = req.body[field];
      }
    });

    const updatedStudent = await student.save();

    // Also update matching User account details if linked
    if (student.user) {
      await User.findByIdAndUpdate(student.user, {
        name: student.name,
        email: student.email
      });
    }

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Remove matching login user
    if (student.user) {
      await User.findByIdAndDelete(student.user);
    }

    await student.deleteOne();

    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};

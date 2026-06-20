const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rollNo: {
      type: String,
      required: [true, 'Please add a roll number'],
      unique: true
    },
    name: {
      type: String,
      required: [true, 'Please add a name']
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true
    },
    phone: {
      type: String
    },
    course: {
      type: String,
      required: [true, 'Please specify the course']
    },
    department: {
      type: String,
      required: [true, 'Please specify the department']
    },
    year: {
      type: String,
      required: [true, 'Please specify the year']
    },
    semester: {
      type: String,
      required: [true, 'Please specify the semester']
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    presentDays: {
      type: Number,
      default: 0
    },
    totalDays: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model('Student', StudentSchema);

const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Please add a course code'],
      unique: true
    },
    name: {
      type: String,
      required: [true, 'Please add a course name']
    },
    department: {
      type: String,
      required: [true, 'Please specify the department']
    },
    credits: {
      type: Number,
      required: [true, 'Please specify course credits']
    },
    duration: {
      type: String,
      required: [true, 'Please specify the duration']
    },
    syllabus: {
      type: String
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model('Course', CourseSchema);

const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: String, // String to accommodate both MongoDB objectId and seed string IDs (e.g. 'std-1')
      required: true
    },
    studentName: {
      type: String,
      required: true
    },
    date: {
      type: String, // Stored as YYYY-MM-DD string to simplify front-end queries
      required: true
    },
    status: {
      type: String,
      enum: ['present', 'absent'],
      required: true
    },
    courseCode: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Unique index to prevent duplicate attendance markings for same student, course and date
AttendanceSchema.index({ studentId: 1, date: 1, courseCode: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);

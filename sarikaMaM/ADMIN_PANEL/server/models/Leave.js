const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema(
  {
    applicantName: {
      type: String,
      required: [true, 'Please add an applicant name']
    },
    role: {
      type: String,
      enum: ['student', 'faculty'],
      required: [true, 'Please specify the applicant role']
    },
    type: {
      type: String,
      required: [true, 'Please specify leave type']
    },
    reason: {
      type: String,
      required: [true, 'Please specify the reason']
    },
    startDate: {
      type: String, // YYYY-MM-DD
      required: [true, 'Please specify the start date']
    },
    endDate: {
      type: String, // YYYY-MM-DD
      required: [true, 'Please specify the end date']
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model('Leave', LeaveSchema);

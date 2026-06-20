const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      default: 'Anonymous Student'
    },
    courseName: {
      type: String,
      required: [true, 'Please specify the course name']
    },
    facultyName: {
      type: String,
      required: [true, 'Please specify the faculty name']
    },
    rating: {
      type: Number,
      required: [true, 'Please specify a rating'],
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment']
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model('Feedback', FeedbackSchema);

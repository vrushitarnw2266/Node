const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a notice title']
    },
    content: {
      type: String,
      required: [true, 'Please add notice content']
    },
    category: {
      type: String,
      required: [true, 'Please specify a category']
    },
    date: {
      type: String, // YYYY-MM-DD
      required: [true, 'Please add a date']
    },
    author: {
      type: String,
      required: [true, 'Please specify an author']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model('Notice', NoticeSchema);

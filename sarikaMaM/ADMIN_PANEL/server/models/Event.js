const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an event title']
    },
    description: {
      type: String,
      required: [true, 'Please add an event description']
    },
    date: {
      type: String, // YYYY-MM-DD
      required: [true, 'Please add an event date']
    },
    time: {
      type: String, // HH:MM AM/PM
      required: [true, 'Please add an event time']
    },
    venue: {
      type: String,
      required: [true, 'Please add an event venue']
    },
    organizer: {
      type: String,
      required: [true, 'Please add an event organizer']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model('Event', EventSchema);

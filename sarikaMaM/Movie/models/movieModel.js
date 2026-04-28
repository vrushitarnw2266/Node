const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  year: Number,
  genre: [String],
  rating: { type: Number, default: 0 },
  director: String,
  cast: [String],
  duration: Number,
  language: { type: String, default: 'English' },
  country: String,
  posterUrl: String,
  budget: Number,
  boxOffice: Number,
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {timestamps: true});

module.exports = mongoose.model('Movie', movieSchema);

const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    facultyId: {
      type: String,
      required: [true, 'Please add a faculty ID'],
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
    department: {
      type: String,
      required: [true, 'Please specify the department']
    },
    designation: {
      type: String,
      required: [true, 'Please specify the designation']
    },
    joiningDate: {
      type: String,
      required: [true, 'Please specify the joining date']
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model('Faculty', FacultySchema);

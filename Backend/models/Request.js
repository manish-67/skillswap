const mongoose = require('mongoose');

const requestSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // Link to the User who created the request
      required: true,
      ref: 'User', // Refers to the 'User' model
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: true,
      enum: ['Academics', 'Arts & Crafts', 'Home Services', 'Tech & IT', 'Language', 'Health & Wellness', 'Other'],
    },
    skills: [ // Specific skills requested (e.g., ['Figma', 'Proofreading'])
      {
        type: String,
        required: true,
      },
    ],
    location: { // Redundant with user's location, but good for filtering requests specific to a post
      type: String,
      required: true,
    },
    status: { // e.g., 'open', 'matched', 'completed'
      type: String,
      enum: ['open', 'matched', 'completed'],
      default: 'open',
    },
    // Could add a 'deadline' field, preferred time, etc.
  },
  {
    timestamps: true,
  }
);

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
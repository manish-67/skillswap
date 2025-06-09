const mongoose = require('mongoose');

const offerSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // Link to the User who created the offer
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
    skills: [ // Specific skills offered (e.g., ['React', 'Node.js'])
      {
        type: String,
        required: true,
      },
    ],
    location: { // Redundant with user's location, but good for filtering offers specific to a post
      type: String,
      required: true,
    },
    status: { // e.g., 'active', 'paused', 'completed'
      type: String,
      enum: ['active', 'paused', 'completed'],
      default: 'active',
    },
    // Could add images, availability, etc. later
  },
  {
    timestamps: true, // `createdAt`, `updatedAt`
  }
);

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
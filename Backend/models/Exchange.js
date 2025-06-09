const mongoose = require('mongoose');

const exchangeSchema = mongoose.Schema(
  {
    proposer: { // The user initiating the exchange
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    accepter: { // The user receiving the proposal
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // Link the exchange to specific offers/requests if applicable
    offeredSkillRef: { // If proposer is offering a skill
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer',
      default: null,
    },
    requestedSkillRef: { // If proposer is responding to a request
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
      default: null,
    },
    proposedTerms: { // A brief description of what's being exchanged
      type: String,
      required: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Exchange = mongoose.model('Exchange', exchangeSchema);

module.exports = Exchange;
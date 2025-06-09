const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    // Optional: reference to the offer/request this message is about
    // This helps in linking conversations to specific listings
    relatedOffer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer',
      default: null, // Not all messages will be tied to an offer/request
    },
    relatedRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
      default: null,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
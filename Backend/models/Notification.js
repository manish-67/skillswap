const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
  {
    user: { // The user to whom this notification is sent
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    message: {
      type: String,
      required: true,
    },
    type: { // e.g., 'new_message', 'exchange_proposal', 'exchange_status_update'
      type: String,
      required: true,
      enum: ['new_message', 'exchange_proposal', 'exchange_status_update', 'general'],
    },
    link: { // Optional: A frontend route to navigate to when clicked
      type: String,
      default: null,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
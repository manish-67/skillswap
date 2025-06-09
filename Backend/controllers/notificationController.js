const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// @desc    Get notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 }); // Latest first
  res.json(notifications);
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    if (notification.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to mark this notification as read');
    }
    notification.read = true;
    const updatedNotification = await notification.save();
    res.json(updatedNotification);
  } else {
    res.status(404);
    throw new Error('Notification not found');
  }
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    if (notification.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this notification');
    }
    await Notification.deleteOne({ _id: notification._id });
    res.json({ message: 'Notification removed' });
  } else {
    res.status(404);
    throw new Error('Notification not found');
  }
});

// Helper function to create a notification (called from other controllers)
const createNotification = async (userId, message, type, link = null) => {
  try {
    const notification = new Notification({
      user: userId,
      message,
      type,
      link,
    });
    await notification.save();
    // console.log(`Notification created for user ${userId}: ${message}`);
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

module.exports = {
  getMyNotifications,
  markNotificationAsRead,
  deleteNotification,
  createNotification, // Export the helper function
};
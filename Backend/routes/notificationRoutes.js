const express = require('express');
const { getMyNotifications, markNotificationAsRead, deleteNotification } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All notification routes are private
router.route('/').get(protect, getMyNotifications);
router.route('/:id/read').put(protect, markNotificationAsRead);
router.route('/:id').delete(protect, deleteNotification);

module.exports = router;
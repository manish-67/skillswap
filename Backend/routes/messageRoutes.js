const express = require('express');
const { sendMessage, getMyMessages, getConversation } = require('../controllers/messageExchangeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All message routes are private
router.route('/').post(protect, sendMessage).get(protect, getMyMessages);
router.route('/conversation/:otherUserId').get(protect, getConversation);

module.exports = router;
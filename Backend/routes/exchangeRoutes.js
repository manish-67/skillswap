const express = require('express');
const { createExchangeProposal, getMyExchanges, updateExchangeStatus } = require('../controllers/messageExchangeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All exchange routes are private
router.route('/').post(protect, createExchangeProposal).get(protect, getMyExchanges);
router.route('/:id').put(protect, updateExchangeStatus);

module.exports = router;
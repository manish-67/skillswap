const express = require('express');
const { getOffers, createOffer } = require('../controllers/offerRequestController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .get(getOffers)
  .post(protect, createOffer); // <-- Add this line

module.exports = router;
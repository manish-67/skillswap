const express = require('express');
const { getRequests, createRequest, getRequestById } = require('../controllers/offerRequestController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .get(getRequests)
  .post(protect, createRequest);

router.route('/:id').get(getRequestById); // <-- Add this line if missing

module.exports = router;


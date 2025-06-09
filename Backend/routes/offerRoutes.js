const express = require('express');
const { getOffers } = require('../controllers/offerRequestController');
const router = express.Router();

router.route('/').get(getOffers);

module.exports = router;
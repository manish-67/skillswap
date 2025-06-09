const express = require('express');
const { getRequests } = require('../controllers/offerRequestController');
const router = express.Router();

router.route('/').get(getRequests);

module.exports = router;


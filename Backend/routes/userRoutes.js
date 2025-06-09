const express = require('express');
const {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getUserById
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Authenticate user and get token
router.post('/login', authUser);

// Get user profile (protected)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

// Public route to get any user's profile by ID
router.route('/:id').get(getUserById);

module.exports = router;
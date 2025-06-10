const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // req.user is populated by the protect middleware
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      aboutMe: user.aboutMe,
      skillsOffered: user.skillsOffered,
      skillsNeeded: user.skillsNeeded,
      location: user.location,
      // No token needed for GET, as it's already authenticated
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Update fields if provided in the request body
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.profilePicture = req.body.profilePicture || user.profilePicture;
    // Allow `aboutMe` to be explicitly set to an empty string
    user.aboutMe = req.body.aboutMe !== undefined ? req.body.aboutMe : user.aboutMe;
    user.location = req.body.location || user.location;

    // Handle skillsOffered and skillsNeeded as arrays
    // Ensure they are arrays before assigning
    if (req.body.skillsOffered !== undefined) {
      user.skillsOffered = Array.isArray(req.body.skillsOffered) ? req.body.skillsOffered : user.skillsOffered;
    }
    if (req.body.skillsNeeded !== undefined) {
      user.skillsNeeded = Array.isArray(req.body.skillsNeeded) ? req.body.skillsNeeded : user.skillsNeeded;
    }


    // Only update password if explicitly provided AND different
    if (req.body.password) {
      user.password = req.body.password; // Mongoose pre-save hook will hash this
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
      aboutMe: updatedUser.aboutMe,
      skillsOffered: updatedUser.skillsOffered,
      skillsNeeded: updatedUser.skillsNeeded,
      location: updatedUser.location,
      token: generateToken(updatedUser._id), // Send a new token because user data changed, token might need refreshing on client
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID (Public profile data)
// @route   GET /api/users/:id
// @access  Public
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password'); // Exclude password

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email, // You can remove this if you don't want to expose email
      profilePicture: user.profilePicture,
      aboutMe: user.aboutMe,
      skillsOffered: user.skillsOffered,
      skillsNeeded: user.skillsNeeded,
      location: user.location,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, location } = req.body;

  if (!name || !email || !password || !location) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    location,
    // Optionally add profilePicture, aboutMe, etc.
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      aboutMe: user.aboutMe,
      skillsOffered: user.skillsOffered,
      skillsNeeded: user.skillsNeeded,
      location: user.location,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      aboutMe: user.aboutMe,
      skillsOffered: user.skillsOffered,
      skillsNeeded: user.skillsNeeded,
      location: user.location,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getUserById
};
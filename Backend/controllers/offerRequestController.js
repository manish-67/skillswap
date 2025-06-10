const asyncHandler = require('express-async-handler');
const Offer = require('../models/Offer');
const Request = require('../models/Request');
const User = require('../models/User');

const categories = ['Academics', 'Arts & Crafts', 'Home Services', 'Tech & IT', 'Language', 'Health & Wellness', 'Other'];

// --- Offer Controllers ---

// @desc    Get all offers with optional search and filters
// @route   GET /api/offers?keyword=design&category=Tech%20%26%20IT&location=Delhi
// @access  Public
const getOffers = asyncHandler(async (req, res) => {
  const offers = await Offer.find({ status: 'active' }) // <-- change 'open' to 'active'
    .populate('user', 'name profilePicture location')
    .sort({ createdAt: -1 })
    .lean();
  res.json(offers);
});

// @desc    Get single offer by ID
// @route   GET /api/offers/:id
// @access  Public
const getOfferById = asyncHandler(async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error('Invalid offer ID');
  }
  const offer = await Offer.findById(req.params.id).populate('user', 'name email profilePicture location');

  if (offer) {
    res.json(offer);
  } else {
    res.status(404);
    throw new Error('Offer not found');
  }
});

// @desc    Create new offer
// @route   POST /api/offers
// @access  Private
const createOffer = asyncHandler(async (req, res) => {
  const { title, description, category, skills, location } = req.body;

  if (!title || !description || !category || !skills || skills.length === 0 || !location) {
    res.status(400);
    throw new Error('Please fill all required fields for the offer');
  }

  if (!categories.includes(category)) {
    res.status(400);
    throw new Error(`Invalid category. Must be one of: ${categories.join(', ')}`);
  }

  const offer = new Offer({
    user: req.user._id, // User ID comes from the protect middleware
    title,
    description,
    category,
    skills,
    location,
  });

  const createdOffer = await offer.save();
  res.status(201).json(createdOffer);
});

// @desc    Update an offer
// @route   PUT /api/offers/:id
// @access  Private
const updateOffer = asyncHandler(async (req, res) => {
  const { title, description, category, skills, location, status } = req.body;

  const offer = await Offer.findById(req.params.id);

  if (offer) {
    // Ensure the logged-in user is the owner of the offer
    if (offer.user.toString() !== req.user._id.toString()) {
      res.status(401); // Unauthorized
      throw new Error('Not authorized to update this offer');
    }

    offer.title = title || offer.title;
    offer.description = description || offer.description;
    offer.category = category || offer.category;
    offer.skills = skills || offer.skills;
    offer.location = location || offer.location;
    offer.status = status || offer.status; // Allow status update

    const updatedOffer = await offer.save();
    res.json(updatedOffer);
  } else {
    res.status(404);
    throw new Error('Offer not found');
  }
});

// @desc    Delete an offer
// @route   DELETE /api/offers/:id
// @access  Private
const deleteOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);

  if (offer) {
    // Ensure the logged-in user is the owner
    if (offer.user.toString() !== req.user._id.toString()) {
      res.status(401); // Unauthorized
      throw new Error('Not authorized to delete this offer');
    }

    await Offer.deleteOne({ _id: offer._id }); // Use deleteOne
    res.json({ message: 'Offer removed' });
  } else {
    res.status(404);
    throw new Error('Offer not found');
  }
});


// --- Request Controllers ---

// @desc    Get all requests with optional search and filters
// @route   GET /api/requests
// @access  Public
const getRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find({ status: 'open' }) // <-- fix here
    .populate('user', 'name profilePicture location')
    .sort({ createdAt: -1 });
  res.json(requests);
});

// @desc    Get single request by ID
// @route   GET /api/requests/:id
// @access  Public
const getRequestById = asyncHandler(async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error('Invalid request ID');
  }
  const request = await Request.findById(req.params.id).populate('user', 'name email profilePicture location');

  if (request) {
    res.json(request);
  } else {
    res.status(404);
    throw new Error('Request not found');
  }
});

// @desc    Create new request
// @route   POST /api/requests
// @access  Private
const createRequest = asyncHandler(async (req, res) => {
  const { title, description, category, skills, location } = req.body;

  if (!title || !description || !category || !skills || skills.length === 0 || !location) {
    res.status(400);
    throw new Error('Please fill all required fields for the request');
  }

  if (!categories.includes(category)) {
    res.status(400);
    throw new Error(`Invalid category. Must be one of: ${categories.join(', ')}`);
  }

  const request = new Request({
    user: req.user._id, // User ID comes from the protect middleware
    title,
    description,
    category,
    skills,
    location,
  });

  const createdRequest = await request.save();
  res.status(201).json(createdRequest);
});

// @desc    Update a request
// @route   PUT /api/requests/:id
// @access  Private
const updateRequest = asyncHandler(async (req, res) => {
  const { title, description, category, skills, location, status } = req.body;

  const request = await Request.findById(req.params.id);

  if (request) {
    // Ensure the logged-in user is the owner
    if (request.user.toString() !== req.user._id.toString()) {
      res.status(401); // Unauthorized
      throw new Error('Not authorized to update this request');
    }

    request.title = title || request.title;
    request.description = description || request.description;
    request.category = category || request.category;
    request.skills = skills || request.skills;
    request.location = location || request.location;
    request.status = status || request.status; // Allow status update

    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } else {
    res.status(404);
    throw new Error('Request not found');
  }
});

// @desc    Delete a request
// @route   DELETE /api/requests/:id
// @access  Private
const deleteRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (request) {
    // Ensure the logged-in user is the owner
    if (request.user.toString() !== req.user._id.toString()) {
      res.status(401); // Unauthorized
      throw new Error('Not authorized to delete this request');
    }

    await Request.deleteOne({ _id: request._id }); // Use deleteOne
    res.json({ message: 'Request removed' });
  } else {
    res.status(404);
    throw new Error('Request not found');
  }
});

module.exports = {
  getOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
  getRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
  categories // Make sure categories are exported
};